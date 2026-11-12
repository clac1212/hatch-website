---
title: "Une grille d'audit ne vaut que par les corrections qu'elle déclenche"
seoTitle: "Grille d'audit hygiène restaurant : pondération"
description: "Construire une grille d'audit pondérée pour un réseau de restaurants : points de contrôle, poids, score sur 100, actions correctives et fréquence."
kicker: 'Guide'
chapeau: "Un réseau de restaurants a besoin d'une grille d'audit qui mesure les mêmes points partout, pèse plus lourd sur ce qui met un client en danger et se termine par des corrections vérifiées. Cette page décrit comment choisir les points de contrôle, les pondérer, calculer un score, suivre les actions correctives et fixer la fréquence des visites."
essentiel:
  - "Partez des points que contrôlent les services de l'État, puis ajoutez vos standards de marque."
  - "Donnez à chaque point un niveau de gravité (critique, majeure, mineure) et un poids, et prévoyez qu'un écart critique déclenche une action quel que soit le score."
  - 'Un audit est terminé quand chaque écart a une action, un responsable, un délai et une preuve validée.'
public: reseau
metier: 'Hygiène et qualité'
agents: [finch]
readingMinutes: 7
updatedAt: '2026-11-10'
image: '../../../assets/ressources/grille-audit-hygiene-restaurant.jpg'
imageAlt: "Diorama en voxels sur le thème de l'audit d'hygiène d'un restaurant."
faq:
  - question: "Que doit contenir une grille d'audit hygiène pour un restaurant ?"
    reponse: "Les points que contrôlent les services de l'État : formation du personnel à l'hygiène, chaîne du froid, traçabilité, huiles de friture, information sur les allergènes, plan de maîtrise sanitaire. Ajoutez ensuite vos standards de marque. Chaque point doit être vérifiable sur place."
  - question: "Comment pondérer une grille d'audit ?"
    reponse: 'Classez chaque point en critique, majeur ou mineur et donnez un poids à chaque niveau, par exemple 10, 5 et 1. Ajoutez une règle bloquante : un écart critique déclenche une action immédiate et une contre-visite, quel que soit le score.'
  - question: "À quelle fréquence auditer les restaurants d'un réseau ?"
    reponse: 'Fixez un rythme de base commun, rapprochez les visites après un écart critique et demandez une auto-évaluation entre deux visites. Une partie des visites peut se faire sans prévenir.'
  - question: 'Quelle différence entre un audit interne et un contrôle officiel ?'
    reponse: "Le contrôle officiel est fait par les services de l'État, et son résultat est publié sur Alim'confiance pendant un an. L'audit interne est celui du réseau : il couvre aussi les standards de marque et sert à corriger avant le contrôle."
  - question: 'Peut-on faire un audit qualité sur téléphone ?'
    reponse: "Oui. Avec Hatch OS, Finch fait passer l'audit sur mobile avec photos, calcule le score sur 100, envoie le rapport PDF au franchisé sur WhatsApp et suit chaque action jusqu'à la preuve validée."
sources:
  - affirmation: "Alim'confiance : 4 niveaux d'hygiène et leurs définitions ; résultat visible un an après le contrôle"
    url: 'https://draaf.nouvelle-aquitaine.agriculture.gouv.fr/alim-confiance-les-resultats-des-controles-sanitaires-accessibles-a-tous-a913.html'
    luLe: '2026-11-10'
  - affirmation: "Formation hygiène : au moins une personne formée (14 h, arrêté du 12/02/2024, art. 2, qui a abrogé l'arrêté du 05/10/2011) par établissement de restauration commerciale, art. L233-4 du Code rural ; dispenses (3 ans d'expérience comme gérant ou exploitant, diplôme de la liste de l'arrêté du 18/11/2024) ; diplômes présents dans l'établissement ; règlement CE 852/2004"
    url: 'https://agriculture.gouv.fr/restauration-quelles-obligations-en-matiere-de-formation-a-lhygiene-des-aliments'
    luLe: '2026-11-10'
  - affirmation: "Températures maximales des denrées réfrigérées (+2 °C viandes hachées et produits de la pêche frais, +4 °C préparations de viandes et denrées très périssables, +8 °C denrées périssables) et liaison chaude à +63 °C minimum (annexe I) ; arrêté du 21/12/2009 en vigueur au 10/11/2026. Le refroidissement de +63 °C à +10 °C en moins de deux heures figure à l'annexe IV, propre à la restauration collective : il n'est pas cité comme règle de la restauration commerciale"
    url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021573483'
    luLe: '2026-11-10'
  - affirmation: 'Huile réputée impropre au-delà de 25 % de composés polaires (décret n° 2008-184, art. 8, en vigueur)'
    url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000018188420'
    luLe: '2026-11-10'
  - affirmation: 'Contrôles officiels sans avertissement préalable, sauf nécessité justifiée (règlement UE 2017/625, art. 9, § 4)'
    url: 'https://eur-lex.europa.eu/eli/reg/2017/625/oj'
    luLe: '2026-11-10'
  - affirmation: 'Hygiène du personnel (852/2004, annexe II) ; traçabilité (178/2002, art. 18) ; allergènes (1169/2011 art. 44, R412-14, 14 allergènes) ; PMS et analyses (852/2004, art. 5)'
    url: 'https://www.rhone.gouv.fr/contenu/telechargement/44911/249154/file/Note%20Reglementation%20Restauration%20rapide%20Mars2021.pdf'
    luLe: '2026-11-10'
  - affirmation: "Hatch OS : fonctions de Finch (grilles pondérées, audit mobile avec photos et historique, score sur 100, rapport PDF sur WhatsApp, plan d'action avec criticité validé par l'auditeur, preuves, auto-évaluation, tableau de bord) ; phrase sécurité"
    url: 'https://www.gethatch.io/agents/finch'
    luLe: '2026-11-10'
