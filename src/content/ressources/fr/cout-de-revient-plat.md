---
title: "Le prix d'un plat se calcule à partir de sa fiche technique"
seoTitle: "Coût de revient d'un plat et prix de vente"
description: "Calculez le coût de revient d'un plat avec une fiche technique, un exemple chiffré pas à pas, puis fixez son prix de vente avec le bon coefficient."
kicker: 'Guide'
chapeau: "Pour fixer le prix d'un plat, on calcule le coût des ingrédients d'une portion sur une fiche technique, puis on le multiplie par un coefficient tiré du ratio matière visé. Sans ce calcul, un plat vendu trop peu cher perd de l'argent à chaque assiette, et personne ne le voit. Voici la méthode, avec un exemple complet."
essentiel:
  - "Le coût de revient d'un plat, c'est le coût des ingrédients d'une portion, pesés net, au prix d'achat HT."
  - 'Le prix de vente HT se calcule en multipliant ce coût par un coefficient, puis on ajoute la TVA (10 % pour un plat servi sur place).'
  - "Une fiche technique se met à jour dès qu'un prix d'achat bouge : sinon, la marge baisse sans prévenir."
public: independant
metier: 'Achats et gestion'
readingMinutes: 7
updatedAt: '2026-11-10'
image: '../../../assets/ressources/cout-de-revient-plat.jpg'
imageAlt: "Diorama en voxels d'une cuisine de restaurant où l'on pèse les ingrédients d'un plat."
faq:
  - question: 'Quelle est la différence entre coût de revient et coût matière ?'
    reponse: "En restauration, on emploie souvent les deux pour la même chose : le coût des ingrédients d'une portion. Au sens strict, un coût de revient complet ajouterait la main-d'œuvre et les frais fixes, mais on les couvre plutôt avec la marge globale que plat par plat."
  - question: 'Faut-il calculer le coût avec les prix HT ou TTC ?'
    reponse: 'Avec les prix HT. Si votre restaurant est soumis à la TVA (le cas général), la TVA payée sur vos achats est récupérable, elle ne fait pas partie du coût. On applique ensuite le coefficient au coût HT, puis la TVA de vente.'
  - question: 'Quel coefficient multiplicateur appliquer ?'
    reponse: 'Il découle du ratio matière que vous visez : coefficient = 1 ÷ ratio. Une cible de 25 % donne un coefficient de 4, une cible de 30 % un coefficient de 3,33. Votre cible dépend de vos autres charges.'
  - question: "Comment calculer le rendement d'un produit ?"
    reponse: 'Pesez le produit brut, préparez-le, puis pesez ce qui part en cuisine. Rendement = poids utilisable ÷ poids brut. Faites-le sur deux ou trois livraisons et gardez la moyenne.'
  - question: 'À quelle fréquence mettre à jour les fiches techniques ?'
    reponse: "Dès qu'un prix d'achat change de façon notable, et au moins à chaque changement de carte. Commencez par les plats les plus vendus : ce sont eux qui pèsent le plus sur votre marge."
