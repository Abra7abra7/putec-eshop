'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { ImageUploadData, SupabaseImageUpload } from '../types';

interface ImageUploadProps {
  wineName: string;
  onImagesChange: (images: string[]) => void;
  currentImages?: string[];
}

export function ImageUpload({ wineName, onImagesChange, currentImages = [] }: ImageUploadProps) {
  const [uploadData, setUploadData] = useState<ImageUploadData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  // File selection handler
  const handleFileSelect = async (file: File) => {
    // Validácia súboru
    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Chyba!",
        description: "Vyberte prosím obrázok (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "❌ Chyba!",
        description: "Obrázok je príliš veľký. Maximálna veľkosť je 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Automaticky uploadovať obrázok
    setIsUploading(true);
    
    try {
      // Vytvoriť preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadData({
          file,
          preview: e.target?.result as string,
          uploadProgress: 0,
          isUploading: true
        });
      };
      reader.readAsDataURL(file);
      
      // Okamžite uploadovať
      await handleUpload(file);
      
    } catch (error) {
      console.error('Auto-upload error:', error);
      toast({
        title: "❌ Chyba!",
        description: "Nepodarilo sa automaticky uploadovať obrázok",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Upload handler
  const handleUpload = async (file?: File) => {
    const fileToUpload = file || uploadData?.file;
    if (!fileToUpload) return;

    setIsUploading(true);

    try {
      // Použiť API route namiesto Server Action
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('wineName', wineName);

      console.log('🖼️ Uploadujem obrázok:', fileToUpload.name);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // Pridať nový obrázok do zoznamu
        const newImages = [...currentImages, result.data.url];
        onImagesChange(newImages);
        
        toast({
          title: "✅ Úspech!",
          description: "Obrázok bol úspešne uploadovaný",
          variant: "default",
        });
        
        // Reset upload data
        setUploadData(null);
        
        console.log('✅ Obrázok uploadovaný:', result.data.url);
        
        // Aktualizovať Stripe produkt s novým obrázkom
        await updateStripeProductImages(newImages);
        
      } else {
        toast({
          title: "❌ Chyba!",
          description: result.error || "Upload zlyhal",
          variant: "destructive",
        });
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "❌ Neočakávaná chyba!",
        description: "Nepodarilo sa spracovať upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Aktualizácia Stripe produktu s novými obrázkami
  const updateStripeProductImages = async (images: string[]) => {
    try {
      console.log('🔄 Aktualizujem Stripe produkt s obrázkami:', images);
      
      // Získať aktuálny produkt z formulára (cez props)
      const response = await fetch('/api/update-product-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          images,
          wineName 
        }),
      });

      if (response.ok) {
        console.log('✅ Stripe produkt aktualizovaný s obrázkami');
      } else {
        console.warn('⚠️ Nepodarilo sa aktualizovať Stripe produkt');
      }
    } catch (error) {
      console.error('❌ Chyba pri aktualizácii Stripe produktu:', error);
    }
  };

  // Remove image handler
  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      // Pokúsiť sa vymazať zo Supabase Storage (ak je to Storage URL)
      if (imageUrl.includes('supabase.co')) {
        // Extrahovať path z URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const imagePath = `wines/${fileName}`;
        
        // Vymazať cez API route
        const response = await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imagePath }),
        });
        
        if (!response.ok) {
          console.warn('Nepodarilo sa vymazať obrázok zo Storage');
        }
      }
      
      // Odstrániť z lokálneho zoznamu
      const newImages = currentImages.filter((_, i) => i !== index);
      onImagesChange(newImages);
      
      toast({
        title: "✅ Úspech!",
        description: "Obrázok bol odstránený",
        variant: "default",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "❌ Chyba!",
        description: "Nepodarilo sa odstrániť obrázok",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploadData ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-600 hover:border-zinc-500'
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!uploadData ? (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-zinc-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-white">
                Presuňte obrázok sem alebo kliknite na výber
              </p>
              <p className="text-sm text-zinc-400 mt-1">
                Podporované formáty: JPEG, PNG, WebP (max 5MB)
              </p>
              <p className="text-xs text-amber-400 mt-2">
                💡 Tip: Obrázok sa automaticky uploaduje po výbere
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileSelect(file);
                };
                input.click();
              }}
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <FileImage className="h-4 w-4 mr-2" />
              Vybrať obrázok
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={uploadData.preview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadData(null)}
                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 border-red-600 text-white hover:bg-red-700"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div>
              <p className="text-sm text-zinc-300">{uploadData.file.name}</p>
              <p className="text-xs text-zinc-400">
                {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {uploadData.isUploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto mb-2"></div>
                <p className="text-sm text-amber-500">Uploadujem obrázok...</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Počkajte pred vytvorením produktu
                </p>
              </div>
            ) : (
              <Button
                onClick={() => handleUpload(uploadData.file)}
                disabled={isUploading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploadovať obrázok
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Current Images */}
      {currentImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-zinc-300 mb-3">Aktuálne obrázky</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {currentImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Obrázok ${index + 1}`}
                  className="h-24 w-24 object-cover rounded-lg border border-zinc-600"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage(imageUrl, index)}
                  className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-600 border-red-600 text-white hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-400 mt-2">
            ✅ Všetky obrázky sú uploadované - môžete vytvoriť produkt
          </p>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="text-center p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500 mx-auto mb-2"></div>
          <p className="text-sm text-amber-500 font-medium">Uploadujem obrázok...</p>
          <p className="text-xs text-zinc-400 mt-1">
            Počkajte kým sa upload dokončí pred vytvorením produktu
          </p>
        </div>
      )}
    </div>
  );
}
