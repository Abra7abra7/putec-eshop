'use client';

import { useState } from 'react';
import { Wine, Save, X, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { createWineProduct, updateWineProduct } from '../controllers/admin-wine-controller';
import { ImageUpload } from './image-upload';
import type { WineFormData, AdminWineWithPrice } from '../types';

interface AdminWineFormProps {
  wine?: AdminWineWithPrice;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultWineData: WineFormData = {
  name: '',
  category: 'white_wine',
  quality: '',
  region: '',
  designation: '',
  vintage: '',
  color: '',
  aroma: '',
  taste: '',
  servingTemp: '',
  batch: '',
  fillingDate: '',
  acidity: '',
  residualSugar: '',
  sugar: '',
  alcohol: '',
  storageTemp: '',
  sulfites: false,
  producer: '',
  address: '',
  gs1Code: '',
  country: 'Slovakia',
  price: 0,
  stockQuantity: 0,
  active: true,
  images: []
};

export function AdminWineForm({ wine, onSuccess, onCancel }: AdminWineFormProps) {
  const [formData, setFormData] = useState<WineFormData>(
    wine ? {
      name: wine.name,
      category: wine.metadata?.wine_type || 'white_wine',
      quality: wine.metadata?.quality || '',
      region: wine.metadata?.region || '',
      designation: wine.metadata?.designation || '',
      vintage: wine.metadata?.vintage || '',
      color: wine.metadata?.color || '',
      aroma: wine.metadata?.aroma || '',
      taste: wine.metadata?.taste || '',
      servingTemp: wine.metadata?.serving_temp || '',
      batch: wine.metadata?.batch || '',
      fillingDate: wine.metadata?.filling_date || '',
      acidity: wine.metadata?.acidity || '',
      residualSugar: wine.metadata?.residual_sugar || '',
      sugar: wine.metadata?.sugar || '',
      alcohol: wine.metadata?.alcohol || '',
      storageTemp: wine.metadata?.storage_temp || '',
      sulfites: wine.metadata?.sulfites === 'true',
      producer: wine.metadata?.producer || '',
      address: wine.metadata?.address || '',
      gs1Code: wine.metadata?.gs1_code || '',
      country: wine.metadata?.country || 'Slovakia',
      price: wine.prices?.[0]?.unit_amount ? wine.prices[0].unit_amount / 100 : 0,
      stockQuantity: parseInt(wine.metadata?.inventory_quantity || '0'),
      active: wine.active,
      images: wine.images || []
    } : defaultWineData
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Najprv uploadovať všetky obrázky (ak existujú)
      if (formData.images && formData.images.length > 0) {
        console.log('🖼️ Kontrolujem obrázky pred vytvorením produktu:', formData.images);
        
        // Počkať na upload všetkých obrázkov
        for (const imageUrl of formData.images) {
          if (imageUrl.includes('supabase.co')) {
            console.log('✅ Obrázok už uploadovaný:', imageUrl);
          } else {
            console.log('⚠️ Obrázok nie je uploadovaný:', imageUrl);
            toast({
              title: "⚠️ Upozornenie!",
              description: "Najprv uploadujte všetky obrázky pred vytvorením produktu",
              variant: "destructive",
            });
            setIsSubmitting(false);
            return;
          }
        }
      }

      let result;
      
      if (wine) {
        // Aktualizácia existujúceho vína
        result = await updateWineProduct(wine.stripe_id, formData);
      } else {
        // Vytvorenie nového vína
        console.log('🍷 Vytváram produkt s obrázkami:', formData.images);
        result = await createWineProduct(formData);
      }

      if (result.success) {
        toast({
          title: "✅ Úspech!",
          description: wine ? "Víno bolo úspešne aktualizované" : "Víno bolo úspešne vytvorené",
          variant: "default",
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "❌ Chyba!",
          description: result.error || "Nepodarilo sa uložiť víno",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "❌ Neočakávaná chyba!",
        description: "Nepodarilo sa spracovať formulár",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof WineFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addImage = () => {
    const url = prompt('Zadajte URL obrázka:');
    if (url && url.trim()) {
      setFormData(prev => ({ ...prev, images: [...prev.images, url.trim()] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-zinc-900 rounded-lg">
      <div className="flex items-center gap-3 mb-6">
        <Wine className="h-8 w-8 text-amber-600" />
        <h2 className="text-2xl font-bold text-white">
          {wine ? 'Upraviť víno' : 'Pridať nové víno'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Základné informácie */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">📝 Základné informácie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Názov vína *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Pálava 2024"
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Kategória *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-md px-3 py-2"
                required
              >
                <option value="white_wine">Biele víno</option>
                <option value="red_wine">Červené víno</option>
                <option value="rose_wine">Ružové víno</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Kvalita *
              </label>
              <Input
                type="text"
                value={formData.quality}
                onChange={(e) => handleInputChange('quality', e.target.value)}
                placeholder="Akostné biele polosuché"
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Region *
              </label>
              <Input
                type="text"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                placeholder="Malokarpatská vinohradnícka oblasť"
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Označenie pôvodu
              </label>
              <Input
                type="text"
                value={formData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value)}
                placeholder="Chránené označenie pôvodu"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Rok výroby *
              </label>
              <Input
                type="text"
                value={formData.vintage}
                onChange={(e) => handleInputChange('vintage', e.target.value)}
                placeholder="2024"
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Senzorické vlastnosti */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🎨 Senzorické vlastnosti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Farba
              </label>
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
                placeholder="Iskrivá zlato-žltá"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Vôňa
              </label>
              <Input
                type="text"
                value={formData.aroma}
                onChange={(e) => handleInputChange('aroma', e.target.value)}
                placeholder="Pomarančová kôra, sušené marhule"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Chuť
              </label>
              <Textarea
                value={formData.taste}
                onChange={(e) => handleInputChange('taste', e.target.value)}
                placeholder="Medovo-ovocná chuť, plná broskýň, byliniek a jemného tymiánu"
                className="bg-zinc-700 border-zinc-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Teplota podávania
              </label>
              <Input
                type="text"
                value={formData.servingTemp}
                onChange={(e) => handleInputChange('servingTemp', e.target.value)}
                placeholder="10-12°C"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Technické údaje */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🔬 Technické údaje</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Dávka
              </label>
              <Input
                type="text"
                value={formData.batch}
                onChange={(e) => handleInputChange('batch', e.target.value)}
                placeholder="L.23"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Dátum plnenia
              </label>
              <Input
                type="text"
                value={formData.fillingDate}
                onChange={(e) => handleInputChange('fillingDate', e.target.value)}
                placeholder="2/2025"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Kyseliny (g/l)
              </label>
              <Input
                type="text"
                value={formData.acidity}
                onChange={(e) => handleInputChange('acidity', e.target.value)}
                placeholder="6.6"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Zvyškový cukor (g/l)
              </label>
              <Input
                type="text"
                value={formData.residualSugar}
                onChange={(e) => handleInputChange('residualSugar', e.target.value)}
                placeholder="10"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Cukor (NM°)
              </label>
              <Input
                type="text"
                value={formData.sugar}
                onChange={(e) => handleInputChange('sugar', e.target.value)}
                placeholder="22"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Obsah alkoholu (%)
              </label>
              <Input
                type="text"
                value={formData.alcohol}
                onChange={(e) => handleInputChange('alcohol', e.target.value)}
                placeholder="12.0"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Teplota skladovania
              </label>
              <Input
                type="text"
                value={formData.storageTemp}
                onChange={(e) => handleInputChange('storageTemp', e.target.value)}
                placeholder="10-12°C"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sulfites"
                checked={formData.sulfites}
                onChange={(e) => handleInputChange('sulfites', e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-700"
              />
              <label htmlFor="sulfites" className="text-sm font-medium text-zinc-300">
                Obsahuje siričitany
              </label>
            </div>
          </div>
        </div>

        {/* Výroba */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">🏭 Výroba</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Výrobca *
              </label>
              <Input
                type="text"
                value={formData.producer}
                onChange={(e) => handleInputChange('producer', e.target.value)}
                placeholder="Pútec s.r.o."
                className="bg-zinc-700 border-zinc-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Adresa
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Pezinská 154, Vinosady 902 01"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                GS1 kód
              </label>
              <Input
                type="text"
                value={formData.gs1Code}
                onChange={(e) => handleInputChange('gs1Code', e.target.value)}
                placeholder="08582000037412"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Krajina
              </label>
              <Input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Slovakia"
                className="bg-zinc-700 border-zinc-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Obchodné informácie */}
        <div className="bg-zinc-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">💰 Obchodné informácie</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                       <label className="block text-sm font-medium text-zinc-300 mb-2">
                         Cena (EUR) *
                       </label>
                       <Input
                         type="number"
                         step="0.01"
                         min="0"
                         value={formData.price || ''}
                         onChange={(e) => {
                           const value = e.target.value;
                           if (value === '') {
                             handleInputChange('price', 0);
                           } else {
                             const numValue = parseFloat(value);
                             if (!isNaN(numValue)) {
                               handleInputChange('price', numValue);
                             }
                           }
                         }}
                         placeholder="11.90"
                         className="bg-zinc-700 border-zinc-600 text-white"
                         required
                       />
                     </div>

                                 <div>
                       <label className="block text-sm font-medium text-zinc-300 mb-2">
                         Skladové zásoby
                       </label>
                       <Input
                         type="number"
                         min="0"
                         value={formData.stockQuantity || ''}
                         onChange={(e) => {
                           const value = e.target.value;
                           if (value === '') {
                             handleInputChange('stockQuantity', 0);
                           } else {
                             const numValue = parseInt(value);
                             if (!isNaN(numValue)) {
                               handleInputChange('stockQuantity', numValue);
                             }
                           }
                         }}
                         placeholder="150"
                         className="bg-zinc-700 border-zinc-600 text-white"
                       />
                     </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-700"
              />
              <label htmlFor="active" className="text-sm font-medium text-zinc-300">
                Aktívne
              </label>
            </div>
          </div>

          {/* Obrázky */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Obrázky
            </label>
            <ImageUpload
              wineName={formData.name || 'Nove vino'}
              onImagesChange={(images) => handleInputChange('images', images)}
              currentImages={formData.images}
            />
          </div>
        </div>

        {/* Akcie */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Ukladám...' : (wine ? 'Aktualizovať' : 'Vytvoriť')}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-zinc-400 hover:text-zinc-300"
            >
              <X className="h-4 w-4 mr-2" />
              Zrušiť
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
