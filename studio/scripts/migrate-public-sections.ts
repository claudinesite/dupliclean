import {getCliClient} from 'sanity/cli'
import {mkdir, writeFile} from 'node:fs/promises'
import sections from '../sections.json'

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz' || client.config().dataset !== 'production') throw new Error('DupliClean production required')
// Dotted IDs are private in Sanity, even in a public dataset. Copy the latest
// published content and drafts independently to root IDs; keep originals intact.
const oldIds = sections.flatMap(section => [`section.${section.key}`, `drafts.section.${section.key}`])
const originals = await client.fetch<Record<string, unknown>[]>('*[_id in $ids]', {ids: oldIds}, {perspective: 'raw'})
const copies = sections.flatMap(section => {
  const published = originals.find(doc => doc._id === `section.${section.key}`)
  if (!published) throw new Error(`Missing source: ${section.key}`)
  return originals.filter(doc => doc._id === published._id || doc._id === `drafts.${published._id}`).map(doc => {
    const {_id, _rev, _createdAt, _updatedAt, ...content} = doc
    return {...content, _id: String(_id).startsWith('drafts.') ? `drafts.${section.id}` : section.id}
  })
})
if (!process.argv.includes('--execute')) {
  console.log(`Prepared ${copies.length} copies. Add --execute to create missing public sections.`)
} else {
  await mkdir('.migration-backup', {recursive: true})
  await writeFile(`.migration-backup/public-sections-${Date.now()}.json`, JSON.stringify(originals, null, 2))
  let transaction = client.transaction()
  for (const copy of copies) transaction = transaction.createIfNotExists(copy as {_id: string; _type: string})
  await transaction.commit()
  console.log(`Created missing public sections and preserved drafts (${copies.length} source documents).`)
}
