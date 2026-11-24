import {getCliClient} from 'sanity/cli'
import {readFile} from 'node:fs/promises'
import {parseHTML} from 'linkedom'

// Import the same bilingual content and links used by the static fallback.
const html = await readFile(new URL('../../dist/third-party-licenses.html', import.meta.url), 'utf8')
const {document} = parseHTML(html)
const article = document.querySelector('#document')
if (!article) throw new Error('Generate the legal pages before importing the licenses.')

type Link = {_type: 'link'; _key: string; href: string}
type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
let counter = 0
const key = () => `license${++counter}`

function block(element: Element, style = 'normal', bullet = false) {
  const markDefs: Link[] = []
  const children: Span[] = []
  function read(node: Node, marks: string[] = []) {
    if (node.nodeType === 3 && node.textContent) {
      children.push({_type: 'span', _key: key(), text: node.textContent, marks})
      return
    }
    const tag = node.nodeName.toUpperCase()
    const decorator = {STRONG: 'strong', EM: 'em', CODE: 'code'}[tag as 'STRONG' | 'EM' | 'CODE']
    let mark = decorator
    if (tag === 'A') {
      const href = (node as Element).getAttribute('href')
      if (href) {
        mark = key()
        markDefs.push({_type: 'link', _key: mark, href})
      }
    }
    for (const child of node.childNodes) read(child, mark ? [...marks, mark] : marks)
  }
  read(element)
  return {_type: 'block', _key: key(), style, ...(bullet ? {listItem: 'bullet', level: 1} : {}), children, markDefs}
}

const content = {fr: [] as ReturnType<typeof block>[], en: [] as ReturnType<typeof block>[]}
let language: keyof typeof content = 'fr'
for (const element of article.children) {
  switch (element.tagName.toUpperCase()) {
    case 'H2':
      if (element.id === 'english') language = 'en'
      break
    case 'H3':
      content[language].push(block(element, 'h2'))
      break
    case 'H4':
      content[language].push(block(element, 'h3'))
      break
    case 'P':
      content[language].push(block(element))
      break
    case 'UL':
      for (const item of element.children) content[language].push(block(item, 'normal', true))
      break
  }
}
if (!content.fr.length || !content.en.length) throw new Error('Both languages are required.')

const client = getCliClient({apiVersion: '2026-11-05'}).withConfig({useCdn: false})
if (client.config().projectId !== '89363tcz' || client.config().dataset !== 'production') throw new Error('DupliClean production required')
// Keep edits intact if the import is run again.
await client.transaction().createIfNotExists({
  _id: 'thirdPartyLicenses',
  _type: 'thirdPartyLicenses',
  title: 'Licences tierces',
  bodyFr: content.fr,
  bodyEn: content.en,
}).patch('section-footer', patch => patch.setIfMissing({licensesLabel: 'Licences tierces'})).commit()
console.log('Bilingual licenses and footer link label initialized.')
