---
name: Lark
job: Direction
pitch: "Chaque matin, je vous donne l'état du réseau, les échéances et les relances à faire."
order: 6
# Page /agents/lark : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Lark · le pilotage de votre réseau de franchise | Hatch OS'
    description: "Lark rassemble ce que font vos agents Hatch OS dans tout le réseau et répond à vos questions sur l'état de vos restaurants, en un seul écran."
  title: Voir en un écran ce qui se passe dans tout votre réseau
  lead: "Lark est l'agent de Hatch OS qui rassemble les signaux remontés par vos autres agents (communications, formations, audits, ouvertures) et vous répond quand vous l'interrogez sur l'état de votre réseau."
  problem:
    titre: 'Pour savoir quel restaurant décroche, il faut tout recouper à la main.'
    texte: 'Les audits dans un tableur, les annonces sur WhatsApp, les candidats dans un autre outil.'
  actions:
    - "**Une page d'accueil du réseau** qui regroupe ce que vos agents ont vu : communications non lues, formations en retard, audits récents, actions en cours."
    - "**Une conversation sur l'état du réseau** : vous posez la question en français, Lark répond à partir des données de vos agents."
    - '**Un tableau de bord réseau** pour suivre les indicateurs dans le temps.'
    - '**Les sujets qui remontent du terrain** : les questions posées aux agents sont classées automatiquement par thème. Vous voyez ce qui préoccupe vos restaurants cette semaine.'
  control:
    agent:
      - Rassembler les signaux des autres agents
      - Répondre à vos questions sur le réseau
    you:
      - Les actions à lancer
      - 'Qui, au siège, accède à quoi'
  exemple:
    contexte: Accueil du réseau
    etapes:
      - texte: "Le lundi, la directrice réseau ouvre Hatch OS et voit sur la page d'accueil trois restaurants qui n'ont pas lu la dernière communication et un audit avec des actions critiques ouvertes."
        demande:
          qui: 'Directrice réseau · lundi 08:45'
          texte: "Qu'est-ce qui demande mon attention cette semaine ?"
        carte:
          icone: layout-grid
          libelle: "Page d'accueil du réseau"
          lignes:
            - texte: "3 restaurants n'ont pas lu la communication"
              etat: À relancer
              ton: orange
            - texte: Audit Nantes Centre
              etat: 2 actions critiques
              ton: rouge
            - texte: Ouverture Bordeaux
              etat: Dans les temps
              ton: vert
          pastilles:
            - texte: Appeler les franchisés
              icone: phone
              sombre: true
      - texte: 'Elle appelle les bons franchisés, sans avoir ouvert quatre outils.'
        demande:
          qui: 'Directrice réseau · lundi 08:47'
          texte: 'Qui dois-je appeler ce matin, et pour quoi ?'
        carte:
          icone: phone
          libelle: À appeler ce matin
          titre: 4 franchisés
          lignes:
            - texte: Marc · Nantes Centre
              etat: Audit · 2 actions critiques
              ton: rouge
            - texte: Sonia · Metz Centre
              etat: Annonce non lue
              ton: orange
            - texte: Karim · Lille Centre
              etat: Annonce non lue
              ton: orange
            - texte: Julie · Rennes Centre
              etat: Annonce non lue
              ton: orange
          pastilles:
            - texte: Peep · Finch
              icone: git-merge
              sombre: false
            - texte: Numéros dans la fiche
              icone: contact
              sombre: true
  with:
    texte: "Tous les agents : **Peep, Owl, Pecker, Jay, Finch et Sparrow**. Lark n'a de valeur qu'avec au moins un autre agent, c'est lui qui fait le lien."
    agents:
      - peep
      - owl
      - pecker
      - jay
      - finch
      - sparrow
  faq:
    - q: Lark fonctionne-t-il seul ?
      a: "Non. Il s'appuie sur ce que remontent vos autres agents Hatch OS."
    - q: Quelles questions peut-on lui poser ?
      a: "Des questions sur l'activité suivie par vos agents, par exemple les restaurants en retard sur une formation ou les actions d'audit encore ouvertes."
    - q: Remplace-t-il un outil de reporting ?
      a: 'Il ne remplace pas votre caisse ni votre comptabilité. Il couvre ce que font vos équipes avec les agents : information, formation, qualité, ouvertures.'
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: peep
      texte: les communications et qui les a lues
    - agent: finch
      texte: les audits et leurs actions
    - agent: sparrow
      texte: les ouvertures et les candidats
---
