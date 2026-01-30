
import React, { useState } from 'react';
import { Category, SubCategory, Product, AppConfig } from '../types';

interface AdminPanelProps {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  config: AppConfig;
  onUpdateConfig: (config: AppConfig) => void;
  onImportAll: (data: any) => void;
  allData: any;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onAddProduct, config, onUpdateConfig, onImportAll, allData }) => {
  const [activeTab, setActiveTab] = useState<'product' | 'settings' | 'sync'>('product');
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: Category.CABALLERO,
    subCategory: SubCategory.DEPORTIVO,
    sizes: '',
    description: '',
    image: ''
  });

  const [settingsData, setSettingsData] = useState<AppConfig>(config);
  const [importString, setImportString] = useState('');

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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s !== '');
    onAddProduct({ ...formData, sizes: sizesArray });
    setFormData({ name: '', price: 0, category: Category.CABALLERO, subCategory: SubCategory.DEPORTIVO, sizes: '', description: '', image: '' });
    alert('¡Producto agregado!');
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(settingsData);
    alert('Configuración actualizada');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(allData);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'catalogo-sym-backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = () => {
    const dataStr = JSON.stringify(allData);
    navigator.clipboard.writeText(btoa(dataStr));
    alert('Código de sincronización copiado. Pégalo en tu otro dispositivo.');
  };

  const handleImport = () => {
    try {
      const decoded = atob(importString);
      const parsed = JSON.parse(decoded);
      if (confirm('¿Importar todos los datos? Esto reemplazará el catálogo actual.')) {
        onImportAll(parsed);
        setImportString('');
        alert('Datos sincronizados correctamente.');
      }
    } catch (e) {
      alert('Error: El código de sincronización no es válido.');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 p-8 rounded-xl mb-12 shadow-2xl">
      <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('product')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'product' ? 'border-b-2 border-white text-white' : 'text-zinc-500'}`}>Agregar Producto</button>
        <button onClick={() => setActiveTab('settings')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'settings' ? 'border-b-2 border-white text-white' : 'text-zinc-500'}`}>Redes y Contacto</button>
        <button onClick={() => setActiveTab('sync')} className={`pb-4 px-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === 'sync' ? 'border-b-2 border-white text-white' : 'text-zinc-500'}`}>Sincronizar (PC/Móvil)</button>
      </div>
      
      {activeTab === 'product' && (
        <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input type="text" className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none" placeholder="Nombre del Modelo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="number" className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:border-white outline-none" placeholder="Precio (COP)" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} required />
            <div className="grid grid-cols-2 gap-4">
              <select className="bg-black border border-zinc-800 rounded px-4 py-3 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select className="bg-black border border-zinc-800 rounded px-4 py-3 text-white" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value as SubCategory})}>
                {Object.values(SubCategory).map(sc => <option key={sc} value={sc}>{sc}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <input type="text" className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white" placeholder="Tallas (35, 36, 37...)" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} required />
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-[10px] text-zinc-500 file:mr-4 file:py-2 file:px-4 file:bg-white file:text-black hover:file:bg-zinc-200 cursor-pointer" />
            <textarea className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white min-h-[100px]" placeholder="Descripción corta" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          <button type="submit" className="md:col-span-2 bg-white text-black font-black py-4 rounded uppercase tracking-widest hover:bg-zinc-200 transition-all">Publicar en Catálogo</button>
        </form>
      )}

      {activeTab === 'settings' && (
        <form onSubmit={handleSettingsSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white" placeholder="WhatsApp (Ej: 57300...)" value={settingsData.whatsapp} onChange={e => setSettingsData({...settingsData, whatsapp: e.target.value})} />
            <input type="text" className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white" placeholder="URL Instagram" value={settingsData.instagram} onChange={e => setSettingsData({...settingsData, instagram: e.target.value})} />
          </div>
          <button type="submit" className="bg-white text-black font-black px-10 py-3 rounded uppercase tracking-widest">Guardar Cambios</button>
        </form>
      )}

      {activeTab === 'sync' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-white font-black uppercase text-xs tracking-widest">Paso 1: Exportar (Desde PC)</h3>
              <p className="text-zinc-500 text-[10px] leading-relaxed">Copia este código y envíalo a tu móvil (vía WhatsApp o correo) para actualizar tu catálogo allá.</p>
              <button onClick={copyToClipboard} className="w-full bg-zinc-800 text-white font-black py-4 rounded uppercase text-[10px] tracking-widest border border-zinc-700 hover:bg-zinc-700">Copiar Código de Sincronización</button>
              <button onClick={exportData} className="w-full border border-zinc-800 text-zinc-500 py-3 rounded text-[9px] font-black uppercase tracking-widest hover:text-white">Descargar archivo .JSON</button>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-black uppercase text-xs tracking-widest">Paso 2: Importar (En el Móvil)</h3>
              <p className="text-zinc-500 text-[10px] leading-relaxed">Pega aquí el código que copiaste de tu otro dispositivo para sincronizar los cambios.</p>
              <textarea className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white text-[9px] font-mono min-h-[100px]" placeholder="Pega el código aquí..." value={importString} onChange={e => setImportString(e.target.value)} />
              <button onClick={handleImport} className="w-full bg-white text-black font-black py-4 rounded uppercase text-[10px] tracking-widest">Sincronizar Ahora</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
