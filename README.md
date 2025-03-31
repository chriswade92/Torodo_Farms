# TorodoFarms - Application de Suivi des Ventes de Lait

Une application mobile développée avec React Native pour gérer les ventes de produits laitiers de TorodoFarms.

## 📱 Fonctionnalités

- **Gestion des Produits**
  - Lait frais (1L et 10L)
  - Yaourt nature (1L et 10L)
  - Prix en CFA
  - Images des produits

- **Panier d'Achat**
  - Ajout/suppression de produits
  - Modification des quantités
  - Calcul automatique du total
  - Confirmation des commandes

- **Historique des Ventes**
  - Suivi des commandes
  - Détails des transactions
  - Date et heure des ventes
  - Montants totaux

- **Interface Utilisateur**
  - Design moderne et intuitif
  - Navigation par onglets
  - Recherche de produits
  - Interface en français

## 🚀 Installation

1. Cloner le repository :
```bash
git clone https://github.com/chriswade92/Torodo_Farms.git
cd Torodo_Farms
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npx react-native run-android  # Pour Android
```

## 💻 Technologies Utilisées

- React Native
- TypeScript
- Context API pour la gestion d'état
- Animations React Native
- Système de navigation par onglets

## 📂 Structure du Projet

```
src/
├── assets/         # Images et ressources
├── components/     # Composants réutilisables
├── contexts/       # Context providers
├── screens/        # Écrans principaux
└── constants/      # Constants et configurations
```

## 🛠️ Composants Principaux

- `HomeScreen` : Affichage et recherche des produits
- `CartScreen` : Gestion du panier d'achat
- `SalesHistoryScreen` : Historique des ventes
- `ProductCard` : Carte de produit avec options d'achat

## 🔄 Gestion d'État

- `CartContext` : Gestion du panier
- `SalesContext` : Suivi des ventes

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Copyright © 2024 TorodoFarms. Tous droits réservés.
