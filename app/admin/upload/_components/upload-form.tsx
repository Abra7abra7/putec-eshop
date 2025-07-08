'use client';

import { useState, useTransition } from 'react';
import { handleImageUpload } from '../_actions/uploadActions';

interface Product {
  id: string;
  name: string;
}

interface UploadFormProps {
  products: Product[];
}

export default function UploadForm({ products }: UploadFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('image') as File;

    if (!file || file.size === 0) {
      setMessage('Prosím, vyberte súbor.');
      return;
    }

    startTransition(async () => {
      const result = await handleImageUpload(formData);
      if (result.error) {
        setMessage(`Chyba: ${result.error}`);
      } else {
        setMessage(result.message || null);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
          Vyberte produkt
        </label>
        <select
          id="product"
          name="productId"
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Produktový obrázok
        </label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isPending ? 'Nahrávam...' : 'Nahrať obrázok'}
        </button>
      </div>

      {message && (
        <p
          className={`text-sm font-medium ${message.startsWith('Chyba') ? 'text-red-600' : 'text-green-600'}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
