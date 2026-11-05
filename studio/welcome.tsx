import sections from './sections.json'
import {IntentLink} from 'sanity/router'

export function Welcome() {
  return <main style={{padding: 'clamp(24px, 5vw, 64px)', maxWidth: 1000, margin: '0 auto'}}>
    <p style={{color: '#8B4A28', fontSize: 12, letterSpacing: 2}}>VOTRE SITE, EN QUELQUES CLICS</p>
    <h1 style={{fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.15}}>Que souhaitez-vous modifier ?</h1>
    <p style={{lineHeight: 1.8, maxWidth: 650}}>Choisissez une section dans le menu à gauche, puis modifiez ses textes, ses images ou ses liens. Cliquez sur <strong>Publier</strong> pour afficher vos changements sur le site après une à deux minutes.</p>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '32px 0'}}>
      {sections.map(section => <IntentLink key={section.key} intent="edit" params={{id: section.id, type: section.type}}
        style={{display: 'block', padding: 22, background: '#F8F2EA', border: '1px solid #E5D5C6', borderRadius: 8, color: '#3B1D0F', textDecoration: 'none'}}>
        <strong>{section.title} ↗</strong><p style={{fontSize: 13, lineHeight: 1.6, marginBottom: 0}}>{section.description}</p>
      </IntentLink>)}
    </div>
    <p style={{lineHeight: 1.8}}>Vos modifications sont enregistrées automatiquement dans un <strong>brouillon</strong>. Elles restent privées jusqu’à la publication. Les images supplémentaires sont facultatives : laissez le champ vide pour conserver la mise en page actuelle.</p>
    <a href="https://dupliclean.ca/" target="_blank" rel="noopener noreferrer" style={{color: '#8B4A28'}}>Voir le site public ↗</a>
  </main>
}
