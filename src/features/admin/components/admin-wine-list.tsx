'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAllWines, deleteWineProduct, toggleWineStatus } from '../controllers/admin-wine-controller';
import { AdminWineForm } from './admin-wine-form';
import type { AdminWineWithPrice } from '../types';

export function AdminWineList() {
  const [wines, setWines] = useState<AdminWineWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWine, setEditingWine] = useState<AdminWineWithPrice | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWines();
  }, []);

  const loadWines = async () => {
    try {
      const data = await getAllWines();
      setWines(data);
    } catch (error) {
      toast({
        title: "❌ Chyba!",
        description: "Nepodarilo sa načítať vína",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wine: AdminWineWithPrice) => {
    if (!confirm(`Naozaj chcete deaktivovať víno "${wine.name}"?`)) return;

    try {
      const result = await deleteWineProduct(wine.stripe_id);
      if (result.success) {
        toast({
          title: "✅ Úspech!",
          description: "Víno bolo úspešne deaktivované",
          variant: "default",
        });
        loadWines();
      } else {
        toast({
          title: "❌ Chyba!",
          description: result.error || "Nepodarilo sa deaktivovať víno",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Neočakávaná chyba!",
        description: "Nepodarilo sa spracovať požiadavku",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (wine: AdminWineWithPrice) => {
    const newStatus = !wine.active;
    const action = newStatus ? 'aktivovať' : 'deaktivovať';
    
    if (!confirm(`Naozaj chcete ${action} víno "${wine.name}"?`)) return;

    try {
      const result = await toggleWineStatus(wine.stripe_id, newStatus);
      if (result.success) {
        toast({
          title: "✅ Úspech!",
          description: result.message,
          variant: "default",
        });
        loadWines();
      } else {
        toast({
          title: "❌ Chyba!",
          description: result.error || `Nepodarilo sa ${action} víno`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Neočakávaná chyba!",
        description: `Nepodarilo sa ${action} víno`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Správa vín</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Pridať nové víno
        </Button>
      </div>

      {/* Wine List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wines.map((wine) => (
          <div
            key={wine.id}
            className={`bg-zinc-800 rounded-lg p-6 border transition-colors ${
              wine.active 
                ? 'border-zinc-700 hover:border-zinc-600' 
                : 'border-red-600/50 hover:border-red-500/50'
            }`}
          >
            {/* Wine Image */}
            <div className="mb-4">
              {wine.images && wine.images.length > 0 ? (
                <div className="relative">
                  <img
                    src={wine.images[0]}
                    alt={wine.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-zinc-700 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-zinc-400" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-zinc-700 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-zinc-400" />
                </div>
              )}
            </div>

            {/* Wine Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{wine.name}</h3>
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {wine.description || 'Bez popisu'}
                </p>
              </div>

              {/* Wine Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-zinc-500">Kategória:</span>
                  <span className="text-zinc-300 ml-1">
                    {wine.metadata?.wine_type === 'red_wine' && 'Červené víno'}
                    {wine.metadata?.wine_type === 'white_wine' && 'Biele víno'}
                    {wine.metadata?.wine_type === 'rose_wine' && 'Ružové víno'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500">Rok:</span>
                  <span className="text-zinc-300 ml-1">{wine.metadata?.vintage || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Región:</span>
                  <span className="text-zinc-300 ml-1">{wine.metadata?.region || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Kvalita:</span>
                  <span className="text-zinc-300 ml-1">{wine.metadata?.quality || 'N/A'}</span>
                </div>
              </div>

              {/* Price */}
              {wine.prices && wine.prices.length > 0 && (
                <div className="pt-2 border-t border-zinc-700">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500 text-sm">Cena:</span>
                    <span className="text-lg font-bold text-amber-500">
                      {(wine.prices[0].unit_amount / 100).toFixed(2)} €
                    </span>
                  </div>
                </div>
              )}

              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  wine.active 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {wine.active ? 'Aktívne' : 'Neaktívne'}
                </span>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(wine)}
                    className={wine.active 
                      ? 'text-orange-400 hover:text-orange-300' 
                      : 'text-green-400 hover:text-green-300'
                    }
                    title={wine.active ? 'Deaktivovať' : 'Aktivovať'}
                  >
                    {wine.active ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingWine(wine)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(wine)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {wines.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-400 mb-2">Žiadne vína</h3>
          <p className="text-zinc-500 mb-4">Začnite pridaním prvého vína</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Pridať prvé víno
          </Button>
        </div>
      )}

      {/* Wine Form Modal */}
      {(showForm || editingWine) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AdminWineForm
              wine={editingWine || undefined}
              onSuccess={() => {
                setShowForm(false);
                setEditingWine(null);
                loadWines();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingWine(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
