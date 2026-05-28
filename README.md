# Palindrome — Vérificateur pas-à-pas

Application React pour tester si un mot est un palindrome, avec visualisation de l'algorithme étape par étape.

## Lancement rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- npm (inclus avec Node.js)

### Installation

```bash
# 1. Aller dans le dossier du projet
cd palindrome-app

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement
npm run dev
```

Ouvre ensuite http://localhost:5173 dans ton navigateur.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile pour la production (dossier `dist/`) |
| `npm run preview` | Prévisualise le build de production |

## Structure des fichiers

```
palindrome-app/
├── index.html              # Point d'entrée HTML
├── vite.config.js          # Configuration Vite
├── package.json
└── src/
    ├── main.jsx            # Point d'entrée React
    ├── index.css           # Styles globaux
    ├── App.jsx             # Composant principal
    ├── App.module.css      # Styles du composant App
    ├── CharBox.jsx         # Composant d'un caractère
    ├── CharBox.module.css  # Styles des caractères
    └── usePalindrome.js    # Hook — logique de l'algorithme
```

## Algorithme

L'algorithme utilise deux pointeurs (gauche et droite) :

1. Comparer les caractères aux extrémités
2. Si égaux → avancer les pointeurs vers le centre
3. Si différents → arrêt, pas un palindrome
4. Condition d'arrêt : pointeurs qui se croisent ou se rejoignent → palindrome

## Fonctionnalités

- ✅ Saisie libre avec validation à l'appui d'Entrée
- ✅ Navigation étape par étape
- ✅ Lecture automatique (▶ Auto / ⏸ Pause)
- ✅ Visualisation colorée des caractères
- ✅ Journal détaillé de chaque étape
- ✅ Historique des mots testés (cliquable)
