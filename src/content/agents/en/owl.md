---
name: Owl
job: On site
pitch: "I answer out loud during service, on the location's tablet."
order: 3
# /en/agents/owl page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: "Owl · the AI assistant on the restaurant's tablet | Hatch OS"
    description: "Owl runs on the restaurant's tablet. Crew members ask their question by voice or in writing and get the answer drawn from your sheets, without leaving their station."
  title: "An assistant on the restaurant's tablet to answer crew members during service"
  lead: "Owl is the Hatch OS agent installed on the restaurant's tablet: crew members ask their question by voice or in writing and get the answer drawn from your sheets, without leaving their station or digging through a binder."
  problem:
    titre: 'Mid-service, no one goes looking for a recipe card.'
    texte: "The binder is in the office, the Drive isn't open, and the question ends up with the manager, when they're around."
  actions:
    - '**It runs in kiosk mode** on a shared tablet: the screen stays on Owl, nothing else.'
    - '**It understands voice**: crew members dictate their question, hands full or not.'
    - '**It answers from your documents**, the same ones Peep and Jay use.'
    - '**It adapts to the restaurant**: one profile per tablet, and tags that set what each location sees (format, menu, region).'
  control:
    agent:
      - Answer the questions asked on the tablet
      - Show the answer that fits the restaurant
    you:
      - The documents it can access
      - The tags of each tablet
  exemple:
    contexte: Tablet · Kitchen
    etapes:
      - texte: "A crew member who started last week asks the tablet for a product's cooking temperature."
        demande:
          qui: Crew member · kitchen
          texte: What temperature do we cook the chicken to?
        carte:
          icone: file-text
          libelle: Network sheet · Cooking
          titre: 74 °C at the core
          texte: Check with the probe thermometer before serving.
          pastilles:
            - texte: Cooking sheet · PDF
              icone: book-open
              sombre: false
            - texte: Read out loud
              icone: volume-2
              sombre: true
      - texte: "Owl answers with the network's sheet."
        demande:
          qui: Crew member · kitchen
          texte: Read me the whole sheet.
        carte:
          icone: volume-2
          libelle: Read out loud · Cooking sheet
          titre: 'Breaded chicken, step by step'
          lignes:
            - texte: Fryer preheated
              etat: 170 °C
              ton: gris
            - texte: Cooking time
              etat: 6 min
              ton: gris
            - texte: Probe check
              etat: 74 °C at the core
              ton: orange
          pastilles:
            - texte: BunBun manual · Cooking v2
              icone: file-text
              sombre: false
            - texte: Profile · Lille Centre
              icone: tablet
              sombre: true
      - texte: The manager was not interrupted.
        demande:
          qui: 'Manager · Lille Centre · 15:00'
          texte: How many questions during lunch service?
        carte:
          icone: chart-bar
          libelle: Kitchen tablet · lunch service
          titre: '14 questions, 14 answers from the sheets'
          lignes:
            - texte: Cooking the chicken
              etat: Answered
              ton: vert
            - texte: Cleaning the fryer
              etat: Answered
              ton: vert
            - texte: Passed on to the manager
              etat: '0'
              ton: gris
          pastilles:
            - texte: No interruption
              icone: check
              sombre: true
  with:
    cartes:
      - titre: Jay
        texte: which keeps the documents Owl relies on up to date.
        visuel:
          agents: [jay]
      - titre: Peep
        texte: which brings the same knowledge to WhatsApp.
        visuel:
          agents: [peep]
      - titre: Pecker
        texte: to train crew members on what they ask most.
        visuel:
          agents: [pecker]
  faq:
    - q: What is the difference between Owl and Peep?
      a: "Peep answers on WhatsApp, on each person's phone. Owl is on the restaurant's shared tablet, for those who do not have their phone during service."
    - q: Can you ask a question by voice?
      a: 'Yes, Owl understands voice dictation.'
    - q: Does every restaurant see the same information?
      a: "Not if you do not want it to: tags adapt the answers to the restaurant's format or menu."
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: peep
      texte: the same knowledge on WhatsApp
    - agent: jay
      texte: your documents
    - agent: pecker
      texte: training
---
