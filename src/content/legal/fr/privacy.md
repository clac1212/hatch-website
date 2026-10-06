---
seo:
  title: 'Politique de Confidentialité — Hatch OS'
  description: 'Politique de confidentialité de Hatch OS : données collectées, finalités, base légale RGPD, sous-traitants, durées de conservation, cookies et vos droits.'
title: 'Politique de Confidentialité'
meta: 'Version 2026-10 · Mise à jour : 6 octobre 2026 · Entrée en vigueur : 25 septembre 2026'
---

## 1. Identité du Responsable de Traitement

La présente Politique de Confidentialité est publiée par&nbsp;:

**Hatch OS**, société par actions simplifiée (SAS) au capital de 1 000 €<br />
Siège social&nbsp;: 104 rue de la Folie-Méricourt, 75011 Paris, France<br />
Immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 103 890 893<br />
Président&nbsp;: Patrick Rakotondrajao<br />
Contact DPO&nbsp;: [cesar@gethatch.io](mailto:cesar@gethatch.io)

Hatch OS (ci-après «&nbsp;Hatch OS&nbsp;», «&nbsp;nous&nbsp;» ou «&nbsp;notre&nbsp;») édite et exploite la plateforme SaaS accessible depuis le domaine `gethatch.io` et ses sous-domaines (ci-après la «&nbsp;Solution&nbsp;»), conçue pour les réseaux de franchises et leurs collaborateurs.

**Rôles au sens du RGPD.** Hatch OS agit en qualité de **responsable de traitement** pour les données nécessaires à la gestion de la relation avec ses clients&nbsp;: demandes de compte, comptes administrateurs, facturation, preuve de l'acceptation des conditions, sécurité de la Solution. Pour les données que ses clients intègrent dans la Solution et celles de leurs utilisateurs et collaborateurs, Hatch OS agit en qualité de **sous-traitant** pour le compte du client, qui en est le responsable de traitement, dans les conditions prévues par les [Conditions Générales de Vente](/conditions-de-vente) ou par le contrat d'abonnement signé avec le client.

## 2. Données Personnelles Collectées

Nous collectons et traitons les catégories de données suivantes&nbsp;:

### 2.1 Données fournies directement par l'Utilisateur

- Nom, prénom, adresse email professionnelle
- Numéro de téléphone (obligatoire lors d'une demande de compte, facultatif ensuite)
- Données de l'entreprise / franchise (nom du concept, nombre d'établissements, rôle, localisation)
- Preuve de l'acceptation des Conditions Générales d'Utilisation et des Conditions Générales de Vente&nbsp;: document et version acceptés, date et heure, adresse email et nom du concept à la date de l'acceptation
- Contenus créés dans la plateforme (messages, templates, documents uploadés)

### 2.2 Données collectées via Google OAuth

Lorsque vous connectez votre compte Google à Hatch OS, nous demandons les autorisations («&nbsp;scopes&nbsp;») suivantes&nbsp;:

| Scope Google                                              | Donnée consultée                                               | Finalité                                                           |
| --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `https://www.googleapis.com/auth/userinfo.email`          | Adresse email principale de votre compte Google                | Création et authentification de votre compte Hatch OS              |
| `https://www.googleapis.com/auth/userinfo.profile`        | Nom, prénom, photo de profil                                   | Personnalisation de votre profil utilisateur                       |
| `https://www.googleapis.com/auth/drive.readonly`          | Fichiers Google Drive que vous choisissez de connecter         | Lecture des documents sélectionnés pour alimenter l'agent IA (RAG) |
| `https://www.googleapis.com/auth/drive.metadata.readonly` | Métadonnées des fichiers Drive (nom, type, date, arborescence) | Affichage du sélecteur de fichiers dans l'interface Hatch OS       |

### 2.3 Données techniques

- Adresse IP, type de navigateur, système d'exploitation
- Lors d'une demande de compte&nbsp;: vérification anti-robot (Cloudflare Turnstile), qui traite l'adresse IP et des signaux techniques du navigateur
- Logs de connexion et d'utilisation de la plateforme
- Cookies techniques et de session (voir section 9)