sources:
  - affirmation: "Le coefficient multiplicateur est l'inverse du ratio matière (25 % → 4 ; 20 % → 5 ; 30 % → 3,33 ; 33 % → 3, arrondi) ; coût matière HT × coefficient = prix de vente, puis TVA (article du 03/04/2025)"
    url: 'https://www.lhotellerie-restauration.fr/sos-experts/fixation-des-prix-en-restauration-coefficients-et-marges-38467'
    luLe: '2026-11-10'
  - affirmation: 'Repère de ratio matière : 25 % à 35 % (presse professionnelle, fiche de Jean-Claude Oulé du 12/09/2019)'
    url: 'https://www.lhotellerie-restauration.fr/actualite/fiche-pratique-les-ratios-et-indicateurs-de-gestion-en-chr'
    luLe: '2026-11-10'
  - affirmation: "Repère de ratio matière : généralement 25 % à 35 % (cabinet d'expertise comptable Keobiz)"
    url: 'https://www.keobiz.fr/fiches-pratiques/food-cost-beverage-cost-marges/'
    luLe: '2026-11-10'
  - affirmation: 'TVA à 10 % sur les plats servis en restauration ; boissons alcoolisées à 20 % (fiche vérifiée le 03/12/2025)'
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F22399'
    luLe: '2026-11-10'
  - affirmation: 'Menu forfaitaire avec alcool : ventilation du prix entre taux normal et taux réduit ; méthode admise au prorata des prix à la carte (BOI-TVA-LIQ-30-20-10-20, § 70 et 80, version en vigueur depuis le 07/08/2024)'
    url: 'https://bofip.impots.gouv.fr/bofip/256-PGP.html/identifiant=BOI-TVA-LIQ-30-20-10-20-20240807'
    luLe: '2026-11-10'
  - affirmation: "Restauration traditionnelle (NAF 56.10A), exercice 2025, 28 784 entreprises : marge brute 69,29 % du CA, charges de personnel 37,33 % du CA (Ordre des experts-comptables, Baromètre Image PME, base Statexpert ; document publié par l'UMIH). Les « autour de 31 % » d'achats consommés sont déduits : 100 − 69,3"
    url: 'https://www.umih.fr/assets/files/site/ressources/observatoires-et-etudes/260823_Observatoire_2025_5610A_Restauration_traditionnelle.pdf'
    luLe: '2026-11-10'
  - affirmation: "Robin : associé IA des restaurateurs indépendants, en bêta sur WhatsApp avec liste d'attente ; quand un prix d'achat bouge, il recalcule le coût des plats et prévient si une marge passe sous le seuil ; il propose, vous décidez"
    url: 'https://www.gethatch.io/robin'
    luLe: '2026-11-10'
brouillon: false
---

## Coût matière, coût de revient : de quoi parle-t-on ?

En restauration, « coût de revient d'un plat » désigne le plus souvent le coût matière d'une portion : ce que vous avez payé pour les ingrédients qui finissent dans l'assiette. Les salaires, le loyer et l'énergie ne sont pas répartis plat par plat. Ils sont couverts par la marge que chaque plat dégage.

Ce chiffre se calcule sur une fiche technique. Une fiche par plat, avec la liste des ingrédients, leur grammage par portion, leur prix d'achat et la méthode. Elle sert aussi en cuisine : tout le monde dresse la même portion.

## Étape 1. Lister les ingrédients au grammage réel

Notez chaque ingrédient avec le poids qui part réellement dans l'assiette, pour une portion. Pesez une fois en service, pas de mémoire. N'oubliez pas les garnitures, la sauce, le pain s'il est compté avec le plat.

Pour les petits ingrédients (huile, sel, poivre, herbes), deux options : les peser une fois sur une recette de dix portions et diviser, ou prévoir un petit forfait « assaisonnement » par portion. Choisissez une règle et tenez-la sur toutes vos fiches.

## Étape 2. Prendre le bon prix d'achat

Le bon prix est [le prix HT de votre dernière facture](/ressources/controle-factures-fournisseurs-restaurant), remises déduites. Si votre restaurant est soumis à la TVA, ce qui est le cas général, la TVA que vous payez à l'achat est récupérable : elle ne fait pas partie du coût.

Ensuite, ramenez ce prix au kilo utilisable. Un produit brut perd du poids : parage d'une viande, épluchage d'un légume, arêtes d'un poisson. C'est le rendement. Pesez avant et après préparation, sur deux ou trois livraisons, puis faites la moyenne.

Le calcul : prix au kilo utile = prix d'achat au kilo ÷ rendement. Un bœuf acheté 16,50 € HT le kilo avec un rendement de 85 % revient à 16,50 ÷ 0,85 = 19,41 € le kilo réellement servi.

## Étape 3. Additionner : l'exemple du tartare

Voici une fiche technique complète. Les prix sont un exemple, remplacez-les par ceux de vos factures.

