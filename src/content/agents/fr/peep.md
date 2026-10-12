---
name: Peep
job: Vie de réseau
pitch: 'Je réponds à vos équipes sur WhatsApp, dans leur langue, à partir de vos procédures, et je diffuse vos communications.'
order: 1
# Page /agents/peep : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: "Peep · l'agent WhatsApp de vos équipes terrain | Hatch OS"
    description: 'Peep répond sur WhatsApp aux questions de vos franchisés et équipiers, dans leur langue, à partir de vos documents. Il diffuse vos communications traduites et suit qui les a lues.'
  title: 'Répondre à vos restaurants et diffuser vos infos sur WhatsApp, dans la langue de chaque équipier'
  lead: "Peep est l'agent de Hatch OS qui répond sur WhatsApp aux questions des franchisés et des équipiers, dans leur langue, à partir de vos propres documents, et qui envoie vos communications au réseau en suivant qui les a lues."
  problem:
    titre: 'Vos annonces partent. Personne ne sait qui les lit.'
    texte: 'Mail, groupe WhatsApp, téléphone : chaque info du siège part sur trois canaux, et les mêmes questions remontent au siège toute la semaine.'
  actions:
    - "**Il répond aux questions du terrain**, sur WhatsApp, en s'appuyant uniquement sur vos manuels et fiches. Les équipiers n'installent rien. Il lit aussi vos tableurs (plannings, grilles, fiches techniques)."
    - "**Il parle la langue de chacun.** Le siège écrit en français ; Peep détecte la langue de l'équipier et répond dans cette langue (anglais, espagnol, bengali, tamoul…). Vos communications sont traduites automatiquement pour chaque destinataire."
    - "**Il transmet au siège ce qu'il ne sait pas.** Une question sans réponse dans vos documents arrive dans votre boîte de réception Hatch OS, vous répondez, l'équipier est informé."
    - "**Il rédige vos communications** : vous donnez l'idée, Peep propose le message, avec des blocs et un quiz pour vérifier la compréhension."
    - '**Il cible et programme** : tout le réseau, ou seulement certains restaurants grâce aux étiquettes (région, format, franchisé ou succursale). Envoi immédiat ou programmé.'
    - '**Il relance et mesure** : relance automatique des non-lus, suivi de lecture restaurant par restaurant.'
    - '**Il comprend les notes vocales** : un message vocal est transcrit et traité comme une question écrite.'
  control:
    agent:
      - Répondre aux questions couvertes par vos documents
      - "Relancer les restaurants qui n'ont pas lu"
      - Transcrire les notes vocales
    you:
      - Les documents qui lui servent de source
      - Le contenu de chaque communication avant envoi
      - "La réponse aux questions qu'il vous transmet"
  exemple:
    intro: Le siège lance une nouvelle recette de saison.
    contexte: Communications
    etapes:
      - texte: 'Il demande à Peep un message avec la fiche et trois questions de quiz,'
        demande:
          qui: Claire · siège
          texte: "Peep, prépare l'annonce du burger d'automne, avec la fiche et trois questions de quiz."
        carte:
          banniere: "Burger d'automne"
          texte: Disponible dès lundi dans les restaurants concernés. La fiche est jointe.
          pastilles:
            - texte: Fiche recette · PDF
              icone: file-text
              sombre: false
            - texte: Quiz · 3 questions
              icone: list-checks
              sombre: true
          boutons:
            - Modifier
            - Choisir les restaurants
      - texte: "l'envoie aux restaurants concernés,"
        demande:
          qui: Claire · siège
          texte: "Envoie-la aux restaurants qui ont la carte d'automne, lundi à 9 h."
        carte:
          icone: send
          libelle: 'Envoi programmé · lundi 9:00'
          titre: 12 restaurants ciblés
          lignes:
            - texte: 'Étiquettes : Île-de-France, Franchisé'
              etat: 12 restaurants
              ton: gris
            - texte: Traduite pour chaque équipier
              etat: 5 langues
              ton: bleu
            - texte: Quiz de compréhension
              etat: 3 questions
              ton: gris
          pastilles:
            - texte: 'Lundi · 9:00'
              icone: calendar
              sombre: true
      - texte: "et voit le lendemain lesquels ne l'ont pas ouvert."
        demande:
          qui: Claire · siège · mardi
          texte: "Qui n'a pas encore lu l'annonce ?"
        carte:
          icone: eye
          libelle: Suivi de lecture
          titre: 10 / 12 restaurants ont lu
          lignes:
            - texte: Nantes Centre
              etat: Relancé
              ton: orange
            - texte: Bordeaux Gare
              etat: Non lu
              ton: gris
            - texte: Lyon Part-Dieu
              etat: 'Lu · 09:40'
              ton: vert
          pastilles:
            - texte: Relance automatique
              icone: refresh-cw
              sombre: true
      - texte: Les questions des équipiers sur le dressage sont traitées par Peep à partir de la fiche.
        demande:
          qui: Équipier · Lyon Part-Dieu
          texte: 'La sauce, on la met avant ou après le cheddar ?'
        carte:
          icone: file-text
          libelle: "Fiche recette · Burger d'automne"
          titre: 'Après le cheddar, juste avant de refermer.'
          texte: "C'est l'étape 4 du dressage, photo à l'appui dans la fiche."
          pastilles:
            - texte: Fiche recette · PDF
              icone: file-text
              sombre: false
            - texte: Répondu dans sa langue
              icone: languages
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: là où vos équipes sont déjà.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Jay
        texte: 'qui lui donne accès à vos documents (Google Drive, Notion, OneDrive / SharePoint, PDF).'
        visuel:
          agents: [jay]
      - titre: Lark
        texte: qui remonte au siège les signaux des échanges.
        visuel:
          agents: [lark]
  faq:
    - q: Mes équipiers doivent-ils installer une application ?
      a: 'Non. Peep fonctionne sur WhatsApp, que vos équipes utilisent déjà.'
    - q: Peep répond-il aux équipiers qui ne parlent pas français ?
      a: "Oui. Il détecte la langue de l'équipier et lui répond dans cette langue, à partir de votre documentation en français. Les communications du siège sont aussi traduites automatiquement pour chaque destinataire."
    - q: Que se passe-t-il si Peep ne connaît pas la réponse ?
      a: "Il ne l'invente pas. La question arrive dans la boîte de réception du siège, qui répond."
    - q: Peut-on envoyer une communication à une partie du réseau seulement ?
      a: 'Oui, en ciblant par étiquettes : région, format, type de restaurant.'
    - q: Comment savoir qui a lu une communication ?
      a: 'Le tableau de bord de Peep indique la lecture restaurant par restaurant, et les non-lus sont relancés.'
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: owl
      texte: le même savoir sur la tablette du restaurant
    - agent: pecker
      texte: la formation
    - agent: jay
      texte: vos documents
---
