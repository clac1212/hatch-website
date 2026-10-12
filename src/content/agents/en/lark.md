---
name: Lark
job: Management
pitch: 'Every morning, I give you the state of the network, the deadlines and the follow-ups to send.'
order: 6
# /en/agents/lark page: translation of Patrick's copy (Notion "08 · Pages agents", 08/10/2026), laid out after the Pencil mock-up "Page agent".
page:
  brouillon: false
  updated: '2026-10-08'
  seo:
    title: 'Lark · steering your franchise network | Hatch OS'
    description: 'Lark brings together what your Hatch OS agents do across the network and answers your questions about the state of your restaurants, on a single screen.'
  title: See on one screen what is happening across your whole network
  lead: 'Lark is the Hatch OS agent that brings together the signals reported by your other agents (announcements, training, audits, openings) and answers you when you ask about the state of your network.'
  problem:
    titre: 'To know which restaurant is slipping, you cross-check everything by hand.'
    texte: 'Audits in a spreadsheet, announcements on WhatsApp, candidates in another tool.'
  actions:
    - '**A network home page** that gathers what your agents have seen: unread announcements, overdue training, recent audits, actions in progress.'
    - "**A conversation about the state of the network**: you ask the question in plain words, Lark answers from your agents' data."
    - '**A network dashboard** to track indicators over time.'
    - "**The topics coming up from the field**: the questions asked to the agents are sorted by theme automatically. You see what is on your restaurants' minds this week."
  control:
    agent:
      - "Gather the other agents' signals"
      - Answer your questions about the network
    you:
      - The actions to launch
      - 'Who, at head office, can access what'
  exemple:
    contexte: Network home
    etapes:
      - texte: 'On Monday, the network director opens Hatch OS and sees on the home page three restaurants that have not read the latest announcement and an audit with critical actions still open.'
        demande:
          qui: 'Network director · Monday 08:45'
          texte: What needs my attention this week?
        carte:
          icone: layout-grid
          libelle: Network home
          lignes:
            - texte: 3 restaurants have not read the announcement
              etat: To follow up
              ton: orange
            - texte: Nantes Centre audit
              etat: 2 critical actions
              ton: rouge
            - texte: Bordeaux opening
              etat: On schedule
              ton: vert
          pastilles:
            - texte: Call the franchisees
              icone: phone
              sombre: true
      - texte: 'She calls the right franchisees, without opening four tools.'
        demande:
          qui: 'Network director · Monday 08:47'
          texte: 'Who should I call this morning, and about what?'
        carte:
          icone: phone
          libelle: To call this morning
          titre: 4 franchisees
          lignes:
            - texte: Marc · Nantes Centre
              etat: Audit · 2 critical actions
              ton: rouge
            - texte: Sonia · Metz Centre
              etat: Announcement unread
              ton: orange
            - texte: Karim · Lille Centre
              etat: Announcement unread
              ton: orange
            - texte: Julie · Rennes Centre
              etat: Announcement unread
              ton: orange
          pastilles:
            - texte: Peep · Finch
              icone: git-merge
              sombre: false
            - texte: Numbers in the file
              icone: contact
              sombre: true
  with:
    texte: 'All the agents: **Peep, Owl, Pecker, Jay, Finch and Sparrow**. Lark is only useful with at least one other agent: it is the one that connects them.'
    agents:
      - peep
      - owl
      - pecker
      - jay
      - finch
      - sparrow
  faq:
    - q: Does Lark work on its own?
      a: No. It relies on what your other Hatch OS agents report.
    - q: What can you ask it?
      a: 'Questions about the activity your agents track, for example the restaurants behind on a course or the audit actions still open.'
    - q: Does it replace a reporting tool?
      a: 'It does not replace your till or your accounting. It covers what your teams do with the agents: information, training, quality, openings.'
    - q: Is my data protected?
      a: 'Data hosted in Europe, encrypted in transit and at rest, isolated per customer. No model is trained on your data, and that is written into the contract.'
  related:
    - agent: peep
      texte: announcements and who has read them
    - agent: finch
      texte: audits and their actions
    - agent: sparrow
      texte: openings and candidates
---
