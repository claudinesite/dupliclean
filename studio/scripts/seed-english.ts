import {getCliClient} from 'sanity/cli'
import sections from '../sections.json'
import english from '../../dist/content/english.json'

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz' || client.config().dataset !== 'production') {
  throw new Error('Select the DupliClean production dataset.')
}
type Fields = Record<string, unknown>
function studioValue(value: unknown, original: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item, index) => studioValue(item, Array.isArray(original) ? original[index] : undefined))
  }
  if (!value || typeof value !== 'object') return value
  const fields = value as Fields
  const source = (original || {}) as Fields
  if ('url' in fields) {
    if (!source.asset) throw new Error('Missing reference for a translated image')
    return {...source, alt: fields.alt, caption: fields.caption}
  }
  const translated: Fields = {}
  if (source._key) translated._key = source._key
  if (source._type) translated._type = source._type
  for (const [key, child] of Object.entries(fields)) translated[key] = studioValue(child, source[key])
  return translated
}
const published = await client.fetch<Fields[]>('*[_id in $ids]', {ids: sections.map(section => section.id)})
let transaction = client.transaction()
for (const {id, type, key} of sections) {
  const source = published.find(doc => doc._id === id)
  if (!source) throw new Error('Missing section ' + id)
  const translated = studioValue(english[key as keyof typeof english], source) as Fields
  transaction = transaction.createIfNotExists({...translated, _type: type, _id: id + '-en'})
}
await transaction.commit()
console.log('English sections are ready. Existing documents were preserved.')
