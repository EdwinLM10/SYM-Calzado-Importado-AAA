
import React, { useState, useRef } from 'react';
import { Review } from '../types';

interface ReviewSectionProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
  onDeleteReview?: (id: string) => void;
  isAdmin: boolean;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, onAddReview, onDeleteReview, isAdmin }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ author: '', rating: 5, comment: '', image: '' });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author || !formData.comment) return;
    onAddReview(formData);
    setFormData({ author: '', rating: 5, comment: '', image: '' });
    setShowForm(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews" className="py-24 border-t border-zinc-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase">Testimonios Reales</h2>
          <p className="text-zinc-500 font-medium max-w-md">Descubre por qué nuestros clientes eligen SYM para fortalecer su estilo.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-3 mr-4">
            <button 
              onClick={() => scroll('left')}
              className="p-3 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 border border-zinc-800 rounded-full hover:bg-white hover:text-black transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-zinc-800 text-white px-8 py-3 rounded-sm hover:bg-zinc-700 transition-colors border border-zinc-700 font-black uppercase text-xs tracking-widest whitespace-nowrap shadow-xl"
          >
            {showForm ? "Cerrar" : "Compartir Experiencia"}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-700 p-8 rounded-xl mb-16 animate-fade-in shadow-2xl max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Tu Nombre</label>
                <input 
                  type="text" 
                  className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-3 focus:border-white outline-none"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Calificación</label>
                <select 
                  className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-3 focus:border-white outline-none cursor-pointer"
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                >
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Adjuntar Foto</label>
              <div className="flex flex-col gap-3">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                />
                {formData.image && (
                  <img src={formData.image} alt="Previa" className="w-24 h-24 object-cover rounded-sm border border-zinc-700 shadow-lg" />
                )}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Tu Opinión</label>
            <textarea 
              className="w-full bg-black border border-zinc-800 rounded-sm px-4 py-3 focus:border-white outline-none min-h-[120px]"
              value={formData.comment}
              onChange={e => setFormData({...formData, comment: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-sm hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs shadow-xl">
            Enviar Reseña con Foto
          </button>
        </form>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map(review => (
          <div 
            key={review.id} 
            className="flex-shrink-0 w-[280px] md:w-[380px] snap-start bg-zinc-950 rounded-lg border border-zinc-900 overflow-hidden flex flex-col group shadow-lg hover:border-zinc-700 transition-all"
          >
            {review.image && (
              <div className="h-56 w-full overflow-hidden relative">
                <img 
                  src={review.image} 
                  alt={`Foto de ${review.author}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            )}
            <div className="p-7 flex flex-col flex-grow relative">
              {isAdmin && (
                <button 
                  onClick={() => onDeleteReview?.(review.id)}
                  className="absolute top-4 right-4 p-2 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all z-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-black text-white text-xl tracking-tighter uppercase">{review.author}</h4>
                  <div className="flex text-yellow-500 text-sm mt-1">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                </div>
                <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">{review.date}</span>
              </div>
              <p className="text-zinc-400 font-medium italic text-sm leading-relaxed flex-grow">"{review.comment}"</p>
              <div className="mt-6 pt-5 border-t border-zinc-900 flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-white/40 animate-pulse"></div>
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">SYM Verified Purchase</span>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="w-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
            <p className="text-zinc-700 font-black uppercase tracking-[0.3em]">Cero testimonios aún</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewSection;
