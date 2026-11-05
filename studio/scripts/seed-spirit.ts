import {getCliClient} from 'sanity/cli'
import defaults from '../../dist/content/stats.json'

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz') throw new Error('DupliClean project required')
const documents = await client.fetch<{_id: string}[]>(
  '*[_id in ["section.stats", "drafts.section.stats"]]{_id}', {}, {perspective: 'raw'},
)
if (!documents.some(document => document._id === 'section.stats')) throw new Error('Section missing')
const fields = {presentationLead: defaults.presentationLead, presentationEnd: defaults.presentationEnd}
let transaction = client.transaction()
for (const document of documents) {
  transaction = transaction.patch(document._id, patch => patch.setIfMissing(fields))
}
await transaction.commit()
console.log('Spirit presentation initialized without overwriting existing text or publishing other drafts.')
