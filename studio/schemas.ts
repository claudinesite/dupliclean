import {defineType, defineField, defineArrayMember, type FieldDefinition, type SchemaTypeDefinition} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import sections from './sections.json'
import legalSchemas from '../sanity/legal-schema.json'
import legacy from '../sanity/schema.json'

type FieldSource = {
  name: string; title?: string; type: string; fields?: FieldSource[];
  of?: FieldSource[]; description?: string; [key: string]: unknown;
}

function field(source: FieldSource, fixedLength?: number): FieldDefinition {
  const converted: Record<string, unknown> = {...source}
  if (source.fields) converted.fields = source.fields.map(item => field(item))
  if (source.of) converted.of = source.of.map(item => defineArrayMember({
    ...item,
    ...(item.fields ? {fields: item.fields.map(child => field(child))} : {}),
    ...(item.type === 'object' ? {
      icon: DocumentTextIcon,
      preview: {select: {title: 'title', question: 'question', value: 'value', label: 'label'},
        prepare: (value: Record<string, string>) => ({title: value.title || value.question || value.value || 'Élément', subtitle: value.label})},
    } : {}),
  } as Parameters<typeof defineArrayMember>[0]))
  if (source.type === 'array' && source.name === 'items') {
    converted.validation = (rule: {required(): {length(size: number): unknown}; min(size: number): unknown}) =>
      fixedLength ? rule.required().length(fixedLength) : rule.min(1)
  }
  return defineField(converted as unknown as FieldDefinition)
}

const fixedLengths: Record<string, number> = {stats: 3, benefits: 4, steps: 3, sources: 3, data: 3}
export const schemaTypes: SchemaTypeDefinition[] = [
  ...sections.map(section => defineType({
    name: section.type,
    title: section.title,
    type: 'document',
    icon: DocumentTextIcon,
    description: section.description,
    fieldsets: section.fieldsets,
    fields: section.fields.map(source => field(source as FieldSource, fixedLengths[section.key])),
    preview: {prepare: () => ({title: section.title, subtitle: section.description})},
  })),
  ...legalSchemas.map(schema => defineType({
    ...schema, type: 'document' as const,
    icon: DocumentTextIcon,
    fields: schema.fields.map(source => field(source as FieldSource)),
    preview: {prepare: () => ({title: schema.title})},
  })),
  // Preserve the original document for fallback and migration history.
  defineType({...legacy, type: 'document' as const, title: 'Ancienne fiche du site (archive)', readOnly: true,
    fields: legacy.fields.map(source => field(source as FieldSource)),
  }),
]