| Ingrédient (1 portion)                        | Grammage net | Prix d'achat HT | Rendement | Prix au kg utile | Coût portion |
| --------------------------------------------- | ------------ | --------------- | --------- | ---------------- | ------------ |
| Bœuf (rumsteck)                               | 160 g        | 16,50 €/kg      | 85 %      | 19,41 €          | 3,11 €       |
| Jaune d'œuf                                   | 1 pièce      | 0,25 € pièce    | 100 %     | sans objet       | 0,25 €       |
| Échalote                                      | 20 g         | 3,00 €/kg       | 90 %      | 3,33 €           | 0,07 €       |
| Câpres et cornichons                          | 20 g         | 8,00 €/kg       | 100 %     | 8,00 €           | 0,16 €       |
| Frites surgelées                              | 200 g        | 2,20 €/kg       | 100 %     | 2,20 €           | 0,44 €       |
| Salade                                        | 40 g         | 6,00 €/kg       | 100 %     | 6,00 €           | 0,24 €       |
| Assaisonnement (moutarde, huile, sel, poivre) | forfait      |                 |           |                  | 0,20 €       |
| **Coût de revient de la portion**             |              |                 |           |                  | **4,47 €**   |

## Du coût au prix de vente : le coefficient

Le coefficient multiplicateur est l'inverse du [ratio matière](/ressources/ratio-matiere-restaurant) que vous visez. Si vous voulez que les ingrédients pèsent 25 % du prix HT, le coefficient est 4. À 20 %, il est de 5.

| Ratio matière visé | Coefficient sur le coût HT |
| ------------------ | -------------------------- |
| 20 %               | 5                          |
| 25 %               | 4                          |
| 28 %               | 3,57                       |
| 30 %               | 3,33                       |
| 33,3 % (un tiers)  | 3                          |

Pour situer votre cible : dans les comptes 2025 de 28 784 restaurants traditionnels analysés par l'Ordre des experts-comptables, la marge brute est en moyenne de 69,3 % du chiffre d'affaires et les charges de personnel 37,3 %. Les achats consommés, nourriture et boissons ensemble, pèsent donc autour de 31 %. La presse professionnelle donne pour la matière un repère de 25 % à 35 %. C'est un ordre de grandeur : votre loyer et votre masse salariale fixent votre propre cible.

Pour le tartare, avec une cible de 28 % :

1. Prix HT = 4,47 € × 3,57 = 15,96 € HT.
2. Prix TTC = 15,96 € × 1,10 = 17,56 € (TVA à 10 % pour un plat servi sur place).
3. Arrondi à la carte : 17,50 € TTC, soit 15,91 € HT.
4. Ratio réel : 4,47 ÷ 15,91 = 28,1 %. Marge brute : 15,91 − 4,47 = 11,44 € HT par assiette.

Attention aux menus avec une boisson alcoolisée : l'alcool est taxé à 20 %, il faut ventiler le prix du menu entre les deux taux. Si les éléments du menu sont aussi vendus à la carte, l'administration admet de faire cette répartition au prorata des prix à la carte.

## Vérifier le prix face au marché

Le coefficient donne un prix de départ, pas le prix final. Comparez avec les cartes de votre quartier et avec ce que vos clients acceptent de payer pour ce plat. Si le prix calculé est trop haut, jouez sur la recette (grammage, garniture, morceau moins cher) plutôt que sur le coefficient de ce seul plat. Si un plat très vendu dégage une petite marge, compensez sur un autre plat de la carte.

## Mettre la fiche à jour quand un prix bouge

Une fiche technique vieillit vite. Reprenez l'exemple : si le bœuf passe de 16,50 € à 18,50 € HT le kilo, la portion coûte 3,48 € au lieu de 3,11 €. Le coût du plat monte à 4,84 €. À 17,50 € TTC, le ratio passe de 28,1 % à 30,4 %, sans que la carte ait changé.

Trois réflexes :

- relisez les prix de vos dix plats les plus vendus à chaque nouvelle mercuriale ou hausse de tarif ;
- refaites la pesée des rendements quand vous changez de fournisseur ou de morceau ;
- datez chaque fiche, pour savoir de quand date le dernier calcul.

> **Avec Robin**
>
> [Robin](/robin) est l'associé IA de Hatch OS pour les restaurateurs indépendants. Il est en bêta sur WhatsApp, avec une liste d'attente. Quand un prix d'achat bouge, il recalcule le coût de vos plats et vous prévient si une marge passe sous votre seuil. Il vous propose des pistes, et c'est vous qui décidez.
