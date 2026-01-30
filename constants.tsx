
import { Category, SubCategory, Product, Review } from './types';

export const WHATSAPP_NUMBER = "573006608830";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Runner Pro X',
    price: 185000,
    category: Category.CABALLERO,
    subCategory: SubCategory.DEPORTIVO,
    sizes: ['38', '39', '40', '41', '42'],
    image: 'https://picsum.photos/seed/runner/600/600',
    description: 'Tenis de alto rendimiento para running urbano.'
  },
  {
    id: '2',
    name: 'Casual Street White',
    price: 145000,
    category: Category.DAMA,
    subCategory: SubCategory.CASUAL,
    sizes: ['35', '36', '37', '38'],
    image: 'https://picsum.photos/seed/casual/600/600',
    description: 'Estilo minimalista para el día a día.'
  },
  {
    id: '3',
    name: 'Kids Play Active',
    price: 95000,
    category: Category.NINO,
    subCategory: SubCategory.DEPORTIVO,
    sizes: ['28', '30', '32'],
    image: 'https://picsum.photos/seed/kids/600/600',
    description: 'Resistencia y comodidad para los más pequeños.'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Juan Perez',
    rating: 5,
    comment: 'Excelente calidad y el envío fue muy rápido a Medellín.',
    date: '2024-05-10',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'r2',
    author: 'Maria Gomez',
    rating: 4,
    comment: 'Muy lindos los tenis, la talla me quedó perfecta.',
    date: '2024-05-12',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 'r3',
    author: 'Carlos Ruiz',
    rating: 5,
    comment: 'Recomendados al 100%, súper cómodos para el gym.',
    date: '2024-05-15',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400'
  }
];
