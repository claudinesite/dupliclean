const LEGAL_PAGES = {
  'privacy-policy': { id: 'privacyPolicy', title: 'Politique de confidentialité' },
  'terms-of-use': { id: 'termsOfUse', title: 'Conditions d’utilisation' },
  'data-deletion': { id: 'dataDeletion', title: 'Gestion et suppression des données' },
};

// The Studio supports paragraphs, two heading levels, bullets, bold and italic.
// The existing renderer escapes all HTML; authored content is never raw HTML.
function portableToMarkdown(blocks) {
  return blocks.filter((block) => block?._type === 'block').map((block) => {
    const text = (block.children || []).filter((child) => child._type === 'span').map((span) => {
      const text = String(span.text || '');
      if (span.marks?.includes('strong')) return `**${text}**`;
      return span.marks?.includes('em') ? `*${text}*` : text;
    }).join('');
    if (block.listItem === 'bullet') return `- ${text}`;
    if (block.style === 'h2') return `## ${text}`;
    if (block.style === 'h3') return `### ${text}`;
    return text;
  }).join('\n\n');
}

module.exports = { LEGAL_PAGES, portableToMarkdown };
