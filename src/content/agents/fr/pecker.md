---
name: Pecker
job: Formation
pitch: Je transforme vos procédures en parcours de cinq minutes et je suis qui a validé quoi.
order: 5
# Page /agents/pecker : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Pecker · la formation de vos équipiers, sans appli ni mot de passe | Hatch OS'
    description: "Pecker envoie vos formations par un simple lien WhatsApp : elles s'ouvrent sur le téléphone, sans appli ni compte, dans la langue de chacun. Relances et évaluations de compétences incluses."
  title: Former vos équipiers et franchisés sans application à installer ni mot de passe
  lead: "Pecker est l'agent de Hatch OS qui envoie à chaque équipier un lien sur WhatsApp : en un clic, la formation s'ouvre sur son téléphone, sans application ni mot de passe. Pecker relance ceux qui n'ont pas terminé et évalue les compétences en restaurant."
  problem:
    titre: 'Vos équipiers ne se connectent jamais à la plateforme de formation.'
    texte: "Pas entre deux services, pas avec un mot de passe oublié. Et si l'équipe lit mal le français, les supports ne servent à rien."
  actions:
    - '**Un éditeur de formations** pour construire vos modules de formation.'
    - "**Un lien magique envoyé sur WhatsApp** : l'équipier clique, la formation s'ouvre dans son navigateur. Pas d'application à télécharger, pas de compte à créer."
    - "**Des déclencheurs automatiques** : une formation part toute seule quand la condition que vous avez fixée est remplie, par exemple l'arrivée d'un nouvel équipier."
    - '**Il relance ceux qui décrochent**, sans que le manager ait à courir après.'
    - "**Des quiz avec résultats** : à la fin d'un parcours, l'équipier voit ses réponses et son score ; vous voyez qui a buté sur quelle question."
    - '**La traduction automatique** : chaque équipier suit la formation dans sa langue, sans que vous traduisiez quoi que ce soit.'
    - "**Des évaluations de compétences** en restaurant avec vos grilles : vous choisissez l'évaluateur, le résultat est partagé en PDF ou par message et reste dans la fiche de l'équipier."
    - '**Un tableau de bord** pour voir, parcours par parcours, qui a commencé, terminé ou décroché.'
  control:
    agent:
      - Envoyer le lien de formation au bon moment
      - "Relancer ceux qui n'ont pas terminé"
      - Traduire les contenus
    you:
      - Le contenu de chaque formation
      - 'Qui reçoit quelle formation, et quand'
      - "Les grilles d'évaluation et qui évalue"
  exemple:
    contexte: "Formation · Parcours d'accueil"
    etapes:
      - texte: Un nouvel équipier est ajouté dans Hatch OS.
        demande:
          qui: Hatch OS · Équipe
          texte: 'Nouvel équipier ajouté : Yanis, Lille Centre.'
        carte:
          icone: send
          libelle: Lien envoyé sur WhatsApp
          titre: "Parcours d'accueil"
          lignes:
            - texte: Module 1 · Bienvenue
              etat: Envoyé
              ton: vert
            - texte: Module 2 · Hygiène
              etat: À venir
              ton: gris
            - texte: Module 3 · Caisse
              etat: À venir
              ton: gris
          pastilles:
            - texte: Lien magique
              icone: link
              sombre: false
            - texte: Dans sa langue
              icone: languages
              sombre: true
      - texte: "Pecker lui envoie sur WhatsApp le lien vers son parcours d'accueil."
        demande:
          qui: Sami · manager Lille Centre
          texte: "Yanis a bien reçu son parcours d'accueil ?"
        carte:
          icone: message-circle
          libelle: WhatsApp · Yanis
          titre: Lien reçu et ouvert
          lignes:
            - texte: Message délivré
              etat: '9:05'
              ton: vert
            - texte: Formation ouverte sur son téléphone
              etat: '9:12'
              ton: vert
            - texte: Langue de lecture
              etat: Portugais
              ton: bleu
          pastilles:
            - texte: Sans appli
              icone: smartphone
              sombre: false
            - texte: Sans compte
              icone: check
              sombre: true
      - texte: "Il l'ouvre sur son téléphone pendant sa pause, et Pecker le relance s'il s'arrête en route."
        demande:
          qui: Sami · manager · jeudi
          texte: Où en est Yanis dans son parcours ?
        carte:
          icone: bell-ring
          libelle: Relancé · J+3
          titre: 1 module sur 3 terminé
          lignes:
            - texte: Module 1 · Bienvenue
              etat: Terminé
              ton: vert
            - texte: Module 2 · Hygiène
              etat: Relancé
              ton: orange
            - texte: Module 3 · Caisse
              etat: À venir
              ton: gris
          pastilles:
            - texte: Relance automatique
              icone: refresh-cw
              sombre: true
      - texte: "Au bout de quelques semaines, le manager l'évalue au poste avec la grille du réseau et le PDF est archivé."
        demande:
          qui: Sami · manager Lille Centre
          texte: 'Évaluation de Yanis au poste caisse, avec la grille BunBun.'
        carte:
          icone: clipboard-check
          libelle: Évaluation au poste · Grille BunBun
          titre: Yanis · 17 / 20
          lignes:
            - texte: Accueil client
              etat: Validé
              ton: vert
            - texte: Mise en place
              etat: Validé
              ton: vert
            - texte: Encaissement
              etat: À revoir
              ton: orange
          pastilles:
            - texte: PDF archivé
              icone: file-text
              sombre: false
            - texte: Fiche de Yanis
              icone: user
              sombre: true
  with:
    cartes:
      - titre: Peep
        texte: "pour l'envoi du lien et les relances sur WhatsApp."
        visuel:
          agents: [peep]
      - titre: Jay
        texte: dont les documents servent de matière première.
        visuel:
          agents: [jay]
      - titre: Peep et Owl
        texte: 'qui révèlent les questions les plus posées, donc les formations à créer.'
        visuel:
          agents: [peep, owl]
      - titre: Finch
        texte: quand un audit montre un point faible à retravailler.
        visuel:
          agents: [finch]
  faq:
    - q: "L'équipier doit-il installer une application ou créer un compte ?"
      a: "Non. Il reçoit un lien sur WhatsApp ; la formation s'ouvre dans le navigateur de son téléphone."
    - q: Peut-on traduire les formations ?
      a: "Oui, et c'est automatique : chaque équipier reçoit la formation dans sa langue. Vous écrivez une seule version, en français."
    - q: Comment savoir qui a terminé ?
      a: "Le tableau de bord montre l'avancement de chaque personne et de chaque restaurant."
    - q: Peut-on évaluer un équipier en situation ?
      a: "Oui, avec vos grilles d'évaluation de compétences. Le résultat est généré en PDF."
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: peep
      texte: "l'envoi et les relances sur WhatsApp"
    - agent: finch
      texte: les audits en restaurant
    - agent: jay
      texte: vos documents
---
