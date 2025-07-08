'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

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
  };
  message?: string | null;
};

// Jedna centrálna Zod schéma pre validáciu produktu
const productSchema = z.object({
  name: z.string().min(1, 'Názov je povinný'),
  description: z.string().min(1, 'Popis je povinný'),
  price: z.coerce.number().gt(0, 'Cena musí byť väčšia ako 0'),
  slug: z.string().min(1, 'Slug je povinný').regex(/^[a-z0-9-]+$/, 'Slug môže obsahovať iba malé písmená, čísla a pomlčky.'),
  rocnik: z.coerce.number({ invalid_type_error: 'Rok musí byť číslo' }).int().optional().nullable(),
  farba_vina: z.string().optional().nullable(),
  zvyskovy_cukor: z.string().optional().nullable(),
  vona: z.string().optional().nullable(),
  chut: z.string().optional().nullable(),
  farba_popis: z.string().optional().nullable(),
  ean: z.string().optional().nullable(),
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

export async function addProduct(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = productSchema.safeParse(
    emptyStringToNull(Object.fromEntries(formData.entries()))
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Chýbajúce alebo neplatné polia. Nepodarilo sa pridať produkt.',
    };
  }

  const dataToInsert = {
    ...validatedFields.data,
    image_url: '', // Explicitne nastavíme prázdny reťazec
    sku: `sku-${Date.now()}`, // Generujeme unikátne SKU
  };

  const supabase = await createClient();
  const { error } = await supabase.from('products').insert(dataToInsert);

  if (error) {
    console.error('Database Error:', error);
    return {
      message: 'Chyba pri ukladaní produktu do databázy.',
    };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
): Promise<State> {
  const validatedFields = productSchema.safeParse(
    emptyStringToNull(Object.fromEntries(formData.entries()))
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Chýbajúce alebo neplatné polia. Nepodarilo sa aktualizovať produkt.',
    };
  }

  const dataToUpdate = validatedFields.data;
  const supabase = await createClient();

  const { error } = await supabase.from('products').update(dataToUpdate).eq('id', id);

  if (error) {
    console.error('Database Error:', error);
    return {
      message: 'Chyba pri aktualizácii produktu v databáze.',
    };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/edit/${id}`);
  revalidatePath(`/vino/${dataToUpdate.slug}`);
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Database Error:', error);
    // Špecificky odchytíme chybu cudzieho kľúča
    if (error.code === '23503') {
      return { message: 'Produkt sa nedá vymazať, pretože je súčasťou existujúcej objednávky.' };
    }
    return { message: 'Chyba pri mazaní produktu.' };
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
  // Po úspešnom zmazaní môžeme vrátiť úspešný stav
  return { message: null };
}
