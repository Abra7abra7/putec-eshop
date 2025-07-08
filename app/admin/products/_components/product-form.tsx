'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { addProduct, updateProduct, State } from '../_actions/productActions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import slugify from 'slugify';

import { type Product } from '@/lib/types';


function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Ukladá sa...' : isEditing ? 'Upraviť produkt' : 'Pridať produkt'}
    </Button>
  );
}

export default function ProductForm({ product }: { product?: Product }) {
  const isEditing = !!product;
  const initialState: State = { message: null, errors: {} };

  // Dynamicky vyberieme akciu podľa toho, či upravujeme alebo pridávame
  const actionToCall = isEditing ? updateProduct.bind(null, product.id, product) : addProduct;
  const [state, formAction] = useFormState(actionToCall, initialState);

  // Stav pre plne kontrolované inputy
  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [manualSlug, setManualSlug] = useState(isEditing);

  // Stavy pre nové polia
  const [rocnik, setRocnik] = useState(product?.rocnik?.toString() || '');
  const [farbaVina, setFarbaVina] = useState(product?.farba_vina || '');
  const [zvyskovyCukor, setZvyskovyCukor] = useState(product?.zvyskovy_cukor || '');
  const [vona, setVona] = useState(product?.vona || '');
  const [chut, setChut] = useState(product?.chut || '');
  const [farbaPopis, setFarbaPopis] = useState(product?.farba_popis || '');
  const [ean, setEan] = useState(product?.ean || '');
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

  useEffect(() => {
    if (!manualSlug) {
      setSlug(slugify(name, { lower: true, strict: true }));
    }
  }, [name, manualSlug]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(true);
    setSlug(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Ak používateľ zruší výber, vrátime pôvodný obrázok produktu (ak existuje)
      setImagePreview(product?.image_url || null);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Názov</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onChange={handleNameChange}
        />
        {state.errors?.name && <p className="text-red-500 text-xs">{state.errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL Slug</Label>
        <Input
          type="text"
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={handleSlugChange}
        />
        {state.errors?.slug && <p className="text-red-500 text-xs">{state.errors.slug}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Obrázok produktu</Label>
        <Input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Náhľad:</p>
            <Image
              src={imagePreview}
              alt="Náhľad obrázka"
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        )}
        {state.errors?.image && <p className="text-red-500 text-xs">{state.errors.image}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Popis</Label>
        <Textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {state.errors?.description && <p className="text-red-500 text-xs">{state.errors.description}</p>}
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Cena (€)</Label>
          <Input
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {state.errors?.price && <p className="text-red-500 text-xs">{state.errors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="rocnik">Ročník</Label>
          <Input
            type="number"
            id="rocnik"
            name="rocnik"
            value={rocnik}
            onChange={(e) => setRocnik(e.target.value)}
          />
          {state.errors?.rocnik && <p className="text-red-500 text-xs">{state.errors.rocnik}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="farba_vina">Farba vína</Label>
          <select
            id="farba_vina"
            name="farba_vina"
            value={farbaVina ?? ''}
            onChange={(e) => setFarbaVina(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Vyberte farbu</option>
            <option value="biele">Biele</option>
            <option value="cervene">Červené</option>
            <option value="ruzove">Ružové</option>
          </select>
          {state.errors?.farba_vina && <p className="text-red-500 text-xs">{state.errors.farba_vina}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="zvyskovy_cukor">Zvyškový cukor</Label>
          <select
            id="zvyskovy_cukor"
            name="zvyskovy_cukor"
            value={zvyskovyCukor ?? ''}
            onChange={(e) => setZvyskovyCukor(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Vyberte typ</option>
            <option value="suche">Suché</option>
            <option value="polosuche">Polosuché</option>
            <option value="polosladke">Polosladké</option>
            <option value="sladke">Sladké</option>
          </select>
          {state.errors?.zvyskovy_cukor && <p className="text-red-500 text-xs">{state.errors.zvyskovy_cukor}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vona">Vôňa (popis)</Label>
        <Textarea id="vona" name="vona" value={vona} onChange={(e) => setVona(e.target.value)} />
        {state.errors?.vona && <p className="text-red-500 text-xs">{state.errors.vona}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="chut">Chuť (popis)</Label>
        <Textarea id="chut" name="chut" value={chut} onChange={(e) => setChut(e.target.value)} />
        {state.errors?.chut && <p className="text-red-500 text-xs">{state.errors.chut}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="farba_popis">Farba (popis)</Label>
        <Textarea id="farba_popis" name="farba_popis" value={farbaPopis} onChange={(e) => setFarbaPopis(e.target.value)} />
        {state.errors?.farba_popis && <p className="text-red-500 text-xs">{state.errors.farba_popis}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ean">EAN kód</Label>
        <Input id="ean" name="ean" value={ean} onChange={(e) => setEan(e.target.value)} />
        {state.errors?.ean && <p className="text-red-500 text-xs">{state.errors.ean}</p>}
      </div>

      <SubmitButton isEditing={isEditing} />

      {state.message && <p className="text-red-500 text-sm">{state.message}</p>}
    </form>
  );
}