### 2.4 Données de facturation

Lorsque le client souscrit un abonnement, nous transmettons à notre prestataire de paiement Stripe le nom, l'adresse email, l'adresse de facturation et, le cas échéant, le numéro de TVA de l'administrateur du compte. Les données de carte bancaire sont saisies directement sur les pages de Stripe et traitées par Stripe seul&nbsp;: Hatch OS n'y a pas accès et ne les conserve pas. Nous conservons le statut de l'abonnement, le nombre d'établissements facturés et les échéances.

### 2.5 Visiteurs du site gethatch.io

- **Mesure d'audience.** Le site mesure sa fréquentation avec PostHog (serveurs dans l'Union européenne, en Allemagne) et Vercel Web Analytics&nbsp;: pages consultées, clics sur les boutons d'action, provenance de la visite, type d'appareil et de navigateur, vitesse d'affichage des pages. Cette mesure fonctionne **sans cookie ni stockage dans votre navigateur**&nbsp;: les visites sont regroupées par un identifiant anonyme calculé côté serveur et renouvelé chaque jour, et l'adresse IP n'est pas conservée. Elle ne sert qu'à produire des statistiques sur l'usage du site et ne permet pas de vous suivre sur d'autres sites.
- **Demande de démonstration.** La réservation d'un rendez-vous sur la page démo passe par Cal.com, intégré à la page. Vous y indiquez votre nom, votre adresse email et, le cas échéant, votre entreprise et vos réponses au formulaire de réservation. Ces données servent à organiser le rendez-vous et à vous recontacter.

## 3. Finalités du Traitement

Nous traitons vos données personnelles pour les finalités suivantes&nbsp;:

1. **Fournir le service**&nbsp;: création de compte, authentification, accès aux fonctionnalités de la plateforme
2. **Examiner les demandes de compte**&nbsp;: vérification des informations fournies et prévention de la fraude avant l'activation d'un compte
3. **Alimenter l'agent IA (RAG)**&nbsp;: indexer les documents que vous choisissez de connecter (Google Drive, uploads directs) afin que l'assistant IA puisse répondre aux questions de vos collaborateurs à partir de vos contenus
4. **Support client**&nbsp;: répondre à vos demandes d'assistance
5. **Amélioration du service**&nbsp;: analyses statistiques agrégées et anonymisées. Les données et contenus de nos clients ne sont jamais utilisés pour entraîner ou ajuster des modèles d'intelligence artificielle, et nos fournisseurs de modèles d'IA sont contractuellement tenus de ne pas les utiliser pour entraîner les leurs
6. **Sécurité**&nbsp;: détection des fraudes, abus et incidents de sécurité, protection anti-robot du formulaire de demande de compte
7. **Facturation et paiement**&nbsp;: gestion de l'abonnement, des paiements et des factures
8. **Preuve**&nbsp;: conservation de la preuve de l'acceptation des Conditions Générales d'Utilisation et de Vente
9. **Obligations légales**&nbsp;: facturation, comptabilité, conformité réglementaire
10. **Mesure d'audience du site**&nbsp;: statistiques de fréquentation de gethatch.io
11. **Rendez-vous de démonstration**&nbsp;: organisation du rendez-vous et suivi commercial

## 4. Utilisation des Données Google&nbsp;: Divulgation Limitée (Google API Services Limited Use)

L'utilisation par Hatch OS des informations reçues depuis les API Google, ainsi que leur transfert à toute autre application, respectent la **[Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy)**, y compris les exigences de **Limited Use (Utilisation Limitée)**.

Concrètement, cela signifie que&nbsp;:

- Les fichiers Google Drive auxquels nous accédons sont **uniquement** utilisés pour alimenter votre agent IA (RAG) afin de répondre aux questions de vos utilisateurs au sein de la plateforme Hatch OS
- Nous ne transférons **jamais** vos données Google à des tiers, sauf lorsque cela est strictement nécessaire pour fournir ou améliorer les fonctionnalités visibles à l'utilisateur (sous-traitants listés en section 6), pour nous conformer à la loi, ou dans le cadre d'une fusion, acquisition ou vente d'actifs, avec votre consentement
- Nous n'utilisons **jamais** vos données Google à des fins publicitaires
- Nous n'utilisons **jamais** vos données Google pour entraîner, affiner ou améliorer des modèles d'intelligence artificielle généralisés ou des modèles tiers

