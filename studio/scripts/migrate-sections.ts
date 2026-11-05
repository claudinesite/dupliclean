import {getCliClient} from 'sanity/cli'
import {mkdir, writeFile} from 'node:fs/promises'
import sections from '../sections.json'

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz' || client.config().dataset !== 'production') {
  throw new Error('This migration must run on DupliClean production only.')
}
const sources = await client.fetch<Record<string, unknown>[]>('*[_id in ["siteContent", "drafts.siteContent"]]', {}, {perspective: 'raw'})
const published = sources.find(source => source._id === 'siteContent')
const draft = sources.find(source => source._id === 'drafts.siteContent')
if (!published) throw new Error('Published source document missing')

const documents: Record<string, unknown>[] = []
for (const section of sections) {
  const content = published[section.key]
  if (!content || typeof content !== 'object') throw new Error(`Missing ${section.key}`)
  documents.push({...content, _type: section.type, _id: section.id})
  const draftContent = draft?.[section.key]
  if (draftContent && JSON.stringify(draftContent) !== JSON.stringify(content)) {
    documents.push({...draftContent as object, _type: section.type, _id: `drafts.${section.id}`})
  }
}

console.log(`Prepared ${documents.length} section documents; existing originals will be retained.`)
if (!process.argv.includes('--execute')) {
  console.log('Dry run. Add --execute to create the missing documents.')
} else {
  await mkdir('.migration-backup', {recursive: true})
  await writeFile(`.migration-backup/site-${Date.now()}.json`, JSON.stringify(sources, null, 2))
  let transaction = client.transaction()
  for (const document of documents) transaction = transaction.createIfNotExists(document as {_id: string; _type: string})
  await transaction.commit()
  console.log('Migration complete. Existing section documents were not overwritten.')
}
