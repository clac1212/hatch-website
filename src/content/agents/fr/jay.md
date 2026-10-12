---
name: Jay
job: Documentation
pitch: 'Je retrouve, co-rédige et diffuse vos documents, depuis Drive, Notion ou Airtable.'
order: 4
# Page /agents/jay : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Jay · le manuel opératoire de votre franchise, à jour | Hatch OS'
    description: 'Jay connecte vos documents (Google Drive, Notion, Airtable, SharePoint, PDF) pour que vos équipes et vos agents Hatch OS répondent avec la bonne version, source citée.'
  title: 'Votre manuel opératoire, enfin lu et toujours à jour'
  lead: "Jay est l'agent de Hatch OS qui connecte vos documents là où ils sont déjà (Google Drive, Notion, Airtable, OneDrive / SharePoint, PDF), les aide à rester à jour et les rend utilisables par vos équipes et vos autres agents, avec la source citée dans chaque réponse."
  problem:
    titre: "Votre manuel existe. Personne ne l'ouvre."
    texte: 'Il est long, éparpillé dans le Drive en plusieurs versions, et personne ne sait laquelle fait foi.'
  actions:
    - '**Il se branche sur vos outils actuels** : Google Drive, Notion, Airtable, OneDrive / SharePoint. Aucune migration : synchronisation automatique chaque nuit, ou à la demande.'
    - '**Il importe vos PDF**, tableurs et vidéos de formation.'
    - '**Il vous aide à rédiger** : « Éditer avec Jay » pour reformuler, compléter ou structurer une fiche, et des modèles pour démarrer.'
    - "**Il règle qui voit quoi** : des étiquettes par profil et par restaurant limitent l'accès à chaque document."
    - "**Il vous laisse exclure un document** des réponses de l'IA (une ancienne version, un brouillon), jusqu'à ce que vous le réactiviez."
    - "**Il cite ses sources** : chaque réponse renvoie au document d'où elle vient."
    - '**Il nourrit les autres agents** : Peep, Owl et Pecker répondent et forment à partir de ce que Jay connaît.'
  control:
    agent:
      - Lire et indexer les documents connectés
      - Proposer des reformulations
      - Citer la source de chaque réponse
    you:
      - Quels dossiers et documents il peut lire
      - Ce qui est publié dans vos fiches
      - Qui voit quel document
  exemple:
    contexte: Documentation · Sources
    etapes:
      - texte: Le siège connecte son Google Drive.
        demande:
          qui: Siège · connexion
          texte: Connecter le Google Drive « Manuel opératoire ».
        carte:
          icone: refresh-cw
          libelle: Synchronisé · 214 documents
          lignes:
            - texte: Fiche ouverture
              etat: À jour
              ton: vert
            - texte: Nettoyage friteuse v4
              etat: À jour
              ton: vert
            - texte: Procédure ouverture v2
              etat: Exclue des réponses
              ton: gris
          pastilles:
            - texte: Sources citées
              icone: quote
              sombre: false
            - texte: Resynchro chaque nuit
              icone: moon
              sombre: true
      - texte: "Le soir même, un équipier demande à Peep la procédure d'ouverture : la réponse arrive avec le lien vers la fiche d'origine."
        demande:
          qui: 'Équipier · Lille Centre · 21:40'
          texte: "Demain j'ouvre seul, c'est quoi la procédure d'ouverture ?"
        carte:
          icone: message-circle
          libelle: Peep répond sur WhatsApp
          titre: 'Allumer les friteuses 30 min avant le service, puis contrôler les températures.'
          texte: 'Les quatre étapes sont dans la fiche, le lien est joint à la réponse.'
          pastilles:
            - texte: 'Source : Fiche ouverture'
              icone: link
              sombre: false
            - texte: Google Drive
              icone: folder-sync
              sombre: true
      - texte: 'Quand la fiche est modifiée dans le Drive, les réponses suivent.'
        demande:
          qui: Claire · siège · Google Drive
          texte: "J'ajoute la chambre froide au contrôle des températures dans la fiche ouverture."
        carte:
          icone: refresh-cw
          libelle: 'Resynchronisé cette nuit · 02:00'
          titre: Fiche ouverture · v3
          lignes:
            - texte: Fiche ouverture v3
              etat: À jour
              ton: vert
            - texte: Fiche ouverture v2
              etat: Remplacée
              ton: gris
            - texte: 'Réponses de Peep, Owl et Pecker'
              etat: Nouvelle version
              ton: bleu
          pastilles:
            - texte: Sources citées
              icone: quote
              sombre: false
            - texte: Resynchro chaque nuit
              icone: moon
              sombre: true
  with:
    cartes:
      - titre: 'Google Drive, Notion, Airtable, OneDrive / SharePoint'
        texte: pour vos documents existants.
        visuel:
          icone: folder-sync
          ton: bleu
      - titre: 'Peep, Owl et Pecker'
        texte: 'qui utilisent ce savoir sur WhatsApp, sur tablette et en formation.'
        visuel:
          agents: [peep, owl, pecker]
  faq:
    - q: Faut-il déplacer nos documents dans Hatch OS ?
      a: 'Non. Jay se connecte à Google Drive, Notion, Airtable ou OneDrive / SharePoint. Vos documents restent où ils sont et sont resynchronisés chaque nuit.'
    - q: Quels formats sont acceptés ?
      a: "Documents, PDF, tableurs et vidéos (jusqu'à 1 Go par vidéo)."
    - q: "Comment savoir d'où vient une réponse ?"
      a: Chaque réponse cite le document source.
    - q: "Jay peut-il m'aider à écrire un manuel ?"
      a: 'Oui, avec « Éditer avec Jay » et des modèles de fiches.'
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: peep
      texte: les réponses sur WhatsApp
    - agent: owl
      texte: le même savoir sur la tablette du restaurant
    - agent: pecker
      texte: la formation
---
