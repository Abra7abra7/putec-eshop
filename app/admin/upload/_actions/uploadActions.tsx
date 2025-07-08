'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function handleImageUpload(formData: FormData) {
  const supabase = await createClient();

  const productId = formData.get('productId') as string;
  const imageFile = formData.get('image') as File;

  if (!productId || !imageFile) {
    return { error: 'Chýbajúce ID produktu alebo súbor.' };
  }

  // Vytvorenie unikátneho názvu súboru, aby sa predišlo konfliktom
  const fileExtension = imageFile.name.split('.').pop();
  const fileName = `${productId}-${Date.now()}.${fileExtension}`;
  const filePath = `${fileName}`;

  // 1. Nahrávanie súboru do Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, imageFile);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return { error: `Nepodarilo sa nahrať obrázok: ${uploadError.message}` };
  }

  // 2. Získanie verejnej URL adresy nahratého súboru
  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    return { error: 'Nepodarilo sa získať verejnú URL obrázka.' };
  }

  const publicUrl = publicUrlData.publicUrl;

  // 3. Aktualizácia záznamu v databáze
  const { error: updateError } = await supabase
    .from('products')
    .update({ image_url: publicUrl })
    .eq('id', productId);

  if (updateError) {
    console.error('Error updating product:', updateError);
    return { error: `Nepodarilo sa aktualizovať produkt: ${updateError.message}` };
  }

  // Vyčistenie cache pre stránku produktu a zoznam produktov
  revalidatePath('/vino');
  revalidatePath(`/vino/[slug]`, 'layout');

  return { message: 'Obrázok bol úspešne nahraný a priradený k produktu.' };
}
