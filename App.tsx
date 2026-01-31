import { saveProduct } from "./services/products";
import { collection, onSnapshot, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import AdminPanel from './components/AdminPanel';
import ReviewSection from './components/ReviewSection';
import EditProductModal from './components/EditProductModal';
import { Category, SubCategory, Product, Review, AppConfig } from './types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, WHATSAPP_NUMBER } from './constants';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'
];

// Canal de comunicación para sincronizar pestañas en el mismo navegador
const syncChannel = new BroadcastChannel('sym_sync_channel');

const App: React.FC = () => {
const [products, setProducts] = useState<Product[]>([]);

  
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sym_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('sym_config');
    return saved ? JSON.parse(saved) : {
      whatsapp: WHATSAPP_NUMBER,
      instagram: 'https://instagram.com',
      tiktok: 'https://tiktok.com',
      facebook: 'https://facebook.com'
    };
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [filterSubCategory, setFilterSubCategory] = useState<SubCategory | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Escuchar cambios desde otras pestañas
  useEffect(() => {
    const handleSync = (event: MessageEvent) => {
      const { type, data } = event.data;
      if (type === 'SYNC_REVIEWS') setReviews(data);
      if (type === 'SYNC_CONFIG') setConfig(data);
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, []);

  useEffect(() => {
    localStorage.setItem('sym_reviews', JSON.stringify(reviews));
    syncChannel.postMessage({ type: 'SYNC_REVIEWS', data: reviews });
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sym_config', JSON.stringify(config));
    syncChannel.postMessage({ type: 'SYNC_CONFIG', data: config });
  }, [config]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
    const productosFirestore: Product[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));

    setProducts(productosFirestore);
  });

  return () => unsubscribe();
}, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const categoryMatch = filterCategory === 'Todos' || p.category === filterCategory;
      const subMatch = filterSubCategory === 'Todos' || p.subCategory === filterSubCategory;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && subMatch && searchMatch;
    });
  }, [products, filterCategory, filterSubCategory, searchQuery]);

 const addProduct = async (newProduct: Omit<Product, 'id'>) => {
  await saveProduct(newProduct);
};

  const deleteProduct = (id: string) => {
    if (confirm('¿Eliminar este modelo del catálogo permanentemente?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
  };

  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [review, ...prev]);
  };

  const deleteReview = (id: string) => {
    if (confirm('¿Eliminar esta reseña?')) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleAdminToggle = () => {
    if (!isAdmin) {
      setShowLoginModal(true);
      setPinInput('');
      setLoginError(false);
    } else {
      setIsAdmin(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "2003") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPinInput('');
    } else {
      setLoginError(true);
      setPinInput('');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  // Función para importar datos completos (Nube manual)
  const handleImportData = (allData: any) => {
  // ❌ NO tocar productos aquí
  if (allData.reviews) setReviews(allData.reviews);
  if (allData.config) setConfig(allData.config);
};

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans selection:bg-white selection:text-black">
      <Header 
        isAdmin={isAdmin} 
        onAdminToggle={handleAdminToggle} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center mb-8">
              <div className="bg-white text-black inline-block px-3 py-1 font-black text-xl mb-4">SYM</div>
              <h2 className="text-white text-lg font-black uppercase tracking-widest">Acceso Administrativo</h2>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input 
                autoFocus type="password" 
                className={`w-full bg-black border ${loginError ? 'border-red-500 animate-shake' : 'border-zinc-800'} rounded-sm px-4 py-3 text-center text-white tracking-[1em] outline-none transition-all`}
                placeholder="••••" value={pinInput}
                onChange={e => { setPinInput(e.target.value); setLoginError(false); }}
              />
              <button type="submit" className="w-full bg-white text-black font-black py-4 rounded-sm uppercase tracking-[0.2em] text-xs hover:bg-zinc-200 transition-all">
                Ingresar
              </button>
            </form>
          </div>
        </div>
      )}

      {editingProduct && (
        <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={updateProduct} />
      )}

      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="relative h-[75vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {HERO_IMAGES.map((img, idx) => (
              <div key={img} className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out transform ${idx === currentHeroIndex ? 'opacity-50 scale-100' : 'opacity-0 scale-110'}`}>
                <img src={img} className="w-full h-full object-cover grayscale-[30%]" alt="Hero" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-1 bg-gradient-to-b from-black via-transparent to-black"></div>
          <div className="relative z-10 text-center px-6 max-w-6xl animate-fade-in">
            <h1 className="text-7xl md:text-[14rem] font-black text-white mb-6 tracking-tighter leading-[0.8] drop-shadow-2xl uppercase select-none">
              ESTILO <br /> <span className="text-zinc-600">SIN</span> LÍMITES
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          {/* Filters Bar */}
          <section id="catalog" className="mb-20 flex flex-col md:flex-row gap-8 items-center justify-between border-b border-zinc-900 pb-12">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button onClick={() => setFilterCategory('Todos')} className={`px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterCategory === 'Todos' ? 'bg-white text-black border-white shadow-2xl' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500'}`}>Todos</button>
              {Object.values(Category).map(cat => (
                <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-10 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${filterCategory === cat ? 'bg-white text-black border-white shadow-2xl' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-500'}`}>{cat}</button>
              ))}
            </div>
            <select className="bg-zinc-950 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] border border-zinc-900 rounded-sm appearance-none focus:outline-none" value={filterSubCategory} onChange={e => setFilterSubCategory(e.target.value as any)}>
              <option value="Todos">TIPO DE USO</option>
              {Object.values(SubCategory).map(sc => <option key={sc} value={sc}>{sc.toUpperCase()}</option>)}
            </select>
          </section>

          {isAdmin && (
            <AdminPanel 
              onAddProduct={addProduct} 
              config={config} 
              onUpdateConfig={setConfig}
              onImportAll={handleImportData}
              allData={{ products, reviews, config }}
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20 mb-32">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} isAdmin={isAdmin} onDelete={deleteProduct} onEdit={handleEditProduct} whatsappNumber={config.whatsapp} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-600 font-black uppercase tracking-[0.3em]">No se encontraron modelos</p>
            </div>
          )}

          <ReviewSection reviews={reviews} onAddReview={addReview} onDeleteReview={deleteReview} isAdmin={isAdmin} />
        </div>
      </main>

      <footer className="bg-zinc-950 border-t border-zinc-900 py-32">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
           <div className="bg-white text-black inline-block px-6 py-3 font-black text-5xl tracking-tighter mb-8">SYM</div>
           <p className="text-zinc-500 text-[11px] uppercase font-black tracking-[0.2em]">STRENGTHEN YOUR MIND • COLOMBIA</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
