'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { type Product } from '@/lib/types';
import type { SupabaseClient } from '@supabase/supabase-js';

// Typ pre stavový objekt, ktorý vraciame z akcií
export type State = {
  errors?: {
    name?: string[];
    description?: string[];
    price?: string[];
    slug?: string[];
    rocnik?: string[];
    farba_vina?: string[];
    zvyskovy_cukor?: string[];
    vona?: string[];
    chut?: string[];
    farba_popis?: string[];
    ean?: string[];
    image?: string[];
  };

  message?: string | null;
};

// Schémy pre validáciu
const fileSchema = z.instanceof(File, { message: 'Je potrebný obrázok.' });
const imageSchema = fileSchema
  .refine((file) => file.size === 0 || file.type.startsWith('image/'), {
    message: 'Súbor musí byť obrázok.',
  })
  .refine((file) => file.size < 4 * 1024 * 1024, {
    message: 'Obrázok musí byť menší ako 4MB.',
  });

const productSchemaBase = {
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().min(1, 'Popis je povinný'),
  price: z.coerce.number().gt(0, 'Cena musí byť väčšia ako 0'),
  slug: z
    .string()
    .min(1, 'Slug je povinný')
    .regex(/^[a-z0-9-]+$/, 'Slug môže obsahovať iba malé písmená, čísla a pomlčky.'),
  rocnik: z.coerce.number({ invalid_type_error: 'Rok musí byť číslo' }).int().optional().nullable(),
  farba_vina: z.string().optional().nullable(),
  zvyskovy_cukor: z.string().optional().nullable(),
  vona: z.string().optional().nullable(),
  chut: z.string().optional().nullable(),
  farba_popis: z.string().optional().nullable(),
  ean: z.string().optional().nullable(),
};

const addProductSchema = z.object({
  ...productSchemaBase,
  image: imageSchema.optional(), // Pri pridaní môže byť obrázok voliteľný
});

const updateProductSchema = z.object({
  ...productSchemaBase,
  image: imageSchema.optional(),
});

// Pomocná funkcia na spracovanie prázdnych stringov z formulára na null
function emptyStringToNull(obj: Record<string, FormDataEntryValue>): Record<string, FormDataEntryValue | null> {
  const newObj: Record<string, FormDataEntryValue | null> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = obj[key] === '' ? null : obj[key];
    }
  }
  return newObj;
}

async function uploadImage(supabase: SupabaseClient, image: File, id?: string): Promise<string> {
  const fileExt = image.name.split('.').pop();
  const fileName = `${id || Math.random()}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(fileName, image);

  if (uploadError) {
    console.error('Storage Error:', uploadError);
    throw new Error('Chyba pri nahrávaní obrázka.');
  }

  const { data: publicUrlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

export async function addProduct(prevState: State, formData: FormData): Promise<State> {
  const rawData = Object.fromEntries(formData.entries());
  const processedData = { ...emptyStringToNull(rawData), image: rawData.image as File };

  const validatedFields = addProductSchema.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Chýbajúce alebo neplatné polia.',
    };
  }

  const { image, ...productData } = validatedFields.data;
  const supabase = await createClient();

  try {
    let imageUrl = '';
    if (image && image.size > 0) {
      imageUrl = await uploadImage(supabase, image);
    }

    const dataToInsert = { ...productData, image_url: imageUrl, sku: `sku-${Date.now()}` };
    const { error } = await supabase.from('products').insert(dataToInsert);

    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database Error:', error.message);
      return { message: error.message };
    }
    return { message: 'Chyba pri ukladaní produktu.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function updateProduct(
  id: string,
  product: Product,
  prevState: unknown,
  formData: FormData
): Promise<State> {
  const rawData = Object.fromEntries(formData.entries());
  const processedData = { ...emptyStringToNull(rawData), image: rawData.image as File };

  const validatedFields = updateProductSchema.safeParse(processedData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Chýbajúce alebo neplatné polia.',
    };
  }

  const { image, ...productData } = validatedFields.data;
  const supabase = await createClient();

  try {
    let imageUrl = product.image_url || '';
    if (image && image.size > 0) {
      if (product.image_url) {
        const oldImageName = product.image_url.split('/').pop();
        if (oldImageName) {
          await supabase.storage.from('product-images').remove([oldImageName]);
        }
      }
      imageUrl = await uploadImage(supabase, image, id);
    }

    const dataToUpdate = { ...productData, image_url: imageUrl };
    const { error } = await supabase.from('products').update(dataToUpdate).eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database Error:', error.message);
      return { message: error.message };
    }
    return { message: 'Chyba pri aktualizácii produktu.' };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/edit/${id}`);
  revalidatePath(`/vino/${productData.slug}`);
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Database Error:', error);
    if (error.code === '23503') {
      return { message: 'Produkt sa nedá vymazať, pretože je súčasťou existujúcej objednávky.' };
    }
    return { message: 'Chyba pri mazaní produktu.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  return { message: null };
}
