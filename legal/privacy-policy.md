# Politique de confidentialité / Privacy Policy — DupliClean

- [Français](#français)
- [English](#english)

---

# Français

**Dernière mise à jour : 18 septembre 2026**

DupliClean est une application mobile Android permettant aux utilisateurs d’analyser et de gérer des fichiers présents sur leur appareil, dans Microsoft OneDrive, dans Dropbox et dans MEGA.

DupliClean peut notamment aider l’utilisateur à repérer :

- les doublons exacts ;
- les photos visuellement similaires ;
- les vidéos similaires lorsque cette analyse est activée ;
- les fichiers volumineux ;
- les captures d’écran.

DupliClean est actuellement disponible en français, anglais, italien, espagnol, allemand et portugais. La préférence de langue peut être enregistrée localement sur l’appareil.

La présente politique de confidentialité explique quelles données peuvent être consultées ou traitées par DupliClean, dans quel but elles sont utilisées et comment l’utilisateur garde le contrôle sur ses fichiers.

## 1. Données présentes sur l’appareil Android

Lorsque l’utilisateur choisit d’analyser son appareil, DupliClean peut accéder aux photos, vidéos et aux informations techniques nécessaires concernant ces fichiers, selon les autorisations accordées à l’application.

Selon la version d’Android et le choix de l’utilisateur, l’accès peut être complet ou limité à certaines photos et vidéos sélectionnées. L’utilisateur peut modifier ces autorisations depuis les paramètres Android.

Les informations utilisées pour l’analyse peuvent notamment inclure :

- le nom du fichier ;
- sa taille ;
- son type ;
- son album ou son emplacement lorsque cette information est disponible ;
- sa date ;
- certaines métadonnées nécessaires à l’analyse ;
- le contenu du fichier lorsque cela est nécessaire pour calculer une empreinte permettant d’identifier un doublon exact ;
- une miniature de l’image lorsque cela est nécessaire pour rechercher des photos visuellement similaires.

Les analyses locales sont effectuées afin de fournir les fonctionnalités demandées par l’utilisateur. Les fichiers locaux ne sont pas envoyés vers un serveur exploité par le développeur pour effectuer ces analyses.

DupliClean ne supprime jamais automatiquement un fichier simplement parce qu’il a été détecté. L’utilisateur doit choisir les fichiers qu’il souhaite supprimer et confirmer l’opération.

## 2. Microsoft OneDrive

DupliClean permet à l’utilisateur d’analyser des fichiers présents dans son compte Microsoft OneDrive.

Lorsque cette fonctionnalité est utilisée, l’utilisateur s’authentifie auprès de Microsoft et autorise DupliClean à accéder aux ressources nécessaires par l’intermédiaire des services Microsoft, notamment Microsoft Graph.

Selon les fonctionnalités utilisées, DupliClean peut accéder à des informations telles que :

- les identifiants des fichiers ;
- les noms ;
- les tailles ;
- les types de fichiers ;
- les dates ;
- les emplacements ou informations de dossier disponibles ;
- les miniatures ;
- les empreintes ou informations de comparaison fournies par OneDrive lorsqu’elles sont disponibles.

Pour certaines analyses, notamment la recherche de photos similaires, DupliClean peut télécharger temporairement une miniature fournie par OneDrive afin d’effectuer une comparaison visuelle dans l’application.

Lorsque l’utilisateur confirme la suppression d’un fichier OneDrive depuis DupliClean, l’application transmet la demande correspondante à Microsoft. Le fichier est alors traité selon le fonctionnement de la corbeille OneDrive et les règles applicables au compte de l’utilisateur.

DupliClean ne demande pas à l’utilisateur de communiquer directement son mot de passe Microsoft à l’application.

L’utilisation de OneDrive reste soumise aux politiques de confidentialité et conditions d’utilisation de Microsoft.

## 3. MEGA

DupliClean permet à l’utilisateur d’analyser les dossiers et fichiers de son compte MEGA au moyen du SDK Android officiel de MEGA.

L’utilisateur saisit dans DupliClean son adresse e-mail, son mot de passe et, si nécessaire, un code de vérification. L’application transmet ces informations au SDK MEGA pour ouvrir la session. DupliClean enregistre la session MEGA dans le stockage sécurisé de l’appareil afin de pouvoir la restaurer ; la déconnexion supprime cette session enregistrée.

Selon les fonctionnalités utilisées, DupliClean peut accéder aux noms, identifiants, tailles, types, dates, dossiers, métadonnées de comparaison et miniatures des fichiers. Pour vérifier des doublons exacts ou analyser des médias, l’application peut télécharger temporairement le contenu de fichiers sur l’appareil et calculer localement des empreintes. Les données téléchargées pour l’analyse ne sont pas transmises à un serveur exploité par le développeur.

Lorsque l’utilisateur confirme la suppression d’un fichier MEGA dans DupliClean, l’application demande au SDK MEGA de le déplacer vers la corbeille du compte. La conservation et la récupération éventuelle dépendent des règles de MEGA et du compte de l’utilisateur.

L’utilisation de MEGA reste soumise aux politiques de confidentialité et conditions d’utilisation de MEGA.

## 4. Dropbox

DupliClean permet également à l’utilisateur d’analyser des fichiers et dossiers présents dans son compte Dropbox.

Lorsque cette fonctionnalité est utilisée, l’utilisateur s’authentifie auprès de Dropbox au moyen du mécanisme OAuth 2.0 avec PKCE et autorise DupliClean à accéder aux ressources nécessaires au fonctionnement de l’analyse.

Selon les fonctionnalités utilisées, DupliClean peut accéder à des informations telles que :

- les identifiants des fichiers ;
- les noms ;
- les tailles ;
- les types de fichiers ;
- les dates ;
- les chemins ou informations de dossier disponibles ;
- les miniatures ;
- le `content_hash` fourni par Dropbox lorsqu’il est disponible.

Pour certaines analyses, notamment la recherche de photos similaires, DupliClean peut télécharger temporairement une miniature fournie par Dropbox afin d’effectuer une comparaison visuelle dans l’application.

Pour la détection des doublons exacts Dropbox, DupliClean peut utiliser la taille du fichier et le `content_hash` fourni par Dropbox. Ce `content_hash` est utilisé pour comparer des fichiers Dropbox entre eux et n’est pas présenté comme un SHA-256 standard calculé directement sur un fichier local.

Lorsque l’utilisateur confirme la suppression d’un fichier Dropbox depuis DupliClean, l’application transmet la demande correspondante à Dropbox au moyen de l’API Dropbox.

DupliClean ne demande pas à l’utilisateur de communiquer directement son mot de passe Dropbox à l’application.

L’utilisation de Dropbox reste soumise aux politiques de confidentialité et conditions d’utilisation de Dropbox.

## 5. Informations liées à l’authentification cloud

Lorsqu’un utilisateur se connecte à OneDrive ou Dropbox, le fournisseur d’authentification peut transmettre à DupliClean des informations associées au compte, par exemple le nom, l’adresse e-mail ou un identifiant. Pour MEGA, l’adresse e-mail et les informations de connexion saisies dans l’application sont utilisées par le SDK MEGA pour ouvrir la session ; la session est enregistrée dans le stockage sécurisé de l’appareil.

Ces informations sont utilisées uniquement pour permettre l’authentification, établir la session avec le service choisi et fournir les fonctionnalités cloud demandées par l’utilisateur.

DupliClean ne crée pas de compte DupliClean distinct et ne maintient pas de base de comptes utilisateurs sur un serveur exploité par le développeur.

## 6. Utilisation des données

Les données auxquelles DupliClean accède sont utilisées uniquement pour fournir les fonctionnalités demandées par l’utilisateur, notamment :

- parcourir les emplacements sélectionnés ;
- analyser les fichiers ;
- identifier les doublons exacts ;
- rechercher des photos visuellement similaires ;
- rechercher des vidéos similaires lorsque cette option est activée ;
- identifier les fichiers volumineux ;
- identifier les captures d’écran ;
- afficher les résultats ;
- permettre à l’utilisateur de choisir les fichiers à conserver ou à supprimer ;
- estimer l’espace de stockage pouvant être récupéré ;
- exécuter les suppressions explicitement confirmées par l’utilisateur.

DupliClean n’utilise pas le contenu des fichiers à des fins publicitaires et ne vend pas les fichiers, photos, vidéos ou autres données personnelles des utilisateurs.

## 7. Détection des doublons et photos similaires

Pour identifier les doublons exacts, DupliClean peut utiliser des informations techniques telles que la taille du fichier et une empreinte cryptographique ou une empreinte fournie par le service de stockage concerné.

Sur l’appareil Android, DupliClean peut calculer localement une empreinte SHA-256 du contenu du fichier.

Pour OneDrive, Dropbox et MEGA, DupliClean peut utiliser les empreintes ou informations de comparaison disponibles dans les métadonnées pour présélectionner les fichiers. Certains contenus doivent néanmoins être téléchargés temporairement sur l’appareil pour vérifier une correspondance ou analyser des médias.

Pour identifier des photos visuellement similaires, DupliClean peut utiliser une miniature de l’image pour calculer une empreinte perceptuelle. Cette fonctionnalité produit une estimation de similarité et les résultats sont toujours présentés à l’utilisateur avant toute suppression.

## 8. Préférences et historique des nettoyages

DupliClean peut conserver localement sur l’appareil certaines préférences de l’application, notamment la langue sélectionnée, ainsi qu’un historique des opérations de nettoyage.

Cet historique peut contenir notamment :

- la date d’une opération ;
- la source analysée ;
- le nombre de fichiers supprimés ;
- l’espace de stockage libéré.

Ces informations locales servent à mémoriser les réglages et à permettre à l’utilisateur de consulter ses opérations de nettoyage précédentes.

## 9. Suppression des fichiers

La suppression d’un fichier n’est effectuée qu’à la suite d’une action explicite de l’utilisateur dans l’application.

DupliClean présente les fichiers détectés et laisse l’utilisateur choisir ceux qu’il souhaite conserver ou supprimer.

Pour les fichiers cloud :

- OneDrive utilise les services Microsoft pour exécuter la suppression demandée selon les règles de OneDrive ;
- Dropbox utilise les services Dropbox pour exécuter la suppression explicitement demandée par l’utilisateur ;
- MEGA déplace les fichiers sélectionnés vers la corbeille du compte.

Les utilisateurs doivent vérifier les fichiers sélectionnés avant de confirmer une suppression.

## 10. Partage et vente de données

DupliClean ne vend pas les données personnelles des utilisateurs et ne partage pas les fichiers de l’utilisateur avec des annonceurs.

Lorsque l’utilisateur utilise une fonctionnalité cloud, certaines informations nécessaires à l’opération sont échangées avec le fournisseur du service concerné :

- Microsoft pour OneDrive ;
- Dropbox pour Dropbox ;
- MEGA pour MEGA.

Ces échanges sont nécessaires pour authentifier l’utilisateur, accéder aux fichiers autorisés, récupérer les métadonnées ou miniatures nécessaires et exécuter les actions demandées par l’utilisateur.

## 11. Conservation des données

DupliClean ne conserve pas de copies permanentes des fichiers, photos, vidéos, miniatures ou résultats d’analyse sur un serveur exploité par le développeur.

Les préférences et l’historique de nettoyage conservés par DupliClean restent localement sur l’appareil et peuvent être supprimés par l’utilisateur en effaçant les données de l’application ou en désinstallant DupliClean. L’historique peut également être effacé depuis l’application lorsque cette option est disponible.

Des miniatures ou fichiers peuvent être conservés temporairement dans le cache de l’application sur l’appareil pour l’analyse ou l’aperçu. L’utilisateur peut effacer les données de l’application dans Android pour supprimer ce cache et les sessions locales.

Les données conservées directement par Microsoft, Dropbox ou MEGA restent soumises aux règles de conservation et de suppression de ces fournisseurs.

## 12. Sécurité

DupliClean vise à limiter l’accès aux données aux fonctionnalités nécessaires au fonctionnement de l’application.

L’application utilise les mécanismes d’authentification de Microsoft et Dropbox ainsi que le SDK MEGA pour l’accès aux comptes cloud.

L’utilisateur reste responsable de la sécurité de son appareil et de ses comptes Microsoft, Dropbox et MEGA.

## 13. Services tiers

DupliClean peut interagir avec les services tiers suivants lorsque l’utilisateur choisit de les utiliser :

- Microsoft OneDrive / Microsoft Graph ;
- Dropbox / Dropbox API ;
- MEGA / SDK MEGA.

Ces fournisseurs traitent certaines informations conformément à leurs propres politiques de confidentialité et conditions d’utilisation.

## 14. Confidentialité des enfants

DupliClean n’est pas spécifiquement destinée aux enfants et ne vise pas à collecter sciemment des informations personnelles concernant des enfants.

## 15. Modifications de cette politique

Cette politique de confidentialité peut être mise à jour afin de refléter les évolutions de DupliClean, de ses fonctionnalités, de ses intégrations cloud ou des exigences applicables.

La date de dernière mise à jour indiquée en haut de cette page permet d’identifier la version la plus récente.

## 16. Contact

Pour toute question concernant cette politique de confidentialité ou l’utilisation des données par DupliClean, vous pouvez contacter le développeur à l’adresse suivante :

**claudeaboki@gmail.com**

---

# English

**Last updated: September 18, 2026**

DupliClean is an Android mobile application that allows users to analyze and manage files stored on their device, in Microsoft OneDrive, in Dropbox, and in MEGA.

DupliClean can help users identify, among other things:

- exact duplicates;
- visually similar photos;
- similar videos when that analysis is enabled;
- large files;
- screenshots.

DupliClean is currently available in French, English, Italian, Spanish, German, and Portuguese. The selected language preference may be stored locally on the device.

This Privacy Policy explains what data DupliClean may access or process, why it is used, and how users remain in control of their files.

## 1. Data on the Android device

When a user chooses to analyze their device, DupliClean may access photos, videos, and technical information required for those files, depending on the permissions granted to the application.

Depending on the Android version and the user's choice, access may be full or limited to selected photos and videos. Users can change these permissions from Android settings.

Information used for analysis may include:

- file name;
- file size;
- file type;
- album or location when available;
- date information;
- certain metadata required for analysis;
- file content when necessary to calculate a fingerprint used to identify an exact duplicate;
- an image thumbnail when necessary to search for visually similar photos.

Local analysis is performed to provide features requested by the user. Local files are not sent to a developer-operated server for these analyses.

DupliClean never automatically deletes a file simply because it has been detected. The user must choose which files to delete and confirm the operation.

## 2. Microsoft OneDrive

DupliClean allows users to analyze files stored in their Microsoft OneDrive account.

When this feature is used, the user authenticates with Microsoft and authorizes DupliClean to access the resources required through Microsoft services, including Microsoft Graph.

Depending on the features used, DupliClean may access information such as:

- file identifiers;
- file names;
- file sizes;
- file types;
- dates;
- available location or folder information;
- thumbnails;
- hashes or comparison information provided by OneDrive when available.

For some analyses, including similar-photo detection, DupliClean may temporarily download a thumbnail provided by OneDrive in order to perform a visual comparison within the application.

When the user confirms the deletion of a OneDrive file from DupliClean, the application sends the corresponding request to Microsoft. The file is then handled according to OneDrive recycle bin behavior and the rules applicable to the user's account.

DupliClean does not ask the user to provide their Microsoft password directly to the application.

Use of OneDrive remains subject to Microsoft's applicable privacy policies and terms of use.

## 3. MEGA

DupliClean allows users to analyze folders and files in their MEGA account through the official MEGA Android SDK.

Users enter their email address, password, and, if required, a verification code in DupliClean. The app passes these details to the MEGA SDK to start the session. DupliClean stores the MEGA session in secure storage on the device so it can be restored; signing out removes that stored session.

Depending on the features used, DupliClean may access file names, identifiers, sizes, types, dates, folders, comparison metadata, and thumbnails. To verify exact duplicates or analyze media, the app may temporarily download file content to the device and calculate hashes locally. Content downloaded for analysis is not sent to a developer-operated server.

When users confirm deletion of a MEGA file in DupliClean, the app asks the MEGA SDK to move it to the account's Rubbish Bin. Retention and possible recovery depend on MEGA's rules and the user's account.

Use of MEGA remains subject to MEGA's applicable privacy policies and terms of use.

## 4. Dropbox

DupliClean also allows users to analyze files and folders stored in their Dropbox account.

When this feature is used, the user authenticates with Dropbox using OAuth 2.0 with PKCE and authorizes DupliClean to access the resources required for the analysis to function.

Depending on the features used, DupliClean may access information such as:

- file identifiers;
- file names;
- file sizes;
- file types;
- dates;
- available paths or folder information;
- thumbnails;
- the Dropbox `content_hash` when available.

For some analyses, including similar-photo detection, DupliClean may temporarily download a thumbnail provided by Dropbox in order to perform a visual comparison within the application.

For exact-duplicate detection on Dropbox, DupliClean may use file size and the Dropbox `content_hash`. This `content_hash` is used to compare Dropbox files with one another and is not represented as a standard SHA-256 hash calculated directly on a local file.

When the user confirms deletion of a Dropbox file from DupliClean, the application sends the corresponding request to Dropbox through the Dropbox API.

DupliClean does not ask the user to provide their Dropbox password directly to the application.

Use of Dropbox remains subject to Dropbox's applicable privacy policies and terms of use.

## 5. Cloud authentication information

When a user connects to OneDrive or Dropbox, the authentication provider may provide DupliClean with account information such as a name, email address, or account identifier. For MEGA, the email address and sign-in details entered in the app are used by the MEGA SDK to start the session; the session is stored in secure storage on the device.

This information is used only to authenticate the user, establish the session with the selected service, and provide the cloud features requested by the user.

DupliClean does not create a separate DupliClean account and does not maintain a user-account database on a developer-operated server.

## 6. Use of data

Data accessed by DupliClean is used only to provide features requested by the user, including:

- browsing selected locations;
- analyzing files;
- identifying exact duplicates;
- searching for visually similar photos;
- searching for similar videos when this option is enabled;
- identifying large files;
- identifying screenshots;
- displaying results;
- allowing users to choose which files to keep or delete;
- estimating how much storage space may be recovered;
- carrying out deletions explicitly confirmed by the user.

DupliClean does not use file content for advertising purposes and does not sell users' files, photos, videos, or other personal data.

## 7. Detection of duplicates and similar photos

To identify exact duplicates, DupliClean may use technical information such as file size and a cryptographic hash or a hash provided by the relevant storage service.

On the Android device, DupliClean may locally calculate a SHA-256 hash of file content.

For OneDrive, Dropbox, and MEGA, DupliClean may use hashes or comparison information available in metadata to preselect files. Some content must nevertheless be downloaded temporarily to the device to verify a match or analyze media.

To identify visually similar photos, DupliClean may use an image thumbnail to calculate a perceptual hash. This feature provides a similarity estimate, and results are always shown to the user before any deletion occurs.

## 8. Preferences and cleanup history

DupliClean may locally store certain application preferences, including the selected language, as well as a history of cleanup operations.

This history may include:

- the date of an operation;
- the analyzed source;
- the number of files deleted;
- the amount of storage space freed.

This local information is used to remember settings and allow users to review previous cleanup operations.

## 9. File deletion

A file is deleted only after an explicit action by the user in the application.

DupliClean displays detected files and allows the user to choose which files to keep or delete.

For cloud files:

- OneDrive uses Microsoft services to carry out the requested deletion according to OneDrive rules;
- Dropbox uses Dropbox services to carry out the deletion explicitly requested by the user;
- MEGA moves selected files to the account's Rubbish Bin.

Users should review selected files before confirming a deletion.

## 10. Data sharing and sale

DupliClean does not sell users' personal data and does not share users' files with advertisers.

When a user uses a cloud feature, certain information required for the operation is exchanged with the relevant service provider:

- Microsoft for OneDrive;
- Dropbox for Dropbox;
- MEGA for MEGA.

These exchanges are necessary to authenticate the user, access authorized files, retrieve required metadata or thumbnails, and perform actions requested by the user.

## 11. Data retention

DupliClean does not keep permanent copies of files, photos, videos, thumbnails, or analysis results on a developer-operated server.

Preferences and cleanup history stored by DupliClean remain locally on the device and can be removed by clearing the app's data or uninstalling DupliClean. Cleanup history can also be cleared from within the app when that option is available.

Thumbnails or files may be held temporarily in the app cache on the device for analysis or preview. Users can clear the app's data in Android to remove this cache and locally stored sessions.

Data stored directly by Microsoft, Dropbox, or MEGA remains subject to those providers' retention and deletion rules.

## 12. Security

DupliClean aims to limit access to data to the features required for the application to function.

The application uses Microsoft and Dropbox authentication mechanisms and the MEGA SDK to access cloud accounts.

Users remain responsible for the security of their device and their Microsoft, Dropbox, and MEGA accounts.

## 13. Third-party services

DupliClean may interact with the following third-party services when the user chooses to use them:

- Microsoft OneDrive / Microsoft Graph;
- Dropbox / Dropbox API;
- MEGA / MEGA SDK.

These providers process certain information according to their own privacy policies and terms of use.

## 14. Children's privacy

DupliClean is not specifically directed at children and does not seek to knowingly collect personal information from children.

## 15. Changes to this policy

This Privacy Policy may be updated to reflect changes to DupliClean, its features, cloud integrations, or applicable requirements.

The last updated date shown at the top of this page identifies the most recent version.

## 16. Contact

For questions about this Privacy Policy or DupliClean's use of data, contact the developer at:

**claudeaboki@gmail.com**
