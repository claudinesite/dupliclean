# Gestion et suppression des données locales / Local Data Management and Deletion — DupliClean

- [Français](#français)
- [English](#english)

---

# Français

**Dernière mise à jour : 24 octobre 2026**

## Comment DupliClean gère vos données

DupliClean ne crée pas de compte DupliClean distinct et ne conserve pas sur un serveur exploité par le développeur des copies permanentes de vos fichiers, photos, vidéos, miniatures ou résultats d’analyse.

Les analyses effectuées par DupliClean utilisent les données disponibles sur votre appareil Android ou auprès du service cloud que vous avez choisi : OneDrive, Dropbox ou MEGA.

Les préférences de l’application, comme la langue sélectionnée, ainsi que l’historique des nettoyages peuvent être conservés localement sur votre appareil.

## Supprimer les données locales de DupliClean

Vous pouvez supprimer les données locales conservées par DupliClean directement depuis votre appareil Android.

Vous pouvez notamment :

- supprimer une entrée précise de l’historique des nettoyages depuis l’application ;
- sélectionner plusieurs entrées d’historique et les supprimer en une seule opération ;
- effacer l’ensemble de l’historique des nettoyages depuis l’application ;
- ouvrir les paramètres Android, accéder aux informations de l’application DupliClean et utiliser l’option permettant d’effacer les données ou le stockage de l’application ;
- désinstaller DupliClean.

La suppression d’une ou plusieurs entrées de l’historique retire uniquement ces informations locales de l’historique DupliClean. Elle ne supprime pas les fichiers correspondants de votre téléphone, de OneDrive, de Dropbox ou de MEGA.

L’effacement des données de l’application ou sa désinstallation supprime les préférences et autres données locales DupliClean présentes sur l’appareil.

## Photos et vidéos de l’appareil

DupliClean peut accéder aux photos et vidéos selon les autorisations Android accordées par l’utilisateur.

Sur les versions récentes d’Android, l’utilisateur peut autoriser l’accès à toutes les photos et vidéos ou limiter l’accès à certains médias sélectionnés.

Vous pouvez modifier ou retirer cette autorisation depuis les paramètres Android de DupliClean. Le retrait de l’autorisation empêche l’application d’accéder aux médias concernés lors de futures analyses.

## OneDrive, Dropbox et MEGA

Les fichiers présents dans OneDrive, Dropbox ou MEGA restent stockés et gérés par Microsoft, Dropbox ou MEGA.

DupliClean n’en conserve pas de copie permanente sur un serveur exploité par le développeur.

Lorsque vous confirmez la suppression d’un fichier cloud dans DupliClean :

- pour OneDrive, la demande est transmise à Microsoft et le fichier est traité selon le fonctionnement de la corbeille OneDrive ;
- pour Dropbox, la demande est transmise à Dropbox afin d’exécuter la suppression confirmée par l’utilisateur ;
- pour MEGA, le fichier est déplacé vers la corbeille du compte MEGA.

Si vous souhaitez supprimer d’autres données détenues directement par Microsoft, Dropbox ou MEGA, vous devez utiliser les outils de gestion de compte et de confidentialité proposés par le fournisseur concerné.

## Accès aux comptes Microsoft, Dropbox et MEGA

DupliClean utilise votre compte Microsoft ou Dropbox existant lorsque vous choisissez OneDrive ou Dropbox. Pour MEGA, vous saisissez vos identifiants dans l’application afin que le SDK MEGA ouvre une session. DupliClean conserve la session MEGA dans le stockage sécurisé de l’appareil pour éviter une nouvelle connexion à chaque utilisation.

DupliClean ne crée pas ces comptes et ne gère pas leur suppression.

Vous pouvez retirer l’autorisation accordée à DupliClean depuis les paramètres de sécurité ou de confidentialité de votre compte Microsoft ou Dropbox. Vous pouvez vous déconnecter de MEGA dans DupliClean pour supprimer la session MEGA enregistrée localement.

Le retrait d’une autorisation ou la déconnexion de MEGA empêche DupliClean d’accéder au service concerné jusqu’à une nouvelle connexion ou autorisation.

## Demande de suppression côté développeur

DupliClean ne conserve pas de données d’analyse utilisateur sur un serveur exploité par le développeur. Il n’existe donc normalement pas de données DupliClean côté serveur à faire supprimer sur demande.

Pour toute question concernant la confidentialité ou le fonctionnement de l’application, vous pouvez contacter le développeur à l’adresse suivante :

**claudeaboki@gmail.com**

**N’envoyez jamais vos mots de passe Microsoft, Dropbox ou MEGA au développeur.**

---

# English

**Last updated: October 24, 2026**

## How DupliClean handles your data

DupliClean does not create a separate DupliClean account and does not keep permanent copies of your files, photos, videos, thumbnails, or analysis results on a developer-operated server.

DupliClean performs its analysis using data available on your Android device or from the cloud service you choose: OneDrive, Dropbox, or MEGA.

App preferences, such as the selected language, and cleanup history may be stored locally on your device.

## Delete DupliClean local data

You can delete locally stored DupliClean data directly from your Android device.

You can:

- delete a specific cleanup-history entry from the app;
- select multiple history entries and delete them in a single operation;
- clear the entire cleanup history from the app;
- open Android settings, go to DupliClean app information, and use the option to clear the app's data or storage;
- uninstall DupliClean.

Deleting one or more cleanup-history entries removes only those local DupliClean history records. It does not delete the corresponding files from your phone, OneDrive, Dropbox, or MEGA.

Clearing app data or uninstalling DupliClean removes locally stored DupliClean preferences and other local app data from the device.

## Device photos and videos

DupliClean may access photos and videos according to the Android permissions granted by the user.

On recent Android versions, users may allow access to all photos and videos or limit access to selected media.

You can change or revoke this permission from DupliClean's Android app settings. Revoking permission prevents the app from accessing the relevant media during future scans.

## OneDrive, Dropbox, and MEGA

Files stored in OneDrive, Dropbox, or MEGA remain stored and managed by Microsoft, Dropbox, or MEGA.

DupliClean does not keep permanent copies of those files on a developer-operated server.

When you confirm deletion of a cloud file in DupliClean:

- for OneDrive, the request is sent to Microsoft and the file is handled according to OneDrive recycle bin behavior;
- for Dropbox, the request is sent to Dropbox to carry out the deletion confirmed by the user;
- for MEGA, the file is moved to the account's Rubbish Bin.

If you want to delete other data held directly by Microsoft, Dropbox, or MEGA, use the account and privacy management tools provided by the relevant service.

## Microsoft, Dropbox, and MEGA account access

DupliClean uses your existing Microsoft or Dropbox account when you choose OneDrive or Dropbox. For MEGA, you enter your credentials in the app so the MEGA SDK can start a session. DupliClean stores the MEGA session in secure storage on the device so you do not need to sign in every time.

DupliClean does not create those accounts and does not manage their deletion.

You can revoke DupliClean's authorization from the security or privacy settings of your Microsoft or Dropbox account. You can sign out of MEGA in DupliClean to remove the locally stored MEGA session.

Revoking authorization or signing out of MEGA prevents DupliClean from accessing that service until you sign in or authorize it again.

## Developer-side deletion requests

DupliClean does not retain user analysis data on a developer-operated server. Therefore, there is normally no DupliClean server-side user data that needs to be deleted on request.

For privacy or app-related questions, contact the developer at:

**claudeaboki@gmail.com**

**Never send your Microsoft, Dropbox, or MEGA passwords to the developer.**
