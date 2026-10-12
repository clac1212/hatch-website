---
name: Finch
job: Quality and compliance
pitch: I audit your locations against one shared checklist and turn every gap into an action.
order: 2
# /en/agents/finch page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Finch · quality audits across your whole network | Hatch OS'
    description: 'Finch digitises your quality and hygiene audits: weighted checklists, mobile audits with photos, a PDF report sent on WhatsApp and an action plan followed up until proven.'
  title: Audit your restaurants and see every action plan through to the end
  lead: 'Finch is the Hatch OS agent that runs your quality audits on mobile, calculates the score, sends the report to the franchisee on WhatsApp and follows up the action plan until every fix is proven.'
  problem:
    titre: 'Your audits stop at the report.'
    texte: 'The action plan gets lost between two visits, and the same gap comes back at the next audit.'
  actions:
    - '**Your checklists, weighted**: you bring your current checklist and give each checkpoint a weight.'
    - '**The audit on mobile** with photos. On each checkpoint, the auditor sees the history: results and comments from previous audits, status of past actions.'
    - '**A score out of 100** calculated automatically from the weighting.'
    - '**A PDF report sent on WhatsApp** to the franchisee as soon as the audit ends.'
    - '**An action plan suggested by AI**, with a criticality level for each gap.'
    - '**Proof of correction** uploaded by the franchisee (photo, document or a simple comment), with a status per action. The final report includes this proof.'
    - '**Self-assessment**: the restaurant can audit itself between two visits.'
    - '**A network dashboard** that shows the checkpoints that are drifting.'
  control:
    agent:
      - Calculate the score and generate the PDF
      - Suggest an action plan with criticality
      - Send the report on WhatsApp
    you:
      - Your checklists and their weighting
      - The actions kept and their deadlines
      - Who can audit (the “audit lead” role)
  exemple:
    contexte: Audit · Lille Centre
    etapes:
      - texte: A network manager audits a restaurant on her phone.
        demande:
          qui: Network manager · end of audit
          texte: 'Audit finished on the phone: Lille Centre.'
        carte:
          icone: send
          libelle: Report sent on WhatsApp
          titre: 84 / 100
          lignes:
            - texte: Cold room door seal
              etat: Critical
              ton: rouge
            - texte: Prep labelling
              etat: Major
              ton: orange
            - texte: Allergen display
              etat: Minor
              ton: gris
          pastilles:
            - texte: Report · PDF
              icone: file-text
              sombre: false
            - texte: Proof expected
              icone: camera
              sombre: true
      - texte: 'At the end, the franchisee gets the report on WhatsApp with three actions, one of them critical.'
        demande:
          qui: Franchisee · Lille Centre
          texte: Got the report. Where do I start?
        carte:
          icone: list-checks
          libelle: Action plan · 3 actions
          titre: '1 critical, to fix today'
          lignes:
            - texte: Cold room door seal
              etat: Today
              ton: rouge
            - texte: Prep labelling
              etat: By Friday
              ton: orange
            - texte: Allergen display
              etat: Within 15 days
              ton: gris
          pastilles:
            - texte: Report · PDF
              icone: file-text
              sombre: false
            - texte: Received on WhatsApp
              icone: message-circle
              sombre: true
      - texte: 'He uploads a photo of the fix, the network manager approves it, and the dashboard shows whether this point is drifting elsewhere in the network.'
        demande:
          qui: Network manager · Thursday
          texte: "Lille Centre's proof approved. Does this point come up elsewhere?"
        carte:
          icone: chart-no-axes-column
          libelle: Network dashboard
          titre: The same gap in 3 restaurants
          lignes:
            - texte: Lille Centre
              etat: Fixed
              ton: vert
            - texte: Nantes Centre
              etat: Open · critical
              ton: rouge
            - texte: Bordeaux Gare
              etat: Open · major
              ton: orange
          pastilles:
            - texte: Photo approved
              icone: camera
              sombre: false
            - texte: Drifting checkpoints
              icone: trending-up
              sombre: true
  with:
    cartes:
      - titre: WhatsApp
        texte: for the report and the proof.
        visuel:
          icone: whatsapp
          ton: whatsapp
      - titre: Pecker
        texte: when a recurring gap calls for training.
        visuel:
          agents: [pecker]
      - titre: Lark
        texte: which reports the critical actions still open to head office.
        visuel:
          agents: [lark]
  faq:
    - q: Can we use our own audit checklists?
      a: Yes. You bring your checklists and set the weight of each point.
    - q: Is the audit done on a phone?
      a: 'Yes, on mobile, with photos and the history of each checkpoint.'
    - q: How does the franchisee get their report?
      a: 'As a PDF, on WhatsApp, at the end of the audit.'
    - q: Can a restaurant assess itself?
      a: 'Yes, Finch offers self-assessment between two visits.'
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: pecker
      texte: training
    - agent: lark
      texte: what reaches head office
---
