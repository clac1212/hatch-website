---
name: Jay
job: Documentation
pitch: 'I find, co-write and share your documents, from Drive, Notion or Airtable.'
order: 4
# /en/agents/jay page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Jay · your franchise operations manual, up to date | Hatch OS'
    description: 'Jay connects your documents (Google Drive, Notion, Airtable, SharePoint, PDF) so that your teams and your Hatch OS agents answer with the right version, source cited.'
  title: 'Your operations manual, finally read and always up to date'
  lead: 'Jay is the Hatch OS agent that connects your documents where they already are (Google Drive, Notion, Airtable, OneDrive / SharePoint, PDF), helps keep them up to date and makes them usable by your teams and your other agents, with the source cited in every answer.'
  problem:
    titre: 'Your manual exists. No one opens it.'
    texte: "It's long, scattered across the Drive in several versions, and no one knows which one is current."
  actions:
    - '**It plugs into the tools you already use**: Google Drive, Notion, Airtable, OneDrive / SharePoint. No migration: automatic sync every night, or on demand.'
    - '**It imports your PDFs**, spreadsheets and training videos.'
    - '**It helps you write**: “Edit with Jay” to rephrase, complete or structure a sheet, and templates to get started.'
    - '**It sets who sees what**: tags by profile and by restaurant limit access to each document.'
    - "**It lets you exclude a document** from the AI's answers (an old version, a draft), until you turn it back on."
    - '**It cites its sources**: every answer links to the document it comes from.'
    - '**It feeds the other agents**: Peep, Owl and Pecker answer and train from what Jay knows.'
  control:
    agent:
      - Read and index the connected documents
      - Suggest rewordings
      - Cite the source of every answer
    you:
      - Which folders and documents it can read
      - What gets published in your sheets
      - Who sees which document
  exemple:
    contexte: Documentation · Sources
    etapes:
      - texte: Head office connects its Google Drive.
        demande:
          qui: Head office · connection
          texte: Connect the “Operations manual” Google Drive.
        carte:
          icone: refresh-cw
          libelle: Synced · 214 documents
          lignes:
            - texte: Opening sheet
              etat: Up to date
              ton: vert
            - texte: Fryer cleaning v4
              etat: Up to date
              ton: vert
            - texte: Opening procedure v2
              etat: Excluded from answers
              ton: gris
          pastilles:
            - texte: Sources cited
              icone: quote
              sombre: false
            - texte: Resynced every night
              icone: moon
              sombre: true
      - texte: 'That same evening, a crew member asks Peep for the opening procedure: the answer comes with the link to the original sheet.'
        demande:
          qui: 'Crew member · Lille Centre · 21:40'
          texte: "I'm opening on my own tomorrow, what's the opening procedure?"
        carte:
          icone: message-circle
          libelle: Peep answers on WhatsApp
          titre: 'Turn the fryers on 30 min before service, then check the temperatures.'
          texte: 'The four steps are in the sheet, and the link comes with the answer.'
          pastilles:
            - texte: 'Source: Opening sheet'
              icone: link
              sombre: false
            - texte: Google Drive
              icone: folder-sync
              sombre: true
      - texte: 'When the sheet is changed in the Drive, the answers follow.'
        demande:
          qui: Claire · head office · Google Drive
          texte: "I'm adding the cold room to the temperature check in the opening sheet."
        carte:
          icone: refresh-cw
          libelle: 'Resynced overnight · 02:00'
          titre: Opening sheet · v3
          lignes:
            - texte: Opening sheet v3
              etat: Up to date
              ton: vert
            - texte: Opening sheet v2
              etat: Replaced
              ton: gris
            - texte: 'Answers from Peep, Owl and Pecker'
              etat: New version
              ton: bleu
          pastilles:
            - texte: Sources cited
              icone: quote
              sombre: false
            - texte: Resynced every night
              icone: moon
              sombre: true
  with:
    cartes:
      - titre: 'Google Drive, Notion, Airtable, OneDrive / SharePoint'
        texte: for your existing documents.
        visuel:
          icone: folder-sync
          ton: bleu
      - titre: 'Peep, Owl and Pecker'
        texte: 'which use this knowledge on WhatsApp, on the tablet and in training.'
        visuel:
          agents: [peep, owl, pecker]
  faq:
    - q: Do we have to move our documents into Hatch OS?
      a: 'No. Jay connects to Google Drive, Notion, Airtable or OneDrive / SharePoint. Your documents stay where they are and are synced again every night.'
    - q: Which formats are supported?
      a: 'Documents, PDFs, spreadsheets and videos (up to 1 GB per video).'
    - q: How do I know where an answer comes from?
      a: Every answer cites the source document.
    - q: Can Jay help me write a manual?
      a: 'Yes, with “Edit with Jay” and sheet templates.'
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: peep
      texte: answers on WhatsApp
    - agent: owl
      texte: "the same knowledge on the restaurant's tablet"
    - agent: pecker
      texte: training
---
