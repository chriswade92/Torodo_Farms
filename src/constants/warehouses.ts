export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface Stock {
  productId: string;
  warehouseId: string;
  quantity: number;
  ordered: number;
  consumed: number;
  emptyBottles: number;
}

export const warehouses: Warehouse[] = [
  {
    id: 'A',
    name: 'Warehouse A',
    location: 'Main Facility'
  },
  {
    id: 'B',
    name: 'Warehouse B',
    location: 'Secondary Facility'
  }
]; 