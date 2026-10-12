---
name: Sparrow
job: Development
pitch: I qualify your franchise candidates and follow every opening through to day one.
order: 7
# /en/agents/sparrow page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Sparrow · franchise candidate CRM and openings | Hatch OS'
    description: 'Sparrow pre-qualifies your franchise candidates on WhatsApp, tracks them through your pipeline and runs every opening with a back-schedule that recalculates itself.'
  title: Qualify your franchise candidates and run every opening
  lead: 'Sparrow is the Hatch OS agent that talks with your franchise candidates on WhatsApp, pre-qualifies them, moves them through your pipeline, then runs the opening project once the contract is signed.'
  problem:
    titre: 'You spend your days sorting candidates.'
    texte: 'They come from the website, trade shows and franchise listings, end up in a hand-kept Excel file, and most have neither the capital nor the project.'
  actions:
    - '**A WhatsApp number dedicated to your brand**, reachable by QR code, form, or CSV import of your existing candidates.'
    - "**Pre-qualification**: Sparrow asks your questions (capital, area, experience) and introduces itself from the start as your brand's AI assistant. It also collects the documents you ask the candidate for, straight from their portal."
    - '**Your pipeline**, with your stages and a checklist per stage.'
    - '**Automations and reminders** so that no candidate is left without news.'
    - '**Head office takes over**: at any time, a human takes over the conversation.'
    - '**Build-out follow-up**: Sparrow asks the project owner for missing documents, and keeps head office informed task by task.'
    - '**The opening project** created automatically from your templates, with a back-schedule that recalculates when a date moves.'
    - '**A project owner space** so the future franchisee, invited by head office, can follow their tasks and their build-out.'
    - '**A dashboard** for recruitment and openings.'
  control:
    agent:
      - Answer and pre-qualify on WhatsApp
      - Remind candidates and project owners (never more than 5 times without a reply)
      - Recalculate the back-schedule
    you:
      - Your criteria and your questions
      - Moving from one stage to the next
      - 'The signature, when to take over the conversation, when to pause Sparrow'
  exemple:
    contexte: Development · Candidates
    etapes:
      - texte: A candidate scans the QR code at a trade show.
        demande:
          qui: Candidate · via the trade show QR code
          texte: 'Hello, I would like to open a restaurant in Nantes.'
        carte:
          icone: message-circle
          libelle: "The brand's AI assistant"
          texte: "Hello, I am the brand's AI assistant. A few questions to prepare your file."
          lignes:
            - texte: Capital
              etat: Checked
              ton: vert
            - texte: Area · Nantes
              etat: Available
              ton: vert
            - texte: Experience
              etat: To complete
              ton: orange
          pastilles:
            - texte: Added to the pipeline
              icone: kanban
              sombre: true
      - texte: 'Sparrow writes to them on WhatsApp, checks their capital and area, and places them in the pipeline.'
        demande:
          qui: Thomas · candidate · WhatsApp
          texte: '€80,000 of capital, for Nantes. I ran a bakery for six years.'
        carte:
          icone: kanban
          libelle: Pipeline · Candidates
          titre: Thomas Leroy · Nantes
          lignes:
            - texte: 'Capital · €80,000'
              etat: Checked
              ton: vert
            - texte: Area · Nantes
              etat: Available
              ton: vert
            - texte: Experience · 6 years in retail
              etat: Checked
              ton: vert
            - texte: Pipeline stage
              etat: Qualified
              ton: bleu
          pastilles:
            - texte: Conversation on WhatsApp
              icone: message-circle
              sombre: false
            - texte: Reminder · D+2
              icone: bell-ring
              sombre: true
      - texte: The developer gets a sorted file.
        demande:
          qui: Marc · network developer
          texte: "Sparrow, where is the Nantes candidate's file at?"
        carte:
          icone: folder-check
          libelle: Candidate file · Nantes
          titre: Ready for the meeting
          lignes:
            - texte: Pre-qualification questions
              etat: Complete
              ton: vert
            - texte: Proof of capital
              etat: Received
              ton: vert
            - texte: ID document
              etat: Received
              ton: vert
          pastilles:
            - texte: Proof of capital · PDF
              icone: file-text
              sombre: false
            - texte: Meeting to schedule
              icone: calendar
              sombre: true
      - texte: 'After signing, the opening project is created with its back-schedule, and the project owner follows their steps in their own space.'
        demande:
          qui: Marc · network developer
          texte: Contract signed with Thomas. Start the BunBun Nantes opening.
        carte:
          icone: chart-gantt
          libelle: Opening project · BunBun Nantes
          titre: Opening planned for 3 March
          lignes:
            - texte: BunBun opening template
              etat: 42 tasks
              ton: gris
            - texte: Back-schedule
              etat: 20 weeks
              ton: gris
            - texte: Project owner space
              etat: Thomas invited
              ton: bleu
          pastilles:
            - texte: Back-schedule recalculated if a date moves
              icone: refresh-cw
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: for conversations with candidates.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Your forms and CSV files
        texte: to bring in your existing candidates.
        visuel:
          icone: file-spreadsheet
          ton: cuivre
      - titre: Pecker and Peep
        texte: which take over once the restaurant is open.
        visuel:
          agents: [pecker, peep]
      - titre: Lark
        texte: which reports the progress of openings to head office.
        visuel:
          agents: [lark]
  faq:
    - q: Does the candidate know they are talking to an AI?
      a: 'Yes. Sparrow says so in the very first message, and head office can take over the conversation at any time.'
    - q: Can we import our current candidates?
      a: 'Yes, by CSV import.'
    - q: How do candidates get into Sparrow?
      a: 'By QR code, by form, or by writing to the WhatsApp number dedicated to your brand.'
    - q: "Does Sparrow also follow the restaurant's opening?"
      a: 'Yes. After signing, it creates the opening project with a back-schedule and a space for the project owner.'
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: lark
      texte: steering the network
    - agent: pecker
      texte: training
---
