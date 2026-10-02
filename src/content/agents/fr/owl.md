---
name: Owl
job: Établissement
pitch: Je réponds à voix haute pendant le service, sur la tablette de l'établissement.
order: 3
# Page /agents/owl : brouillon rédigé à partir du contenu du site, de Sans Filtre (août 2026) et de la page Notion « Les agents Hatch OS », à relire par Patrick.
page:
  brouillon: true
  updated: '2026-10-02'
  seo:
    title: "Owl · l'assistant IA sur tablette au restaurant | Hatch OS"
    description: 'Owl répond à voix haute aux équipes en cuisine et en salle, sur la tablette du restaurant, à partir des procédures et des fiches du réseau.'
  title: "L'assistant IA sur la tablette du restaurant"
  lead: "Owl répond à voix haute aux équipiers en cuisine et en salle, sur la tablette du restaurant, à partir des procédures du réseau, pour qu'ils trouvent la bonne étape sans quitter leur poste."
  problem:
    title: "En plein service, personne n'a le temps de chercher la fiche"
    text: "La fiche cuisson est dans un classeur, le manuel dans un Drive, le manager au passe. Alors l'équipier demande à un collègue, ou fait de mémoire. Et chaque site finit par avoir sa propre version de la recette."
  actions:
    title: 'Ce que je fais en cuisine et en salle'
    items:
      - title: 'Je réponds à la voix'
        text: 'On me pose la question à voix haute, je réponds à voix haute. Le clavier fonctionne aussi.'
      - title: 'Je montre la procédure étape par étape'
        text: "Je lis la fiche et j'affiche chaque étape à l'écran, au rythme de l'équipier."
      - title: 'Je connais chaque établissement'
        text: 'Le siège me signale ce qui vaut pour chaque site : je réponds avec les informations propres à votre établissement.'
      - title: 'Je reste posé toute la journée'
        text: 'En mode kiosque sur une tablette partagée, en salle ou en cuisine, je réponds aux équipes tout au long du service.'
  demo: owl
  scenario: null
  tools:
    text: 'Je tourne dans Hatch OS, sur une tablette partagée, avec les mêmes documents que Peep.'
    items:
      - { name: Tablette en mode kiosque }
      - { name: Google Drive, logo: google-drive }
      - { name: Notion, logo: notion }
      - { name: Word, logo: word }
      - { name: PDF, logo: pdf }
      - { name: Excel, logo: excel }
  faq:
    - q: 'Comment installer Owl sur la tablette du restaurant ?'
      a: "Le siège crée un profil d'accès Owl pour l'établissement, invite une adresse dédiée au site, puis connecte la tablette avec ce compte."
    - q: 'Owl et Peep, quelle différence ?'
      a: "C'est le même assistant. Peep répond sur WhatsApp, sur le téléphone de chacun ; Owl répond dans Hatch OS, sur la tablette partagée du site."
    - q: 'Owl répond-il pareil dans tous les restaurants ?'
      a: 'Il répond avec les procédures du réseau, et avec ce qui est propre à chaque établissement quand le siège le lui a indiqué.'
    - q: 'Les conversations sont-elles conservées ?'
      a: "Oui, l'historique des conversations reste consultable. Vos données sont hébergées en Europe et n'entraînent aucune IA."
  related: [peep, jay, pecker]
---
