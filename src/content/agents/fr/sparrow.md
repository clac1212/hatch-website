---
name: Sparrow
job: Développement
pitch: "Je qualifie vos candidats franchisés et je suis chaque ouverture jusqu'au jour J."
order: 7
# Page /agents/sparrow : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Sparrow · CRM candidats et ouvertures de franchise | Hatch OS'
    description: 'Sparrow préqualifie vos candidats à la franchise sur WhatsApp, les suit dans votre pipeline et pilote chaque ouverture avec un rétroplanning recalculé.'
  title: Qualifier vos candidats à la franchise et piloter chaque ouverture
  lead: "Sparrow est l'agent de Hatch OS qui échange sur WhatsApp avec vos candidats à la franchise, les préqualifie, les fait avancer dans votre pipeline, puis pilote le projet d'ouverture une fois le contrat signé."
  problem:
    titre: 'Vous passez vos journées à trier des candidats.'
    texte: "Ils arrivent du site, des salons, des annonces, finissent dans un Excel tenu à la main, et la plupart n'ont ni l'apport ni le projet."
  actions:
    - '**Un numéro WhatsApp dédié à votre enseigne**, accessible par QR code, formulaire ou import CSV de vos candidats existants.'
    - "**La préqualification** : Sparrow pose vos questions (apport, zone, expérience) et se présente dès le début comme l'assistant IA de votre enseigne. Il récupère aussi les documents que vous demandez au candidat, directement depuis son portail."
    - '**Votre pipeline**, avec vos étapes et une checklist par étape.'
    - "**Des automatisations et des relances** pour qu'aucun candidat ne reste sans nouvelles."
    - '**La reprise par le siège** : à tout moment, un humain reprend la conversation.'
    - '**Le suivi de chantier** : Sparrow réclame les pièces manquantes au porteur de projet, et tient le siège informé tâche par tâche.'
    - "**Le projet d'ouverture** créé automatiquement à partir de vos modèles, avec un rétroplanning recalculé quand une date bouge."
    - '**Un espace porteur de projet** pour que le futur franchisé, invité par le siège, suive ses tâches et son chantier.'
    - '**Un tableau de bord** du recrutement et des ouvertures.'
  control:
    agent:
      - Répondre et préqualifier sur WhatsApp
      - Relancer candidats et porteurs de projet (jamais plus de 5 fois sans réponse)
      - Recalculer le rétroplanning
    you:
      - Vos critères et vos questions
      - "Le passage d'une étape à l'autre"
      - 'La signature, quand reprendre la conversation, quand mettre Sparrow en pause'
  exemple:
    contexte: Développement · Candidats
    etapes:
      - texte: Un candidat scanne le QR code sur un salon.
        demande:
          qui: Candidat · via le QR code du salon
          texte: 'Bonjour, je souhaite ouvrir un restaurant à Nantes.'
        carte:
          icone: message-circle
          libelle: "Assistant IA de l'enseigne"
          texte: "Bonjour, je suis l'assistant IA de l'enseigne. Quelques questions pour préparer votre dossier."
          lignes:
            - texte: Apport
              etat: Vérifié
              ton: vert
            - texte: Zone · Nantes
              etat: Disponible
              ton: vert
            - texte: Expérience
              etat: À compléter
              ton: orange
          pastilles:
            - texte: Ajouté au pipeline
              icone: kanban
              sombre: true
      - texte: 'Sparrow lui écrit sur WhatsApp, vérifie son apport et sa zone, et le place dans le pipeline.'
        demande:
          qui: Thomas · candidat · WhatsApp
          texte: "80 000 € d'apport, pour Nantes. J'ai dirigé une boulangerie pendant six ans."
        carte:
          icone: kanban
          libelle: Pipeline · Candidats
          titre: Thomas Leroy · Nantes
          lignes:
            - texte: Apport · 80 000 €
              etat: Vérifié
              ton: vert
            - texte: Zone · Nantes
              etat: Disponible
              ton: vert
            - texte: Expérience · 6 ans en commerce
              etat: Vérifiée
              ton: vert
            - texte: Étape du pipeline
              etat: Qualifié
              ton: bleu
          pastilles:
            - texte: Échange sur WhatsApp
              icone: message-circle
              sombre: false
            - texte: Relance · J+2
              icone: bell-ring
              sombre: true
      - texte: Le développeur reçoit un dossier trié.
        demande:
          qui: Marc · développeur réseau
          texte: 'Sparrow, où en est le dossier du candidat de Nantes ?'
        carte:
          icone: folder-check
          libelle: Dossier candidat · Nantes
          titre: Prêt pour le rendez-vous
          lignes:
            - texte: Questions de préqualification
              etat: Complètes
              ton: vert
            - texte: "Justificatif d'apport"
              etat: Reçu
              ton: vert
            - texte: "Pièce d'identité"
              etat: Reçue
              ton: vert
          pastilles:
            - texte: "Justificatif d'apport · PDF"
              icone: file-text
              sombre: false
            - texte: Rendez-vous à fixer
              icone: calendar
              sombre: true
      - texte: "Après la signature, le projet d'ouverture se crée avec son rétroplanning, et le porteur de projet suit ses étapes dans son espace."
        demande:
          qui: Marc · développeur réseau
          texte: "Contrat signé avec Thomas. Lance l'ouverture de BunBun Nantes."
        carte:
          icone: chart-gantt
          libelle: "Projet d'ouverture · BunBun Nantes"
          titre: Ouverture prévue le 3 mars
          lignes:
            - texte: "Modèle d'ouverture BunBun"
              etat: 42 tâches
              ton: gris
            - texte: Rétroplanning
              etat: 20 semaines
              ton: gris
            - texte: Espace porteur de projet
              etat: Thomas invité
              ton: bleu
          pastilles:
            - texte: Rétroplanning recalculé si une date bouge
              icone: refresh-cw
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: pour les échanges avec les candidats.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Vos formulaires et fichiers CSV
        texte: pour faire entrer vos candidats existants.
        visuel:
          icone: file-spreadsheet
          ton: cuivre
      - titre: Pecker et Peep
        texte: qui prennent le relais une fois le restaurant ouvert.
        visuel:
          agents: [pecker, peep]
      - titre: Lark
        texte: "qui remonte l'avancement des ouvertures au siège."
        visuel:
          agents: [lark]
  faq:
    - q: "Le candidat sait-il qu'il parle à une IA ?"
      a: 'Oui. Sparrow le dit dès le premier message, et le siège peut reprendre la conversation à tout moment.'
    - q: Peut-on importer nos candidats actuels ?
      a: 'Oui, par import CSV.'
    - q: Comment les candidats arrivent-ils dans Sparrow ?
      a: 'Par QR code, par formulaire ou en écrivant au numéro WhatsApp dédié à votre enseigne.'
    - q: "Sparrow suit-il aussi l'ouverture du restaurant ?"
      a: "Oui. Après la signature, il crée le projet d'ouverture avec un rétroplanning et un espace pour le porteur de projet."
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: lark
      texte: le pilotage du réseau
    - agent: pecker
      texte: la formation
---
