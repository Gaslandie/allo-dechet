# Styles partagés

## Références — 30 octobre 2026

- Recorra : https://www.recorra.co.uk/ et sa feuille https://www.recorra.co.uk/assets/main-DaX3H-j2.css. Consultation renouvelée pour cette refonte. Les classes headline-1 à headline-6 définissent des niveaux réutilisables avec des paliers responsive ; Gotham, vert, jaune et crème restent la référence visuelle.
- GOV.UK, https://design-system.service.gov.uk/styles/typography/ : accès impossible par l’outil de recherche lors de cette consultation. Aucune observation ni règle de ce site n’a été retenue.

Adaptation : une seule famille de styles par niveau pour ALLÔ DÉCHETS. Suppression des exceptions propres aux sections, notamment les titres plus petits des actualités, des moyens et des références. Les boutons partagent également la même taille de texte. Le grand titre d’accueil, les montants et les chiffres conservent leur rôle distinct.

## Organisation

Les valeurs sont déclarées dans tokens.css et appliquées dans typography.css. Les feuilles de sections ne règlent plus la typographie. Les composants communs et les modèles HTML sont partagés entre les 13 pages. La génération échappe les titres issus du fichier de rubriques, vérifie les chemins et refuse les variables de modèle inconnues.

Les fichiers sont formatés avec Prettier. PostCSS analyse les feuilles pendant le contrôle pour détecter les erreurs de syntaxe et empêcher l’ajout de règles typographiques dispersées. Ces outils ne sont pas livrés au navigateur.

## Vérifications

Mesures des styles calculés dans Chrome, sans capture ni revue visuelle de la page :

| Largeur | Titres de section | Sous-titres | Paragraphes |
| --- | --- | --- | --- |
| 390 px | 30 / 38 px | 22 / 30 px | 14 / 22,4 px |
| 1366 px | 42 / 50 px | 24 / 32 px | 16 / 25,6 px |
| 1920 px | 48 / 60 px | 28 / 36 px | 16 / 25,6 px |

Chaque paire indique la taille et l’interligne. Tous les éléments d’un même niveau présentent les mêmes valeurs. Boutons : 16 px. Police Gotham chargée. Aucun débordement horizontal mesuré à 390 et 1920 px. Menu mobile : ouverture, focus contenu dans le dialogue et fermeture vérifiés ; tarifs établissements puis ménages vérifiés. Génération et contrôles des 13 pages réussis. La validation visuelle finale reste à Gassama.

## Répartition de la navigation — 30 octobre 2026

Référence : capture Recorra fournie dans la conversation. Logo à gauche, rubriques centrales, actions à droite. La navigation partagée utilise maintenant trois colonnes, avec deux colonnes latérales égales pour centrer les liens dans la largeur disponible. Mesures à 1400 et 1920 px : aucun chevauchement, centre aligné sur le contenu hors barre de défilement. À 390 px : rubriques et actions de bureau masquées, bouton Menu visible, aucun débordement. Le modèle partagé applique la correction aux 13 pages.

## Cartes provisoires — 30 octobre 2026

Référence Google : https://support.google.com/maps/answer/7101463?hl=fr, partage et intégration de cartes. Les 12 recherches par commune + Guinée ont renvoyé une carte intégrée. L’URL testée par HEAD sur www.google.com donnait 404 ; les requêtes GET sur maps.google.com ont renvoyé les cartes. Google utilise Lambanyi et Manéah pour les noms Lambangni et Maneyah fournis par le client. Les noms du document sont conservés, les correspondances restent à valider.

La carte suit le choix de commune ; le cadre affiche une localisation indicative et ne dessine aucune zone de desserte. Lien de secours vers Google Maps dans un nouvel onglet, avec noopener/noreferrer. Aucune clé personnelle, aucun paiement API ni accès à la géolocalisation. L’intégration charge un contenu Google tiers. Seul frame-src est ajouté pour maps.google.com et www.google.com ; scripts, connexions et formulaires de la page gardent leurs restrictions. Liste de communes autorisées et URLSearchParams évitent l’injection d’URL. Les 12 mises à jour de titre et d’URL ont été contrôlées dans Chrome, sans validation visuelle des emplacements.
