# DupliClean — Licences tierces / Third-party licenses

# Français

Cette page présente les principales bibliothèques tierces utilisées pour l'analyse vidéo dans **DupliClean 1.2.3 (code 20)**. Le code propriétaire de DupliClean n'est pas publié dans ce dépôt.

## JCodec 0.2.5

- Composant : `org.jcodec:jcodec:0.2.5`, utilisé notamment pour le décodage vidéo MPEG-2.
- Licence : **BSD à deux clauses (BSD-2-Clause)**.
- Projet : [JCodec](https://github.com/jcodec/jcodec).
- [Avis de copyright et licence complète](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/JCODEC-LICENSE.txt).

## FFmpegKit min Android 8.1.2 et FFmpeg

- Composant : `io.github.maitrungduc1410:ffmpeg-kit-min:8.1.2`, contenant des bibliothèques natives FFmpeg.
- Licence déclarée par le fournisseur de cette distribution : **GNU LGPL version 3**. Les licences des composants et de leurs éventuelles dépendances doivent également être respectées.
- Distribution utilisée : [FFmpegKit Android 8.1.2 — version du fournisseur](https://github.com/maitrungduc1410/ffmpeg-kit/releases/tag/android-8.1.2).
- Projet FFmpeg et informations sur ses licences : [FFmpeg — Legal](https://ffmpeg.org/legal.html).
- Textes complets : [licence FFmpegKit](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/FFMPEGKIT-LICENSE.txt) · [GNU LGPL-3.0](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/LGPL-3.0.txt) · [GNU GPL-3.0](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/GPL-3.0.txt).

**Sources et droits des utilisateurs :** les projets ci-dessus publient des ressources de code source. Ces liens ne constituent pas, à eux seuls, une garantie que les sources et paramètres de construction correspondent exactement aux bibliothèques binaires intégrées à DupliClean, ni que toutes les obligations LGPL de modification, de remplacement et de redistribution sont satisfaites. Ces aspects doivent être vérifiés pour la distribution concernée.

## Questions et demandes de sources

Pour toute question sur les licences, les sources correspondantes et les possibilités de modification ou de remplacement des bibliothèques, contactez : **[claudeaboki@gmail.com](mailto:claudeaboki@gmail.com)**.

Les droits d'auteur restent la propriété des contributeurs et titulaires concernés. Les licences complètes font foi.

---

# English

This page identifies major third-party video-analysis components used by **DupliClean 1.2.3 (version code 20)**. DupliClean's proprietary application source code is not published in this repository.

## JCodec 0.2.5

- Component: `org.jcodec:jcodec:0.2.5`, used in particular for MPEG-2 video decoding.
- License: **BSD 2-Clause (BSD-2-Clause)**.
- Project: [JCodec](https://github.com/jcodec/jcodec).
- [Full copyright notice and license](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/JCODEC-LICENSE.txt).

## FFmpegKit min Android 8.1.2 and FFmpeg

- Component: `io.github.maitrungduc1410:ffmpeg-kit-min:8.1.2`, including native FFmpeg libraries.
- License declared by the distributor of this package: **GNU LGPL version 3**. Licensing requirements for included components and dependencies also apply.
- [FFmpegKit Android 8.1.2 — distributor's release](https://github.com/maitrungduc1410/ffmpeg-kit/releases/tag/android-8.1.2).
- [FFmpeg legal and licensing information](https://ffmpeg.org/legal.html).
- Complete texts: [FFmpegKit license](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/FFMPEGKIT-LICENSE.txt) · [GNU LGPL-3.0](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/LGPL-3.0.txt) · [GNU GPL-3.0](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/GPL-3.0.txt).

**Source and user rights:** the upstream projects above provide source code resources. These references alone do not establish an exact match to the binaries shipped with DupliClean or prove compliance with all LGPL requirements on modification, replacement, and redistribution. These questions must be verified for the distributed build.

## Questions and source requests

For third-party license questions, corresponding source requests, or questions about modifying/replacing the libraries, contact **[claudeaboki@gmail.com](mailto:claudeaboki@gmail.com)**.

All copyrights remain with their respective owners. The full license texts govern.

---

[Politique de confidentialité / Privacy policy](/privacy-policy.html) · [Conditions d'utilisation / Terms of use](/terms-of-use.html) · [Gestion des données / Data deletion](/data-deletion.html)


## Guide Android de reconstruction et de remplacement / Android rebuild and replacement guide

[Guide technique bilingue pour la reconstruction, la signature indépendante et les essais de remplacement LGPL](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/FFMPEGKIT-LGPL-TECHNICAL-GUIDE.md). La démonstration Samsung porte sur une modification ELF non fonctionnelle : **elle ne certifie pas la reconstruction reproductible d'une bibliothèque modifiée à partir des sources**. / The Samsung test used a nonfunctional ELF-section change: **it does not establish reproducible rebuilding of a modified library from source**.

## Sources et reconstruction FFmpegKit / FFmpeg — FFmpegKit / FFmpeg source and rebuild information

[Documentation des sources et de reconstruction de la version distribuée / Source and rebuild documentation for the distributed version](https://github.com/claudeaboki/dupliclean/blob/effb5b6cdada9565eb309108013dddfd8afbb2e1/licenses/FFMPEGKIT-SOURCES-AND-REBUILD.md). Ce document présente les empreintes de provenance vérifiées et les obligations LGPL qui restent à valider ; il **ne constitue pas une attestation de conformité complète**. / This document records verified provenance hashes and the remaining LGPL checks; it **is not a certification of full compliance**.
