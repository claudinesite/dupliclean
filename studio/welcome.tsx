import sections from './sections.json'
import {IntentLink} from 'sanity/router'

export function Welcome() {
  return <main style={{padding: 'clamp(24px, 5vw, 64px)', maxWidth: 1000, margin: '0 auto'}}>
    <p style={{color: '#8B4A28', fontSize: 12, letterSpacing: 2}}>VOTRE SITE, EN QUELQUES CLICS</p>
    <h1 style={{fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.15}}>Que souhaitez-vous modifier ?</h1>
    <p style={{lineHeight: 1.8, maxWidth: 650}}>Choisissez une rubrique dans le menu à gauche, modifiez votre texte, puis cliquez sur <strong>Publier</strong>. Vos changements apparaîtront sur le site après une à deux minutes.</p>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, margin: '32px 0'}}>
      {sections.map(section => <IntentLink key={section.key} intent="edit" params={{id: section.id, type: section.type}}
        style={{display: 'block', padding: 22, background: '#F8F2EA', border: '1px solid #E5D5C6', borderRadius: 8, color: '#3B1D0F', textDecoration: 'none'}}>
        <strong>{section.title} ↗</strong><p style={{fontSize: 13, lineHeight: 1.6, marginBottom: 0}}>{section.description}</p>
      </IntentLink>)}
    </div>
    <p style={{lineHeight: 1.8}}>Un texte enregistré automatiquement reste un <strong>brouillon</strong> jusqu’à sa publication. Vous pouvez donc préparer vos changements tranquillement.</p>
    <a href="https://dupliclean.ca/" target="_blank" rel="noopener noreferrer" style={{color: '#8B4A28'}}>Voir le site public ↗</a>
  </main>
}
