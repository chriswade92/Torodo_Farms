export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  size: string;
  image: any;
  rating?: number;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export const categories: Category[] = [
  { id: 'milk', name: 'Lait Frais', icon: '🥛' },
  { id: 'yoghurt', name: 'Soow Piir', icon: '🥄' },
];

export const products: Product[] = [
  {
    id: 'milk-1l',
    name: 'Lait Frais',
    description: 'Lait frais pur, directement de notre ferme laitière à votre porte. Riche en nutriments et parfait pour vos besoins quotidiens.',
    price: 1000,
    size: '1L',
    image: require('../assets/images/milk1.jpg'),
    rating: 4.8,
    category: 'milk'
  },
  {
    id: 'milk-10l',
    name: 'Lait Frais',
    description: 'Lait frais pur en grand format. Parfait pour les familles ou les entreprises. Directement de notre ferme laitière à votre porte.',
    price: 8000,
    size: '10L',
    image: require('../assets/images/milk10.jpg'),
    rating: 4.9,
    category: 'milk'
  },
  {
    id: 'soow-1l',
    name: 'Soow Piir',
    description: 'Yaourt traditionnel sénégalais (Soow) fait à partir de lait frais. Riche, crémeux et parfait pour toute la journée.',
    price: 1000,
    size: '1L',
    image: require('../assets/images/soow1.jpg'),
    rating: 4.9,
    category: 'yoghurt'
  },
  {
    id: 'soow-10l',
    name: 'Soow Piir',
    description: 'Yaourt traditionnel sénégalais (Soow) en grand format. Parfait pour les familles ou les événements. Fait à partir de lait frais, riche et crémeux.',
    price: 8000,
    size: '10L',
    image: require('../assets/images/soow10.jpg'),
    rating: 4.8,
    category: 'yoghurt'
  }
]; 