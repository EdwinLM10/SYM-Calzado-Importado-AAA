
export enum Category {
  DAMA = 'Dama',
  CABALLERO = 'Caballero',
  NINO = 'Niño'
}

export enum SubCategory {
  CASUAL = 'Casual',
  DEPORTIVO = 'Deportivo',
  USO_DIARIO = 'Uso Diario'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  subCategory: SubCategory;
  sizes: string[];
  image: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface AppConfig {
  whatsapp: string;
  instagram: string;
  tiktok: string;
  facebook: string;
}
