const crypto = require('node:crypto');

module.exports = function beginGitHubAuthentication(request, response) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  const callbackUrl = process.env.COMPLETE_URL;

  if (!clientId || !callbackUrl) {
    response.status(500).send('La connexion Decap n’est pas encore configurée.');
    return;
  }

  const state = crypto.randomBytes(24).toString('hex');
  const codeVerifier = crypto.randomBytes(48).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', callbackUrl);
  authorizeUrl.searchParams.set('scope', 'public_repo');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('code_challenge', codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  response.setHeader(
    'Set-Cookie',
    [
      `dupliclean_cms_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      `dupliclean_cms_verifier=${codeVerifier}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    ],
  );
  response.redirect(302, authorizeUrl.toString());
};
