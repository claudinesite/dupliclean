import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const sections = JSON.parse(await readFile(new URL('studio/sections.json', root), 'utf8'));
function projection(field) {
  if (field.type === 'image') return `${field.name}{_type,alt,caption,crop,hotspot,asset->{_id,url,metadata{dimensions}}}`;
  if (field.type === 'object') return `${field.name}{${field.fields.map(projection).join(',')}}`;
  if (field.type === 'array') return `${field.name}[]{_key,${field.of[0].fields.map(projection).join(',')}}`;
  return field.name;
}
const query = `{${sections.map(section => `${JSON.stringify(section.key)}:coalesce(*[_id==${JSON.stringify(section.id)}][0]{${section.fields.map(projection).join(',')}},*[_id=="siteContent"][0].${section.key})`).join(',')}}`;
await writeFile(fileURLToPath(new URL('sanity/content-query.cjs', root)), `module.exports = ${JSON.stringify(query)};\n`);
const englishQuery = `{${sections.map(section => `${JSON.stringify(section.key)}:*[_id==${JSON.stringify(section.id + '-en')}][0]{${section.fields.map(projection).join(',')}}`).join(',')}}`;
await writeFile(new URL('sanity/content-query-en.cjs', root), `module.exports = ${JSON.stringify(englishQuery)};\n`);
console.log('Generated published section query.');
