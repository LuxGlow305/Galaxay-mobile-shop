import React, { useState, useMemo, useEffect } from 'react';
import { SHOP_PHOTOS, SHOP_INFO } from '../data/mockData';
import { ShopPhoto } from '../types';
import { useApp } from '../context/AppContext';
import {
  Images,
  Maximize2,
  X,
  MapPin,
  Plus,
  Search,
  Tag,
  Trash2,
  Upload,
  Sparkles,
} from 'lucide-react';

export const ShopGalleryView: React.FC = () => {
  const { hasRole } = useApp();

  const [photos, setPhotos] = useState<ShopPhoto[]>(() => {
    const saved = localStorage.getItem('galaxy_shop_photos_v2');
    return saved ? JSON.parse(saved) : SHOP_PHOTOS;
  });

  const [selectedPhoto, setSelectedPhoto] = useState<ShopPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New photo form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Storefront');
  const [newDescription, setNewDescription] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    localStorage.setItem('galaxy_shop_photos_v2', JSON.stringify(photos));
  }, [photos]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(photos.map((p) => p.category)));
    return ['All', ...cats];
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.featuredProducts &&
          p.featuredProducts.some((fp) => fp.toLowerCase().includes(searchTerm.toLowerCase())));

      return matchesCat && matchesSearch;
    });
  }, [photos, selectedCategory, searchTerm]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const newPhoto: ShopPhoto = {
      id: `photo_${Date.now()}`,
      title: newTitle,
      category: newCategory,
      description: newDescription || 'Facility picture from Galaxy Mobile & Repairing Lab',
      url: newUrl,
      featuredProducts: newTags ? newTags.split(',').map((t) => t.trim()) : [],
    };

    setPhotos([newPhoto, ...photos]);
    setNewTitle('');
    setNewDescription('');
    setNewUrl('');
    setNewTags('');
    setShowAddModal(false);
  };

  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this photo from the gallery?')) {
      setPhotos(photos.filter((p) => p.id !== id));
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Images className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Galaxy Mobile Shop Photo Gallery</h2>
          </div>
          <p className="text-xs text-slate-400">
            Real facility photos showcasing our storefront signboard, repairing lab workstation, charger racks & banking booth.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-2xl text-xs text-slate-300">
            <p className="font-bold text-white">{SHOP_INFO.name}</p>
            <p className="text-[10px] text-emerald-400 font-mono">📍 Chak 117 JB Dhanola, Faisalabad</p>
          </div>

          {hasRole(['admin', 'manager']) && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-cyan-500/20 text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gallery photos by title, description, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Image Container */}
            <div className="relative aspect-video sm:aspect-square bg-slate-800 overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              <span className="absolute top-3 left-3 bg-cyan-500/90 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md">
                {photo.category}
              </span>

              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {hasRole(['admin']) && (
                  <button
                    onClick={(e) => handleDeletePhoto(photo.id, e)}
                    className="p-1.5 bg-rose-500/90 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition-colors"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button className="p-1.5 bg-slate-900/80 text-white rounded-xl backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                  {photo.description}
                </p>
              </div>

              {photo.featuredProducts && photo.featuredProducts.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1">
                  {photo.featuredProducts.map((p, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-2xl bg-slate-950/80 text-white hover:text-cyan-400 backdrop-blur-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="p-6 bg-slate-900 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedPhoto.category}
                </span>
                {hasRole(['admin']) && (
                  <button
                    onClick={(e) => handleDeletePhoto(selectedPhoto.id, e)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Photo
                  </button>
                )}
              </div>

              <h3 className="text-xl font-black text-white">{selectedPhoto.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedPhoto.description}</p>

              {selectedPhoto.featuredProducts && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {selectedPhoto.featuredProducts.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-lg border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Add Facility / Shop Photo
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Ronin Fast Charger Display"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Storefront">Storefront</option>
                  <option value="Repairing Lab">Repairing Lab</option>
                  <option value="Chargers Display">Chargers Display</option>
                  <option value="Interior & Counter">Interior & Counter</option>
                  <option value="Covers & Protection">Covers & Protection</option>
                  <option value="Audio & Networking">Audio & Networking</option>
                  <option value="Power Solutions">Power Solutions</option>
                  <option value="SIM & Financial Services">SIM & Financial Services</option>
                </select>
              </div>

              {/* Upload Photo File from Device */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Real Photo File from Device
                </label>
                <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-4 text-center bg-slate-800/50 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                    <p className="text-xs font-semibold text-slate-200">
                      Click to choose photo or drag & drop here
                    </p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, or GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Or enter Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Live Preview if available */}
              {newUrl && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Photo Preview:
                  </span>
                  <div className="h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                    <img src={newUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe what is featured in this photo..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Featured Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ronin 25W, Fast Charging, Type-C"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
