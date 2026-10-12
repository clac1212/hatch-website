---
name: Pecker
job: Training
pitch: I turn your procedures into five-minute courses and track who has completed what.
order: 5
# /en/agents/pecker page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Pecker · crew training, no app and no password | Hatch OS'
    description: "Pecker sends your training through a simple WhatsApp link: it opens on the phone, with no app or account, in each person's language. Reminders and skills assessments included."
  title: Train your crew and franchisees with no app to install and no password
  lead: 'Pecker is the Hatch OS agent that sends each crew member a link on WhatsApp: one tap, and the training opens on their phone, with no app and no password. Pecker reminds those who have not finished and assesses skills in the restaurant.'
  problem:
    titre: 'Your crew never logs in to the training platform.'
    texte: 'Not between two services, not with a forgotten password. And if the team struggles to read French, the materials are no use.'
  actions:
    - '**A course editor** to build your training modules.'
    - '**A magic link sent on WhatsApp**: the crew member taps, the training opens in their browser. No app to download, no account to create.'
    - '**Automatic triggers**: a course goes out on its own when the condition you set is met, for example a new crew member joining.'
    - '**It reminds those who drop off**, without the manager having to chase them.'
    - '**Quizzes with results**: at the end of a course, the crew member sees their answers and score; you see who got stuck on which question.'
    - '**Automatic translation**: each crew member takes the training in their own language, without you translating anything.'
    - "**Skills assessments** in the restaurant with your grids: you choose the assessor, the result is shared as a PDF or by message and stays in the crew member's file."
    - '**A dashboard** to see, course by course, who has started, finished or dropped off.'
  control:
    agent:
      - Send the training link at the right time
      - Remind those who have not finished
      - Translate the content
    you:
      - The content of each course
      - 'Who gets which course, and when'
      - The assessment grids and who assesses
  exemple:
    contexte: Training · Onboarding course
    etapes:
      - texte: A new crew member is added in Hatch OS.
        demande:
          qui: Hatch OS · Team
          texte: 'New crew member added: Yanis, Lille Centre.'
        carte:
          icone: send
          libelle: Link sent on WhatsApp
          titre: Onboarding course
          lignes:
            - texte: Module 1 · Welcome
              etat: Sent
              ton: vert
            - texte: Module 2 · Hygiene
              etat: Up next
              ton: gris
            - texte: Module 3 · Till
              etat: Up next
              ton: gris
          pastilles:
            - texte: Magic link
              icone: link
              sombre: false
            - texte: In his language
              icone: languages
              sombre: true
      - texte: Pecker sends him the link to his onboarding course on WhatsApp.
        demande:
          qui: Sami · Lille Centre manager
          texte: Did Yanis get his onboarding course?
        carte:
          icone: message-circle
          libelle: WhatsApp · Yanis
          titre: Link received and opened
          lignes:
            - texte: Message delivered
              etat: '9:05'
              ton: vert
            - texte: Course opened on his phone
              etat: '9:12'
              ton: vert
            - texte: Reading language
              etat: Portuguese
              ton: bleu
          pastilles:
            - texte: No app
              icone: smartphone
              sombre: false
            - texte: No account
              icone: check
              sombre: true
      - texte: 'He opens it on his phone during his break, and Pecker reminds him if he stops along the way.'
        demande:
          qui: Sami · manager · Thursday
          texte: How far has Yanis got in his course?
        carte:
          icone: bell-ring
          libelle: Reminded · D+3
          titre: 1 module out of 3 finished
          lignes:
            - texte: Module 1 · Welcome
              etat: Finished
              ton: vert
            - texte: Module 2 · Hygiene
              etat: Reminded
              ton: orange
            - texte: Module 3 · Till
              etat: Up next
              ton: gris
          pastilles:
            - texte: Automatic reminder
              icone: refresh-cw
              sombre: true
      - texte: "After a few weeks, the manager assesses him at his station with the network's grid and the PDF is filed."
        demande:
          qui: Sami · Lille Centre manager
          texte: "Yanis's assessment at the till station, with the BunBun grid."
        carte:
          icone: clipboard-check
          libelle: On-the-job assessment · BunBun grid
          titre: Yanis · 17 / 20
          lignes:
            - texte: Customer welcome
              etat: Passed
              ton: vert
            - texte: Prep
              etat: Passed
              ton: vert
            - texte: Taking payment
              etat: To review
              ton: orange
          pastilles:
            - texte: PDF filed
              icone: file-text
              sombre: false
            - texte: "Yanis's record"
              icone: user
              sombre: true
  with:
    cartes:
      - titre: Peep
        texte: for sending the link and the reminders on WhatsApp.
        visuel:
          agents: [peep]
      - titre: Jay
        texte: whose documents are the raw material.
        visuel:
          agents: [jay]
      - titre: Peep and Owl
        texte: 'which reveal the most-asked questions, and so the courses to create.'
        visuel:
          agents: [peep, owl]
      - titre: Finch
        texte: when an audit shows a weak spot to work on.
        visuel:
          agents: [finch]
  faq:
    - q: Does the crew member need to install an app or create an account?
      a: "No. They get a link on WhatsApp; the training opens in their phone's browser."
    - q: Can courses be translated?
      a: 'Yes, and it is automatic: each crew member gets the training in their own language. You write a single version, in French.'
    - q: How do I know who has finished?
      a: The dashboard shows the progress of each person and each restaurant.
    - q: Can a crew member be assessed on the job?
      a: 'Yes, with your skills assessment grids. The result is generated as a PDF.'
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: peep
      texte: sending and reminders on WhatsApp
    - agent: finch
      texte: audits in the restaurant
    - agent: jay
      texte: your documents
---
