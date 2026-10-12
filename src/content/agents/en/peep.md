---
name: Peep
job: Network life
pitch: 'I answer your teams on WhatsApp, in their language, from your procedures, and I share your announcements.'
order: 1
# /en/agents/peep page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Peep · the WhatsApp agent for your field teams | Hatch OS'
    description: "Peep answers your franchisees' and crew members' questions on WhatsApp, in their language, from your documents. It sends your announcements translated and tracks who has read them."
  title: "Answer your restaurants and share your news on WhatsApp, in each crew member's language"
  lead: "Peep is the Hatch OS agent that answers franchisees' and crew members' questions on WhatsApp, in their language, from your own documents, and sends your announcements to the network while tracking who has read them."
  problem:
    titre: 'Your announcements go out. No one knows who reads them.'
    texte: 'Email, WhatsApp group, phone: every update from head office goes out on three channels, and the same questions come back to head office all week.'
  actions:
    - '**It answers questions from the field**, on WhatsApp, relying only on your manuals and sheets. Crew members install nothing. It also reads your spreadsheets (rotas, grids, technical sheets).'
    - "**It speaks everyone's language.** Head office writes in French; Peep detects the crew member's language and answers in it (English, Spanish, Bengali, Tamil…). Your announcements are translated automatically for each recipient."
    - '**It passes on to head office what it does not know.** A question your documents do not answer lands in your Hatch OS inbox, you reply, the crew member is told.'
    - '**It writes your announcements**: you give the idea, Peep drafts the message, with blocks and a quiz to check it was understood.'
    - '**It targets and schedules**: the whole network, or only some restaurants thanks to tags (region, format, franchised or company-owned). Sent now or scheduled.'
    - '**It follows up and measures**: automatic reminders for unread messages, read tracking restaurant by restaurant.'
    - '**It understands voice notes**: a voice message is transcribed and handled like a written question.'
  control:
    agent:
      - Answer the questions your documents cover
      - Remind the restaurants that have not read
      - Transcribe voice notes
    you:
      - The documents it uses as sources
      - The content of each announcement before it goes out
      - The answer to the questions it passes on to you
  exemple:
    intro: Head office launches a new seasonal recipe.
    contexte: Announcements
    etapes:
      - texte: 'It asks Peep for a message with the recipe sheet and three quiz questions,'
        demande:
          qui: Claire · head office
          texte: 'Peep, write the autumn burger announcement, with the sheet and three quiz questions.'
        carte:
          banniere: Autumn burger
          texte: Available from Monday in the restaurants concerned. The sheet is attached.
          pastilles:
            - texte: Recipe sheet · PDF
              icone: file-text
              sombre: false
            - texte: Quiz · 3 questions
              icone: list-checks
              sombre: true
          boutons:
            - Edit
            - Choose restaurants
      - texte: 'sends it to the restaurants concerned,'
        demande:
          qui: Claire · head office
          texte: 'Send it to the restaurants with the autumn menu, Monday at 9 am.'
        carte:
          icone: send
          libelle: 'Scheduled · Monday 9:00'
          titre: 12 restaurants targeted
          lignes:
            - texte: 'Tags: Île-de-France, Franchised'
              etat: 12 restaurants
              ton: gris
            - texte: Translated for each crew member
              etat: 5 languages
              ton: bleu
            - texte: Understanding quiz
              etat: 3 questions
              ton: gris
          pastilles:
            - texte: 'Monday · 9:00'
              icone: calendar
              sombre: true
      - texte: and sees the next day which ones have not opened it.
        demande:
          qui: Claire · head office · Tuesday
          texte: "Who hasn't read the announcement yet?"
        carte:
          icone: eye
          libelle: Read tracking
          titre: 10 / 12 restaurants have read it
          lignes:
            - texte: Nantes Centre
              etat: Reminded
              ton: orange
            - texte: Bordeaux Gare
              etat: Unread
              ton: gris
            - texte: Lyon Part-Dieu
              etat: 'Read · 09:40'
              ton: vert
          pastilles:
            - texte: Automatic reminder
              icone: refresh-cw
              sombre: true
      - texte: "Crew members' questions about plating are handled by Peep from the sheet."
        demande:
          qui: Crew member · Lyon Part-Dieu
          texte: Does the sauce go before or after the cheddar?
        carte:
          icone: file-text
          libelle: Recipe sheet · Autumn burger
          titre: 'After the cheddar, just before closing it.'
          texte: "That's step 4 of plating, with a photo in the sheet."
          pastilles:
            - texte: Recipe sheet · PDF
              icone: file-text
              sombre: false
            - texte: Answered in their language
              icone: languages
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: where your teams already are.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Jay
        texte: 'which gives it access to your documents (Google Drive, Notion, OneDrive / SharePoint, PDF).'
        visuel:
          agents: [jay]
      - titre: Lark
        texte: which reports the signals from these conversations to head office.
        visuel:
          agents: [lark]
  faq:
    - q: Do my crew members need to install an app?
      a: 'No. Peep works on WhatsApp, which your teams already use.'
    - q: Does Peep answer crew members who do not speak French?
      a: "Yes. It detects the crew member's language and answers in it, from your documentation in French. Head office announcements are also translated automatically for each recipient."
    - q: What happens if Peep does not know the answer?
      a: "It does not make it up. The question lands in head office's inbox, and head office answers."
    - q: Can an announcement go to only part of the network?
      a: 'Yes, by targeting with tags: region, format, type of restaurant.'
    - q: How do I know who has read an announcement?
      a: "Peep's dashboard shows reads restaurant by restaurant, and unread messages are followed up."
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: owl
      texte: "the same knowledge on the restaurant's tablet"
    - agent: pecker
      texte: training
    - agent: jay
      texte: your documents
---
