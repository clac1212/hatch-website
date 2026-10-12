---
name: Owl
job: Établissement
pitch: "Je réponds à voix haute pendant le service, sur la tablette de l'établissement."
order: 3
# Page /agents/owl : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: "Owl · l'assistant IA sur la tablette du restaurant | Hatch OS"
    description: "Owl s'installe sur la tablette du restaurant. L'équipier pose sa question à la voix ou par écrit et obtient la réponse tirée de vos fiches, sans quitter son poste."
  title: Un assistant sur la tablette du restaurant pour répondre aux équipiers en service
  lead: "Owl est l'agent de Hatch OS installé sur la tablette du restaurant : l'équipier pose sa question à la voix ou par écrit et obtient la réponse tirée de vos fiches, sans quitter son poste ni chercher dans un classeur."
  problem:
    titre: 'En plein service, personne ne cherche une fiche.'
    texte: "Le classeur est au bureau, le Drive n'est pas ouvert, et la question finit chez le manager, quand il est là."
  actions:
    - "**Il tourne en mode kiosque** sur une tablette partagée : l'écran reste sur Owl, rien d'autre."
    - "**Il comprend la voix** : l'équipier dicte sa question, les mains occupées ou non."
    - '**Il répond à partir de vos documents**, les mêmes que ceux de Peep et Jay.'
    - "**Il s'adapte au restaurant** : un profil par tablette et des étiquettes qui définissent ce que chaque établissement voit (format, carte, région)."
  control:
    agent:
      - Répondre aux questions posées sur la tablette
      - Afficher la réponse adaptée au restaurant
    you:
      - Les documents auxquels il a accès
      - Les étiquettes de chaque tablette
  exemple:
    contexte: Tablette · Cuisine
    etapes:
      - texte: "Un équipier arrivé la semaine dernière demande à la tablette la température de cuisson d'un produit."
        demande:
          qui: Équipier · cuisine
          texte: Quelle est la température de cuisson du poulet ?
        carte:
          icone: file-text
          libelle: Fiche du réseau · Cuisson
          titre: 74 °C à cœur
          texte: Contrôler au thermomètre sonde avant de servir.
          pastilles:
            - texte: Fiche Cuisson · PDF
              icone: book-open
              sombre: false
            - texte: Lire à voix haute
              icone: volume-2
              sombre: true
      - texte: Owl répond avec la fiche du réseau.
        demande:
          qui: Équipier · cuisine
          texte: Lis-moi la fiche en entier.
        carte:
          icone: volume-2
          libelle: Lu à voix haute · Fiche Cuisson
          titre: 'Poulet pané, étape par étape'
          lignes:
            - texte: Friteuse préchauffée
              etat: 170 °C
              ton: gris
            - texte: Temps de cuisson
              etat: 6 min
              ton: gris
            - texte: Contrôle à la sonde
              etat: 74 °C à cœur
              ton: orange
          pastilles:
            - texte: Manuel BunBun · Cuisson v2
              icone: file-text
              sombre: false
            - texte: Profil · Lille Centre
              icone: tablet
              sombre: true
      - texte: "Le manager n'a pas été interrompu."
        demande:
          qui: 'Manager · Lille Centre · 15:00'
          texte: Combien de questions pendant le service de midi ?
        carte:
          icone: chart-bar
          libelle: Tablette cuisine · service de midi
          titre: '14 questions, 14 réponses tirées des fiches'
          lignes:
            - texte: Cuisson du poulet
              etat: Répondu
              ton: vert
            - texte: Nettoyage friteuse
              etat: Répondu
              ton: vert
            - texte: Transmises au manager
              etat: '0'
              ton: gris
          pastilles:
            - texte: Aucune interruption
              icone: check
              sombre: true
  with:
    cartes:
      - titre: Jay
        texte: "qui tient à jour les documents sur lesquels Owl s'appuie."
        visuel:
          agents: [jay]
      - titre: Peep
        texte: qui apporte le même savoir sur WhatsApp.
        visuel:
          agents: [peep]
      - titre: Pecker
        texte: "pour former les équipiers sur ce qu'ils demandent le plus."
        visuel:
          agents: [pecker]
  faq:
    - q: Quelle différence entre Owl et Peep ?
      a: "Peep répond sur WhatsApp, sur le téléphone de chacun. Owl est sur la tablette partagée du restaurant, pour ceux qui n'ont pas leur téléphone en service."
    - q: Peut-on poser une question à la voix ?
      a: 'Oui, Owl comprend la dictée vocale.'
    - q: Chaque restaurant voit-il les mêmes informations ?
      a: 'Non si vous le souhaitez : les étiquettes adaptent les réponses au format ou à la carte du restaurant.'
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: peep
      texte: le même savoir sur WhatsApp
    - agent: jay
      texte: vos documents
    - agent: pecker
      texte: la formation
---
