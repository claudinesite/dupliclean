// Compatibility for bookmarked Decap login URLs after the Sanity migration.
module.exports = function legacyAdmin(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.redirect(302, 'https://dupliclean-admin.sanity.studio/');
};
