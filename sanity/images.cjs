const imageUrlBuilder = require('@sanity/image-url');
const {PROJECT_ID, DATASET} = require('./client.cjs');
const builder = imageUrlBuilder.createImageUrlBuilder({projectId: PROJECT_ID, dataset: DATASET});

function resolveImages(value, width = 1400) {
  if (Array.isArray(value)) return value.map(item => resolveImages(item, width));
  if (!value || typeof value !== 'object') return value;
  if (value.asset?._id?.startsWith('image-')) {
    return {...value, url: builder.image(value).width(width).fit('max').auto('format').url()};
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveImages(item, key === 'image' ? 256 : 1400)]));
}

module.exports = {resolveImages};
