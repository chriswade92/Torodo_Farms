export interface Product {
  id: string;
  name: string;
  description: string;
  image: any; // Image source
  sizes: ProductSize[];
}

export interface ProductSize {
  size: number; // in liters
  price: number; // in CFA
}

export const PRODUCTS: Product[] = [
  {
    id: 'milk',
    name: 'Lait Frais',
    description: 'Lait frais de vache, riche en calcium. Idéal pour toute la famille.',
    image: require('../assets/lait.png'), // Will be replaced with milk image
    sizes: [
      { size: 1, price: 1000 },
      { size: 10, price: 8000 },
    ],
  },
  {
    id: 'yoghurt',
    name: 'SOOW',
    description: 'SOOW nature crémeux fait à partir de lait frais. Riche en probiotiques.',
    image: require('../assets/sow.png'), // Will be replaced with yogurt image
    sizes: [
      { size: 1, price: 1000 },
      { size: 10, price: 8000 },
    ],
  },
]; 