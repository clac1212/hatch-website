---
name: Owl
job: On site
pitch: I answer out loud during service, on the location's tablet.
order: 3
# /en/agents/owl page: draft written from the site's content, Unfiltered (August 2026) and the Notion page "Les agents Hatch OS", to be reviewed by Patrick.
page:
  brouillon: true
  updated: '2026-10-02'
  seo:
    title: 'Owl · the AI assistant on the restaurant tablet | Hatch OS'
    description: "Owl answers kitchen and front-of-house teams out loud, on the restaurant's tablet, from the network's procedures and recipe sheets."
  title: "The AI assistant on the restaurant's tablet"
  lead: "Owl answers crew members out loud in the kitchen and front of house, on the restaurant's tablet, from the network's procedures, so they find the right step without leaving their station."
  problem:
    title: 'Mid-service, nobody has time to look for the sheet'
    text: 'The cooking sheet is in a binder, the manual in a Drive, the manager at the pass. So the crew member asks a colleague, or goes from memory. And every location ends up with its own version of the recipe.'
  actions:
    title: 'What I do in the kitchen and front of house'
    items:
      - title: 'I answer by voice'
        text: 'Ask me out loud, I answer out loud. The keyboard works too.'
      - title: 'I show the procedure step by step'
        text: "I read the sheet and show each step on screen, at the crew member's pace."
      - title: 'I know every location'
        text: "Head office tells me what applies to each site: I answer with your location's own information."
      - title: 'I stay on all day'
        text: 'In kiosk mode on a shared tablet, in the dining room or the kitchen, I answer the teams throughout service.'
  demo: owl
  scenario: null
  tools:
    text: 'I run in Hatch OS, on a shared tablet, with the same documents as Peep.'
    items:
      - { name: Tablet in kiosk mode }
      - { name: Google Drive, logo: google-drive }
      - { name: Notion, logo: notion }
      - { name: Word, logo: word }
      - { name: PDF, logo: pdf }
      - { name: Excel, logo: excel }
  faq:
    - q: "How do you set Owl up on the restaurant's tablet?"
      a: 'Head office creates an Owl access profile for the location, invites an address dedicated to the site, then signs the tablet in with that account.'
    - q: "What's the difference between Owl and Peep?"
      a: "It's the same assistant. Peep answers on WhatsApp, on everyone's phone; Owl answers in Hatch OS, on the location's shared tablet."
    - q: 'Does Owl answer the same way in every restaurant?'
      a: "It answers with the network's procedures, and with what is specific to each location once head office has told it."
    - q: 'Are conversations kept?'
      a: 'Yes, the conversation history stays available. Your data is hosted in Europe and never trains any AI.'
  related: [peep, jay, pecker]
---
