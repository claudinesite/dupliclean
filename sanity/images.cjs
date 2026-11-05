const {PROJECT_ID, DATASET} = require('./client.cjs');
let builderPromise;

function mapImages(builder, value, width = 1400) {
  if (Array.isArray(value)) return value.map(item => mapImages(builder, item, width));
  if (!value || typeof value !== 'object') return value;
  if (value.asset?._id?.startsWith('image-')) {
    return {...value, url: builder.image(value).width(width).fit('max').auto('format').url()};
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapImages(builder, item, key === 'image' ? 256 : 1400)]));
}

async function resolveImages(value) {
  // The image builder is ESM; dynamic import also works in Vercel's CJS runtime.
  builderPromise ||= import('@sanity/image-url').then(({createImageUrlBuilder}) =>
    createImageUrlBuilder({projectId: PROJECT_ID, dataset: DATASET}));
  return mapImages(await builderPromise, value);
}

module.exports = {resolveImages};
