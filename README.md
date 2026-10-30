# ALLÔ DÉCHETS

Maquette locale de la page d’accueil. Les autres rubriques affichent une page en construction.

## Démarrer

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5180/. Le serveur expose uniquement `public` sur la machine locale.

## Modifier le site

| Fichier | Rôle |
| --- | --- |
| `src/pages/home.html` | Contenu de l’accueil |
| `src/pages/construction.html` | Modèle des pages en construction |
| `src/pages.json` | Routes et titres des rubriques |
| `src/partials/` | En-tête HTML, navigation, pied de page et menu mobile partagés |
| `public/tokens.css` | Couleurs, tailles de texte, espacements et arrondis |
| `public/typography.css` | Police Gotham et hiérarchie typographique commune |
| `public/components.css` | Réglages communs des boutons, logos et en-têtes de section |
| `public/styles.css` | Structure et disposition des sections |
| `public/services.css` | Cartes et défilement horizontal des services |
| `public/mobile-menu.css` | Panneau de navigation compact |
| `public/motion.css` | Images et animations |
| `public/construction.css` | Disposition des pages en construction |
| `public/app.js` | Interactions propres à l’accueil |
| `public/navigation.js` | Comportement du menu partagé |

Après une modification des modèles ou des rubriques :

```sh
npm run format
npm run build
npm run check
```

Les fichiers HTML dans `public` sont générés. Modifier leurs sources dans `src`, puis relancer la génération. Les CSS, scripts et images dans `public` sont les fichiers sources directement servis.

## Réutiliser les styles

Les éléments `h1`, `h2`, `h3` et `p` reçoivent automatiquement le style commun. Les classes `title-page`, `title-section`, `title-card`, `text-body` et `text-caption` permettent de réutiliser ces styles sans changer le niveau sémantique d’un élément. `eyebrow` sert aux petits libellés placés avant les titres.

Les chiffres de moyens et les montants possèdent des styles explicites distincts. Ne pas ajouter de taille de police dans une feuille de section : ajuster les variables de `tokens.css` ou les catégories de `typography.css`. Le contrôle des styles détecte les redéfinitions dispersées.

Pour une rubrique en construction, ajouter sa route et son titre dans `src/pages.json`. Pour une future page complète, ajouter un modèle dans `src/pages` et le déclarer dans `scripts/build.mjs`. Les éléments communs sont insérés au moment de la génération : aucune requête supplémentaire ni JavaScript nécessaire pour afficher la navigation.

## Contenus et limites

Source : `ALLO_DECHETS_maquette_accueil_contenus.md`. Ne pas modifier les faits fournis ni présenter les services V2 comme actifs. Les photos et le logo sont temporaires. Les tarifs, zones ouvertes et contenus manquants restent à valider.

Aucun formulaire, paiement, compte ni stockage de données. Les pages interdisent les connexions directes et l’envoi de formulaires. Une exception limitée aux cadres Google Maps permet les cartes provisoires ; elles chargent un contenu tiers Google. Les scripts de génération ne sont pas servis au navigateur. Les dépendances npm servent uniquement à la préparation et aux contrôles, pas à l’exécution du site.

Gotham est utilisée pour la démonstration locale ; la licence web finale reste à confirmer avant publication. Licence des icônes : `public/icons/LICENSE-lucide`.

Les comparaisons et vérifications de cette refonte sont décrites dans `docs/styles.md`. Les notes des premières itérations sont archivées dans `docs/historique-maquette.md`.

## GitHub Pages

Le workflow `.github/workflows/pages.yml` construit et publie `dist` à chaque envoi sur `main`. Les chemins sont adaptés au préfixe `/allo-dechet/` sans modifier l’aperçu local.

```sh
npm run build:pages
```

Adresse de publication : https://gaslandie.github.io/allo-dechet/

Le document client de référence et l’historique local de réalisation sont exclus du dépôt public. Seuls les fichiers du site et sa documentation technique y sont envoyés. La publication conserve les mentions de maquette et la directive `noindex`.