brouillon: false
---

## Partir de ce que contrôle l'administration

Les résultats des contrôles sanitaires officiels sont publics sur Alim'confiance. Chaque établissement contrôlé reçoit un niveau d'hygiène parmi quatre : très satisfaisant, satisfaisant, à améliorer, à corriger de manière urgente. Le dernier niveau correspond à des non-conformités qui peuvent mettre en danger la santé du consommateur, avec fermeture administrative, retrait ou suspension de l'agrément sanitaire. Le résultat reste visible un an après le contrôle.

Votre grille interne doit donc d'abord repérer ce qui ferait basculer un restaurant dans les deux derniers niveaux. Les standards de marque viennent ensuite.

## Les familles de points de contrôle

Une grille lisible regroupe ses points par famille. Voici une base pour la restauration rapide, avec le texte de référence quand il existe.

| Famille                     | Exemples de points vérifiables                                                                                                                                                                                                                                                                                                   | Référence                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Formation du personnel      | Au moins une personne de l'établissement justifie d'une formation à l'hygiène (14 h), d'un diplôme de la liste officielle ou de trois ans d'expérience comme gérant ou exploitant d'une entreprise alimentaire ; justificatif disponible sur place                                                                               | Art. L233-4 du Code rural ; règlement CE 852/2004                         |
| Hygiène du personnel        | Tenue propre, lave-mains équipé, pas de bijoux en cuisine                                                                                                                                                                                                                                                                        | Règlement CE 852/2004, annexe II                                          |
| Chaîne du froid et du chaud | Températures des enceintes relevées et notées ; maxima respectés (+2 °C pour les viandes hachées et le poisson frais, +4 °C pour les préparations de viandes et les denrées très périssables) ; plats chauds à +63 °C minimum ; refroidissement rapide des préparations, à la méthode fixée par votre plan de maîtrise sanitaire | Arrêté du 21 décembre 2009, annexe I                                      |
| Traçabilité                 | Étiquettes et bons de livraison gardés jusqu'à épuisement du produit ; préparations étiquetées                                                                                                                                                                                                                                   | Règlement CE 178/2002, art. 18 ; arrêté du 21 décembre 2009               |
| Huiles de friture           | Test fait et noté ; bain changé au-delà de 25 % de composés polaires                                                                                                                                                                                                                                                             | Décret n° 2008-184, art. 8                                                |
| Allergènes                  | Information écrite sur les 14 allergènes, visible ou disponible sur demande, à jour avec la carte                                                                                                                                                                                                                                | Règlement UE 1169/2011, art. 44 ; art. R412-14 du Code de la consommation |
| Plan de maîtrise sanitaire  | Plan disponible, procédures HACCP suivies, analyses microbiologiques à la fréquence fixée par l'exploitant                                                                                                                                                                                                                       | Règlement CE 852/2004, art. 5                                             |
| Standards de marque         | Recette conforme à la fiche, propreté de la salle, accueil                                                                                                                                                                                                                                                                       | Votre manuel opératoire                                                   |

Gardez la grille courte. Un point qu'aucun auditeur ne sait vérifier en moins d'une minute est à réécrire ou à supprimer.

## Pondérer par la gravité

Tous les écarts ne se valent pas. Un joint de porte de chambre froide abîmé n'a pas le même poids qu'une affiche mal placée. Classez chaque point dans un des trois niveaux :

