import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {frFRLocale} from '@sanity/locale-fr-fr'
import sections from './sections.json'
import {schemaTypes} from './schemas'
import {structure} from './structure'

const legal = ['privacyPolicy', 'termsOfUse', 'dataDeletion']
const singletons = [
  ...sections.map(section => defineSingleton({
    id: section.key, documentId: section.id, schemaType: section.type, title: section.title,
  })),
  ...legal.map(type => defineSingleton({id: type, documentId: type, schemaType: type})),
]

export default defineConfig({
  name: 'dupliclean',
  title: 'DupliClean',
  projectId: '89363tcz',
  dataset: 'production',
  basePath: '/',
  plugins: [frFRLocale(), structureTool({name: 'contenu', title: 'Modifier le site', structure})],
  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(template => template.schemaType !== 'siteContent'),
  },
  document: {
    singletons,
    actions: (actions, context) =>
      context.schemaType === 'siteContent' ? [] : actions.filter(action =>
        !['delete', 'duplicate', 'unpublish'].includes(action.action || ''),
      ),
  },
})
