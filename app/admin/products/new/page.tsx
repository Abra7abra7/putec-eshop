import ProductForm from '../_components/product-form';

export default function NewProductPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Pridať nový produkt</h1>
      </div>
      <ProductForm />
    </div>
  );
}
