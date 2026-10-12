---
name: Finch
job: Qualité et conformité
pitch: "J'audite vos établissements sur une grille commune et je transforme les écarts en actions."
order: 2
# Page /agents/finch : texte de Patrick (Notion « 08 · Pages agents », 08/10/2026), mis en page d'après la maquette Pencil « Page agent ».
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Finch · les audits qualité de tout le réseau | Hatch OS'
    description: "Finch digitalise vos audits qualité et hygiène : grilles pondérées, audit sur mobile avec photos, rapport PDF envoyé sur WhatsApp et plan d'action suivi jusqu'à la preuve."
  title: "Auditer vos restaurants et suivre chaque plan d'action jusqu'au bout"
  lead: "Finch est l'agent de Hatch OS qui fait passer vos audits qualité sur mobile, calcule le score, envoie le rapport au franchisé sur WhatsApp et suit le plan d'action jusqu'à ce que chaque correction soit prouvée."
  problem:
    titre: "Vos audits s'arrêtent au rapport."
    texte: "Le plan d'action se perd entre deux visites, et le même écart revient à l'audit suivant."
  actions:
    - '**Vos grilles, pondérées** : vous reprenez votre grille actuelle et donnez un poids à chaque point de contrôle.'
    - "**L'audit sur mobile** avec photos. Sur chaque point de contrôle, l'auditeur voit l'historique : résultats et commentaires des audits précédents, statut des actions passées."
    - '**Un score sur 100** calculé automatiquement selon la pondération.'
    - "**Un rapport PDF envoyé sur WhatsApp** au franchisé dès la fin de l'audit."
    - "**Un plan d'action proposé par l'IA**, avec un niveau de criticité pour chaque écart."
    - '**Des preuves de correction** déposées par le franchisé (photo, document ou simple commentaire), avec un statut par action. Le rapport final inclut ces preuves.'
    - "**L'auto-évaluation** : le restaurant peut s'auditer lui-même entre deux visites."
    - '**Un tableau de bord réseau** qui montre les points de contrôle qui dérivent.'
  control:
    agent:
      - Calculer le score et générer le PDF
      - "Proposer un plan d'action avec criticité"
      - Envoyer le rapport sur WhatsApp
    you:
      - Vos grilles et leur pondération
      - Les actions retenues et leurs échéances
      - "Qui peut auditer (rôle « responsable d'audit »)"
  exemple:
    contexte: Audit · Lille Centre
    etapes:
      - texte: Une animatrice réseau audite un restaurant sur son téléphone.
        demande:
          qui: "Animatrice réseau · fin d'audit"
          texte: 'Audit terminé sur le téléphone : Lille Centre.'
        carte:
          icone: send
          libelle: Rapport envoyé sur WhatsApp
          titre: 84 / 100
          lignes:
            - texte: Joint de porte chambre froide
              etat: Critique
              ton: rouge
            - texte: Étiquetage des préparations
              etat: Majeure
              ton: orange
            - texte: Affichage allergènes
              etat: Mineure
              ton: gris
          pastilles:
            - texte: Rapport · PDF
              icone: file-text
              sombre: false
            - texte: Preuves attendues
              icone: camera
              sombre: true
      - texte: 'À la fin, le franchisé reçoit le rapport sur WhatsApp avec trois actions, dont une critique.'
        demande:
          qui: Franchisé · Lille Centre
          texte: Bien reçu le rapport. Je commence par quoi ?
        carte:
          icone: list-checks
          libelle: "Plan d'action · 3 actions"
          titre: "1 critique, à corriger aujourd'hui"
          lignes:
            - texte: Joint de porte chambre froide
              etat: "Aujourd'hui"
              ton: rouge
            - texte: Étiquetage des préparations
              etat: Avant vendredi
              ton: orange
            - texte: Affichage allergènes
              etat: Sous 15 jours
              ton: gris
          pastilles:
            - texte: Rapport · PDF
              icone: file-text
              sombre: false
            - texte: Reçu sur WhatsApp
              icone: message-circle
              sombre: true
      - texte: "Il dépose la photo de la correction, l'animatrice la valide, et le tableau de bord montre si ce point dérive ailleurs dans le réseau."
        demande:
          qui: Animatrice réseau · jeudi
          texte: Preuve de Lille Centre validée. Ce point revient ailleurs ?
        carte:
          icone: chart-no-axes-column
          libelle: Tableau de bord réseau
          titre: Le même écart dans 3 restaurants
          lignes:
            - texte: Lille Centre
              etat: Corrigé
              ton: vert
            - texte: Nantes Centre
              etat: Ouvert · critique
              ton: rouge
            - texte: Bordeaux Gare
              etat: Ouvert · majeure
              ton: orange
          pastilles:
            - texte: Photo validée
              icone: camera
              sombre: false
            - texte: Points qui dérivent
              icone: trending-up
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: pour le rapport et les preuves.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Pecker
        texte: quand un écart récurrent justifie une formation.
        visuel:
          agents: [pecker]
      - titre: Lark
        texte: qui remonte au siège les actions critiques encore ouvertes.
        visuel:
          agents: [lark]
  faq:
    - q: "Peut-on utiliser nos propres grilles d'audit ?"
      a: Oui. Vous reprenez vos grilles et vous réglez la pondération de chaque point.
    - q: "L'audit se fait-il sur téléphone ?"
      a: "Oui, sur mobile, avec photos et l'historique de chaque point de contrôle."
    - q: Comment le franchisé reçoit-il son rapport ?
      a: "En PDF, sur WhatsApp, à la fin de l'audit."
    - q: "Un restaurant peut-il s'auto-évaluer ?"
      a: "Oui, Finch propose l'auto-évaluation entre deux visites."
    - q: Mes données sont-elles protégées ?
      a: "Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client. Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat."
  related:
    - agent: pecker
      texte: la formation
    - agent: lark
      texte: les remontées au siège
---
