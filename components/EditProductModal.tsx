
import React, { useState } from 'react';
import { Product, Category, SubCategory } from '../types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [sizesString, setSizesString] = useState(product.sizes.join(', '));

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
    const sizesArray = sizesString.split(',').map(s => s.trim()).filter(s => s !== '');
    onSave({
      ...formData,
      sizes: sizesArray
    });
    alert('Información actualizada correctamente');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg max-w-4xl w-full shadow-2xl my-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-10">
          <h2 className="text-white text-3xl font-black uppercase tracking-tighter">Editar Modelo: <span className="text-zinc-500">{product.name}</span></h2>
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest font-black">Actualiza los detalles del calzado en el catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Nombre del Modelo</label>
              <input 
                type="text" 
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none transition-all"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Precio (COP)</label>
              <input 
                type="number" 
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none transition-all"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Segmento</label>
                <select 
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none transition-all cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as Category})}
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Uso</label>
                <select 
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none transition-all cursor-pointer"
                  value={formData.subCategory}
                  onChange={e => setFormData({...formData, subCategory: e.target.value as SubCategory})}
                >
                  {Object.values(SubCategory).map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Tallas (Separadas por coma)</label>
              <input 
                type="text" 
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none transition-all"
                value={sizesString}
                onChange={e => setSizesString(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Imagen Actual / Nueva</label>
              <div className="flex flex-col gap-4">
                <div className="w-full aspect-square bg-black border border-zinc-800 rounded overflow-hidden">
                  <img src={formData.image} alt="Previsualización" className="w-full h-full object-cover" />
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Descripción</label>
              <textarea 
                className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none min-h-[100px] transition-all"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 border border-zinc-700 text-zinc-500 font-black py-4 rounded uppercase tracking-widest hover:text-white hover:border-white transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-white text-black font-black py-4 rounded uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