## 5. Base Légale du Traitement (RGPD)

| Finalité                                                      | Base légale                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------ |
| Fournir le service, créer et gérer votre compte               | Exécution du contrat (art. 6.1.b RGPD)                             |
| Examiner une demande de compte                                | Mesures précontractuelles (art. 6.1.b RGPD)                        |
| Paiement et gestion de l'abonnement                           | Exécution du contrat (art. 6.1.b RGPD)                             |
| Protection anti-robot, preuve de l'acceptation des conditions | Intérêt légitime (art. 6.1.f RGPD)                                 |
| Connexion Google OAuth et accès Drive                         | Consentement explicite (art. 6.1.a RGPD)                           |
| Support et communication service                              | Exécution du contrat                                               |
| Facturation, comptabilité                                     | Obligation légale (art. 6.1.c RGPD)                                |
| Analyses statistiques, sécurité                               | Intérêt légitime (art. 6.1.f RGPD)                                 |
| Mesure d'audience du site gethatch.io                         | Intérêt légitime, sans cookie (art. 6.1.f RGPD)                    |
| Rendez-vous de démonstration                                  | Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD) |

Vous pouvez retirer votre consentement à la connexion Google à tout moment depuis votre compte Hatch OS ou depuis les paramètres de votre compte Google (`https://myaccount.google.com/permissions`).

## 6. Destinataires et Sous-traitants

Vos données sont hébergées et traitées par les sous-traitants suivants, choisis pour leur niveau de sécurité&nbsp;:

| Sous-traitant  | Service                                                                                                                            | Localisation                      | Encadrement du transfert |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------ |
| Supabase       | Hébergement de la base de données, authentification, stockage                                                                      | UE (France)                       | Sans objet               |
| Google         | Génération de réponses par intelligence artificielle (Gemini) et connexion Google Drive                                            | États-Unis                        | DPF + CCT                |
| Twilio         | Acheminement des messages                                                                                                          | États-Unis                        | DPF + CCT                |
| Meta Platforms | Distribution des messages WhatsApp                                                                                                 | Hors UE (infrastructure mondiale) | DPF + CCT                |
| Vercel         | Hébergement de l'interface (traitement éphémère, sans stockage durable), hébergement et statistiques de visite du site gethatch.io | UE (France)                       | Sans objet               |
| Railway        | Traitements de synchronisation des contenus                                                                                        | UE (Pays-Bas)                     | Sans objet               |
| Hostinger      | Hébergement d'un composant d'orchestration technique                                                                               | UE (France)                       | Sans objet               |
| Resend         | Envoi des emails transactionnels                                                                                                   | États-Unis                        | DPF + CCT                |
| PostHog        | Mesure d'audience produit (pseudonymisée) et du site gethatch.io (sans cookie)                                                     | UE (Allemagne)                    | Sans objet               |
| ElevenLabs     | Transcription des messages vocaux                                                                                                  | États-Unis                        | CCT                      |
| Stripe         | Paiement de l'abonnement et facturation                                                                                            | États-Unis / UE (Irlande)         | DPF + CCT                |
| Cloudflare     | Protection anti-robot du formulaire de demande de compte (Turnstile)                                                               | États-Unis                        | DPF + CCT                |
| Cal.com        | Prise de rendez-vous de démonstration depuis le site gethatch.io                                                                   | États-Unis                        | CCT                      |

Les données sont stockées et sauvegardées au sein de l'Union européenne ou de l'Espace économique européen. Certains traitements accessoires (génération par intelligence artificielle, acheminement des messages, envoi des emails, paiement) impliquent des sous-traitants établis hors de l'Espace économique européen. Ces transferts sont encadrés par une décision d'adéquation (Data Privacy Framework, «&nbsp;DPF&nbsp;»), par des **Clauses Contractuelles Types** («&nbsp;CCT&nbsp;») approuvées par la Commission européenne ou par tout autre mécanisme conforme au RGPD.

