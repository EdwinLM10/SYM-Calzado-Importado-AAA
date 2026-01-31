
import React, { useState } from 'react';
import { Product, Category, SubCategory } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
  isAdmin: boolean;
  whatsappNumber: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete, onEdit, isAdmin, whatsappNumber }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `¡Hola SYM! 👋 Estoy interesado en el modelo: ${product.name}\n` +
      `Categoría: ${product.category}\n` +
      `Tipo: ${product.subCategory}\n` +
      `Precio: ${formatPrice(product.price)}\n\n` +
      `¿Tienen disponibilidad en tallas: ${product.sizes.join(', ')}?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all hover:border-zinc-500 flex flex-col h-full shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-zinc-800">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <span className="px-2 py-1 bg-black/90 text-[8px] font-black uppercase tracking-widest rounded-sm border border-white/20">
            {product.category}
          </span>
          <span className="px-2 py-1 bg-zinc-800/90 text-[8px] font-black uppercase tracking-widest rounded-sm border border-white/10">
            {product.subCategory}
          </span>
        </div>
        
        {isAdmin && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
            <button 
              onClick={() => onDelete?.(product.id)}
              className="p-2 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-xl"
              title="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              onClick={() => onEdit?.(product)}
              className="p-2 bg-white text-black rounded-full hover:bg-zinc-200 transition-colors shadow-xl"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-black text-white mb-1 group-hover:text-zinc-300 transition-colors leading-tight uppercase tracking-tighter">
            {product.name}
          </h3>
          <p className="text-zinc-500 text-xs font-medium mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="mb-6">
          <p className="text-[10px] text-zinc-600 font-black mb-2 uppercase tracking-widest">Tallas disponibles</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes?.map(size => (
              <span key={size} className="px-2.5 py-1 bg-zinc-800 text-white text-[10px] font-bold border border-zinc-700 rounded-sm">
                {size}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-5 border-t border-zinc-800 flex items-center justify-between gap-4">
          <span className="text-2xl font-black text-white tracking-tighter">
            {formatPrice(product.price)}
          </span>
          <button 
            onClick={handleWhatsAppClick}
            className="bg-white text-black px-6 py-2.5 rounded-sm font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all"
          >
            Pedir
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.327-5.594l.001-.002zm-5.607 11.048c-1.185 0-2.34-.32-3.345-.927l-.24-.145-2.487.652.665-2.417-.159-.252a6.591 6.591 0 0 1-1.012-3.46c0-3.635 2.965-6.599 6.602-6.599 1.761 0 3.416.685 4.662 1.932 1.246 1.247 1.932 2.902 1.932 4.663 0 3.636-2.965 6.601-6.602 6.601zm3.608-4.891c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
