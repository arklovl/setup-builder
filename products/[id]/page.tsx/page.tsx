import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (productError || !product) {
    notFound();
  }

  const { data: offers } = await supabase
    .from('product_offers')
    .select('*')
    .eq('product_id', id);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-64 h-64 object-cover rounded-xl bg-gray-900 shadow-lg border border-gray-800" 
          />
          <div className="space-y-3 text-center md:text-right">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              {product.description || "اختر المتجر المناسب لك واستعرض تفاصيل الشراء المتاحة لهذا المنتج."}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold border-b border-gray-800 pb-3">
            المتاجر التي توفر المنتج
          </h2>

          {offers && offers.length > 0 ? (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div 
                  key={offer.id} 
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800 gap-4"
                >
                  <div>
                    <span className="font-bold text-lg text-gray-200">{offer.store_name}</span>
                    {offer.price && (
                      <span className="block text-green-400 font-semibold mt-1">
                        {offer.price} ريال
                      </span>
                    )}
                  </div>
                  
                  <a 
                    href={offer.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
                  >
                    زيارة المتجر وشراء المنتج
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">لا توجد متاجر مضافة لهذا المنتج حالياً.</p>
          )}
        </div>
      </div>
    </main>
  );
}