**Nous ne vendons jamais vos données personnelles.**

## 7. Durée de Conservation

- **Données de compte**&nbsp;: durée du contrat + 3 ans après résiliation (prescription commerciale)
- **Documents Google Drive indexés (RAG)**&nbsp;: tant que vous conservez la connexion Google&nbsp;; suppression sous 30 jours après déconnexion ou sur demande
- **Logs techniques**&nbsp;: 12 mois
- **Données de facturation**&nbsp;: 10 ans (obligation légale comptable)
- **Preuve de l'acceptation des Conditions Générales**&nbsp;: conservée, y compris après la suppression du compte, pendant la durée nécessaire à la preuve de la relation contractuelle
- **Données des clients traitées en qualité de sous-traitant**&nbsp;: restituées sur demande dans les 30 jours suivant la fin de l'abonnement, puis supprimées, sous réserve des obligations légales et des cycles de purge des sauvegardes
- **Demandes de démonstration**&nbsp;: 3 ans après le dernier contact

## 8. Vos Droits (RGPD)

Conformément au Règlement (UE) 2016/679 (RGPD), vous disposez des droits suivants&nbsp;:

- **Droit d'accès** à vos données personnelles
- **Droit de rectification** des données inexactes
- **Droit à l'effacement** («&nbsp;droit à l'oubli&nbsp;»)
- **Droit à la limitation** du traitement
- **Droit à la portabilité** de vos données
- **Droit d'opposition** au traitement
- **Droit de retirer votre consentement** à tout moment
- **Droit d'introduire une réclamation** auprès de la CNIL ([www.cnil.fr](http://www.cnil.fr))

Pour exercer ces droits, contactez notre DPO&nbsp;: **[cesar@gethatch.io](mailto:cesar@gethatch.io)**. Nous répondons dans un délai maximum d'**un mois** à compter de la réception de votre demande.

### 8.1 Comment révoquer l'accès Google

Vous pouvez révoquer l'accès de Hatch OS à votre compte Google à tout moment&nbsp;:

1. Depuis Hatch OS&nbsp;: `Paramètres → Intégrations → Google → Déconnecter`
2. Depuis Google&nbsp;: `https://myaccount.google.com/permissions`

Après révocation, les documents indexés depuis Drive sont supprimés de nos systèmes sous 30 jours.

## 9. Cookies

La Solution utilise uniquement des cookies **strictement nécessaires** au fonctionnement (session, authentification, préférences). Aucun cookie publicitaire ou de tracking tiers n'est déposé sans votre consentement explicite.

Sur le site gethatch.io, la mesure d'audience ne dépose aucun cookie et n'écrit rien dans votre navigateur (voir 2.5)&nbsp;: c'est pourquoi aucun bandeau de consentement ne s'affiche. L'agenda Cal.com intégré à la page démo peut déposer les cookies nécessaires à son fonctionnement lorsque vous l'utilisez.

## 10. Sécurité

Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données&nbsp;: chiffrement en transit (TLS 1.2+) et au repos, contrôles d'accès, journalisation, sauvegardes régulières, tests de sécurité, et principe du moindre privilège pour les accès internes.

## 11. Mineurs

La Solution n'est pas destinée aux mineurs de moins de 16 ans. Nous ne collectons pas sciemment de données de mineurs.

## 12. Modifications

Nous pouvons mettre à jour cette Politique de Confidentialité. Toute modification substantielle sera notifiée par email aux utilisateurs et par une mention visible dans la Solution au moins 30 jours avant sa prise d'effet.

## 13. Contact

Pour toute question relative à cette politique ou à vos données personnelles&nbsp;:

**Hatch OS, Délégué à la Protection des Données**<br />
Email&nbsp;: [cesar@gethatch.io](mailto:cesar@gethatch.io)<br />
Adresse&nbsp;: 104 rue de la Folie-Méricourt, 75011 Paris, France
