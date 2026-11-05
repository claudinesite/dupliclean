import type {StructureResolver} from 'sanity/structure'
import {HomeIcon} from '@sanity/icons/Home'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {EarthGlobeIcon} from '@sanity/icons/EarthGlobe'
import sections from './sections.json'
import {Welcome} from './welcome'

export const structure: StructureResolver = S => S.list().title('Modifier DupliClean').items([
  S.listItem().id('bienvenue').title('Bien commencer').icon(HomeIcon)
    .child(S.component().id('bienvenue').title('Bienvenue dans DupliClean').component(Welcome)),
  S.divider(),
  ...sections.map((section, index) => S.listItem().id(section.key)
    .title(`${String(index + 1).padStart(2, '0')} · ${section.title}`)
    .icon(DocumentTextIcon).singleton(section.key)),
  S.divider(),
  S.listItem().id('documents').title('Pages légales').icon(EarthGlobeIcon).child(
    S.list().title('Les documents officiels').items([
      S.listItem().title('Politique de confidentialité').singleton('privacyPolicy'),
      S.listItem().title('Conditions d’utilisation').singleton('termsOfUse'),
      S.listItem().title('Suppression des données').singleton('dataDeletion'),
    ]),
  ),
])
