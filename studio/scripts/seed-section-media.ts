import {getCliClient} from 'sanity/cli'
import {readFile} from 'node:fs/promises'
import defaults from '../../sanity/section-defaults.json'
import sections from '../sections.json'

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz') throw new Error('DupliClean project required')
const existing = await client.fetch<Record<string, unknown>[]>('*[_id in $ids]', {
  ids: sections.flatMap(section => [section.id, `drafts.${section.id}`]),
}, {perspective: 'raw'})

const assets: Record<string, string> = {}
for (const [key, filename] of [['hero', 'dupliclean-phone-hand-transparent.png'], ['benefits', 'dupliclean-scan-results.jpg']]) {
  const found = await client.fetch<{_id: string} | null>(
    '*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}', {filename},
  )
  if (found) assets[key] = found._id
  else {
    const bytes = await readFile(new URL(`../../dist/assets/${filename}`, import.meta.url))
    const uploaded = await client.assets.upload('image', bytes, {filename})
    assets[key] = uploaded._id
  }
}

let transaction = client.transaction()
for (const section of sections) {
  const values = defaults[section.key as keyof typeof defaults]
  const initial: Record<string, unknown> = {...values}
  // Null optional images remain absent until an editor chooses a visual.
  for (const key of Object.keys(initial)) if (initial[key] === null) delete initial[key]
  if (assets[section.key]) {
    const image = values.mainImage as {alt: string; caption: string}
    initial.mainImage = {_type: 'image', asset: {_type: 'reference', _ref: assets[section.key]}, alt: image.alt, caption: image.caption}
  }
  for (const document of existing.filter(doc => doc._id === section.id || doc._id === `drafts.${section.id}`)) {
    const patches = {...initial}
    const items = document.items as {_key: string; title?: string}[] | undefined
    if (items && section.key === 'sources') items.forEach((item, index) => {
      patches[`items[_key==${JSON.stringify(item._key)}].tag`] = index === 0 ? 'LOCAL' : 'CLOUD'
    })
    if (items && section.key === 'benefits') items.forEach((item, index) => {
      patches[`items[_key==${JSON.stringify(item._key)}].menuLabel`] = ['Doublons exacts', 'Photos similaires', 'Fichiers à trier', 'Vos données, votre choix'][index] || item.title
    })
    transaction = transaction.patch(String(document._id), patch => patch.setIfMissing(patches))
  }
}
await transaction.commit()
console.log('Section settings and existing images initialized; existing edits and drafts preserved.')
