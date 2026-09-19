function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((cookie) => cookie.trim().split('='))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join('='))]),
  );
}

function authorizationPage({ status, content }) {
  const origins = (process.env.ORIGIN || 'https://dupliclean.vercel.app')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const message = `authorization:github:${status}:${content}`;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connexion à DupliClean</title>
  </head>
  <body style="font:16px/1.5 system-ui,sans-serif;text-align:center;padding:3rem;background:#F8F2EA;color:#3B1D0F">
    <p>${status === 'success' ? 'Connexion réussie. Cette fenêtre va se fermer.' : 'La connexion a échoué. Fermez cette fenêtre puis réessayez.'}</p>
    <script>
      (function () {
        var allowedOrigins = ${JSON.stringify(origins)};
        var message = ${JSON.stringify(message)};
        if (!window.opener) return;
        function receiveMessage(event) {
          if (!allowedOrigins.includes(event.origin)) return;
          window.removeEventListener('message', receiveMessage, false);
          window.opener.postMessage(message, event.origin);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}

module.exports = async function completeGitHubAuthentication(request, response) {
  const { code, state, error } = request.query || {};
  const cookies = parseCookies(request.headers.cookie);
  const expectedState = cookies.dupliclean_cms_state;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;
  const callbackUrl = process.env.COMPLETE_URL;

  response.setHeader(
    'Set-Cookie',
    'dupliclean_cms_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
  );
  response.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (error || !code || !state || !expectedState || state !== expectedState) {
    response.status(400).send(authorizationPage({ status: 'error', content: 'Autorisation refusée ou session expirée.' }));
    return;
  }

  if (!clientId || !clientSecret || !callbackUrl) {
    response.status(500).send(authorizationPage({ status: 'error', content: 'Configuration OAuth incomplète.' }));
    return;
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'DupliClean-Decap-CMS',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl,
      }),
    });
    const token = await tokenResponse.json();

    if (!tokenResponse.ok || !token.access_token) {
      throw new Error(token.error_description || token.error || 'GitHub n’a pas renvoyé de jeton.');
    }

    const payload = JSON.stringify({ token: token.access_token, provider: 'github' });
    response.status(200).send(authorizationPage({ status: 'success', content: payload }));
  } catch (error) {
    console.error('[Decap OAuth]', error);
    response.status(502).send(authorizationPage({ status: 'error', content: 'Impossible de terminer la connexion GitHub.' }));
  }
};
