---
name: Lark
job: Direction
pitch: Chaque matin, je vous donne l'état du réseau, les échéances et les relances à faire.
order: 6
# Page /agents/lark : brouillon rédigé à partir du contenu du site, de Sans Filtre (août 2026) et de la page Notion « Les agents Hatch OS », à relire par Patrick.
page:
  brouillon: true
  updated: '2026-10-02'
  seo:
    title: 'Lark · le pilotage du réseau pour le siège | Hatch OS'
    description: "Lark donne chaque matin au siège l'état du réseau : ce qui a bougé, les échéances, les ouvertures et les relances à faire, à partir de l'activité des agents."
  title: 'Le pilotage de tout le réseau, chaque matin, pour le siège'
  lead: "Lark donne chaque matin au siège l'état de tout le réseau à partir de ce que font les autres agents : ce qui a bougé, les prochaines échéances et les relances à faire."
  problem:
    title: "L'état du réseau est éparpillé"
    text: 'Les audits sont dans un fichier, les formations dans un autre, les ouvertures dans les mails. Pour savoir où en est le réseau, il faut appeler, compiler, relancer. Et ce qui dérape se voit trop tard.'
  actions:
    title: 'Ce que je fais pour le siège'
    items:
      - title: 'Je prépare votre point du matin'
        text: "L'état du réseau, les chiffres de la semaine et ce qui demande votre attention aujourd'hui."
      - title: 'Je réponds sur tout le réseau'
        text: "Posez-moi une question en langage naturel : je m'appuie sur les informations de tous les autres agents."
      - title: 'Je suis les échéances et les ouvertures'
        text: 'Audits à venir, formations en retard, ouvertures en cours : je vous dis quoi traiter, et qui relancer.'
      - title: 'Je repère les sujets qui reviennent'
        text: 'Le tableau de bord du siège classe automatiquement les thèmes abordés par vos équipes avec les agents.'
  demo: lark
  scenario: null
  tools:
    text: "Rien de plus à brancher : je lis l'activité de vos agents dans Hatch OS."
    items:
      - { name: Hatch OS }
  faq:
    - q: "D'où viennent les informations de Lark ?"
      a: "De l'activité de vos agents dans Hatch OS : questions reçues par Peep et Owl, audits de Finch, formations de Pecker, ouvertures suivies par Sparrow."
    - q: 'Peut-on poser une question précise à Lark ?'
      a: "Oui, en langage naturel, comme à un collègue : « quels audits sont en retard ? », « où en est l'ouverture d'Angers ? »."
    - q: 'Qui voit le point du matin ?'
      a: 'Le siège. Les accès se règlent par rôle : un franchisé ne voit que le périmètre de son établissement.'
  related: [peep, finch, sparrow]
---
