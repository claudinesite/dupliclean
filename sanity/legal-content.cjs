const LEGAL_PAGES = {
  'privacy-policy': { id: 'privacyPolicy', title: 'Politique de confidentialité' },
  'terms-of-use': { id: 'termsOfUse', title: 'Conditions d’utilisation' },
  'data-deletion': { id: 'dataDeletion', title: 'Gestion et suppression des données' },
  'third-party-licenses': { id: 'thirdPartyLicenses', title: 'Licences tierces' },
};

// Convert the formatting supported by the legal documents in Studio.
// The existing renderer escapes all HTML; authored content is never raw HTML.
function portableToMarkdown(blocks) {
  return blocks.filter((block) => block?._type === 'block').map((block) => {
    const links = new Map((block.markDefs || []).filter((def) => def._type === 'link').map((def) => [def._key, def.href]));
    const text = (block.children || []).filter((child) => child._type === 'span').map((span) => {
      const marks = span.marks || [];
      let text = String(span.text || '');
      if (marks.includes('code')) text = `\`${text}\``;
      const link = links.get(marks.find((mark) => links.has(mark)));
      if (typeof link === 'string') {
        const href = link.replaceAll('(', '%28').replaceAll(')', '%29');
        text = `[${text}](${href})`;
      }
      if (marks.includes('strong')) text = `**${text}**`;
      if (marks.includes('em')) text = `*${text}*`;
      return text;
    }).join('');
    if (block.listItem === 'bullet') return `- ${text}`;
    if (block.style === 'h2') return `## ${text}`;
    if (block.style === 'h3') return `### ${text}`;
    return text;
  }).join('\n\n');
}

module.exports = { LEGAL_PAGES, portableToMarkdown };