- Critique : risque direct pour la santé du client (chaîne du froid rompue, huile hors limite, allergène non signalé).
- Majeure : écart qui rend un risque probable s'il dure (relevés de température manquants, préparation non étiquetée).
- Mineure : écart de standard sans risque sanitaire (affichage, présentation).

Un exemple de barème : 10 points par point critique, 5 par point majeur, 1 par point mineur. Ajoutez une règle bloquante : un écart critique entraîne une action le jour même et une contre-visite, même si le score global reste bon.

## Calculer le score sur 100

Le score est la part des points obtenus sur les points applicables, ramenée à 100. Un point sans objet (pas de friteuse, pas de livraison ce jour-là) sort du calcul au lieu de compter comme réussi.

Exemple fictif chez BunBun, l'enseigne de démonstration de Hatch OS. La grille compte 4 points critiques (40 points), 8 majeurs (40 points) et 20 mineurs (20 points), soit 100 points applicables. Le restaurant manque un point majeur et trois points mineurs : il obtient 92 sur 100. S'il manque aussi un point critique, il tombe à 82 et la règle bloquante déclenche une contre-visite. Sans pondération, l'écart critique aurait compté autant qu'une affiche mal placée.

## Écrire des points vérifiables

Deux auditeurs doivent noter un même restaurant de la même façon. Cela dépend surtout de la rédaction.

| Mal écrit              | Vérifiable                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Cuisine propre         | Plan de travail et sol de la zone de cuisson sans résidu à l'heure de l'audit                                                      |
| Bonne gestion du froid | Relevé de température de chaque enceinte noté à la fréquence prévue par votre plan de maîtrise sanitaire, sur les 7 derniers jours |
| Allergènes affichés    | Information sur les 14 allergènes présente pour chaque produit de la carte en cours                                                |
| Huile correcte         | Test d'huile du jour noté, résultat sous 25 % de composés polaires                                                                 |

Demandez une photo pour chaque écart. Elle évite les discussions au moment du rapport et devient le point de départ de la preuve de correction.

## Transformer chaque écart en action

Un audit qui s'arrête au rapport laisse le même écart revenir à la visite suivante. Chaque écart doit sortir de l'audit avec :

1. une action précise, formulée comme une tâche ;
2. un responsable désigné par le franchisé ;
3. un délai lié à la gravité, par exemple le jour même pour un critique, la semaine pour un majeur, la prochaine visite pour un mineur ;
4. une preuve attendue (photo, document, relevé) ;
5. une validation par l'auditeur, qui seule ferme l'action.

Adressez le plan d'action au franchisé : il reste le chef d'entreprise et l'employeur de son équipe, c'est lui qui répartit les tâches. Terminez la visite par ce qui fonctionne et par une ou deux priorités, sans dresser de liste de reproches.

> **Avec Hatch OS**
>
> [Finch, l'agent qualité et conformité](/agents/finch) de Hatch OS, reprend la grille actuelle du réseau et donne un poids à chaque point de contrôle. L'audit se fait sur mobile, avec photos et l'historique de chaque point (résultats, commentaires, statut des actions passées). Finch calcule un score sur 100 selon la pondération, envoie le rapport PDF au franchisé sur WhatsApp dès la fin de l'audit et propose un plan d'action avec un niveau de criticité par écart, que l'auditeur valide. Le franchisé dépose ses preuves (photo, document ou commentaire), et un tableau de bord réseau montre les points qui dérivent. Le restaurant peut aussi s'auto-évaluer entre deux visites.
>
> [Données hébergées en Europe, chiffrées en transit et au repos, cloisonnées par client.](/securite) Aucun modèle n'est entraîné sur vos données, c'est écrit au contrat.

## Fixer la fréquence

La fréquence se décide restaurant par restaurant, selon le risque. Trois règles simples :

- un rythme de base identique pour tout le réseau, connu des franchisés ;
- une contre-visite rapprochée après tout écart critique ;
- une auto-évaluation par le restaurant entre deux visites, sur une version courte de la grille.

Les contrôles officiels se font en principe sans avertissement préalable (règlement UE 2017/625, art. 9). Une partie de vos visites peut se faire sans annonce, pour voir le restaurant tel qu'il tourne. Écrivez le droit d'audit, son rythme et les visites inopinées dans le contrat ou le manuel, pour que le franchisé ne les découvre pas le jour de la visite.

## Mettre la grille à jour

Relisez la grille au moins une fois par an, et à chaque changement de carte, de matériel ou de réglementation. Regardez surtout les points qui échouent dans plusieurs restaurants : un écart répété partout signale [une fiche du manuel à revoir](/ressources/manuel-operatoire-franchise-restauration) ou [une formation à refaire](/ressources/former-equipiers-reseau-restauration), pas un franchisé négligent.
