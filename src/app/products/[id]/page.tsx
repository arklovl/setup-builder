import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  // 1. جلب بيانات المنتج الأساسي
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-3">المنتج غير موجود</h1>
        <p className="text-gray-400 mb-8 text-sm font-mono">لم نتمكن من العثور على هذا المنتج في قاعدة البيانات.</p>
        <Link href="/" className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-gray-800 rounded-xl text-sm transition-colors">
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  // 2. جلب أسعار المتاجر الخاصة بهذا المنتج وترتيبها من الأرخص للأغلى
  const { data: storesPrices } = await supabase
    .from('product_prices')
    .select('*')
    .eq('product_id', productId)
    .order('price', { ascending: true }); // الترتيب من الأرخص للأغلى تلقائياً

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">
        
        {/* الصندوق الرئيسي للمنتج */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/30">
          
          {/* الصورة */}
          <div className="flex flex-col">
            <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-6 transition-colors font-medium group w-fit">
              <span className="mr-2 group-hover:mr-3 transition-all">←</span> العودة
            </Link>
            
            <div className="aspect-square bg-black border border-neutral-900 rounded-2xl flex items-center justify-center overflow-hidden p-4">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-neutral-700 text-base font-mono">لا توجد صورة</span>
              )}
            </div>
          </div>

          {/* التفاصيل */}
          <div className="flex flex-col pt-12">
            <span className="text-sm text-blue-400 uppercase font-mono tracking-widest">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6 tracking-tight">{product.name}</h1>
            
            <div className="space-y-6 text-gray-300 text-base leading-relaxed mb-8 border-y border-neutral-900 py-8">
              <h4 className='font-bold text-white text-lg'>وصف المنتج</h4>
              <p className="text-gray-300 text-base leading-relaxed text-justify">
                {product.description || "قطعة أداء احترافية فائقة متوفرة الآن مقارنة الأسعار فيها لتجد أرخص سعر في السوق السعودي."}
              </p>
            </div>

            {/* الأزرار */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
               <button className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center justify-center">
                  <span className='mr-2'>🔔</span> تتبع انخفاض السعر
                </button>
                <Link
                  href="/"
                  className="w-full py-4 bg-neutral-800 text-white text-center font-semibold rounded-xl hover:bg-neutral-700 transition-colors text-sm flex items-center justify-center"
                >
                  متابعة التسوق
                </Link>
            </div>
          </div>
        </div>

        {/* قسم مقارنة الأسعار بين المتاجر (الأرخص أولاً) */}
        <div className="mt-16 bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className='text-2xl font-bold'>مقارنة الأسعار في المتاجر</h3>
            <span className="text-xs text-green-400 font-mono bg-green-950/40 border border-green-900/50 px-3 py-1.5 rounded-full">
              مترتبة من الأرخص للأغلى 📉
            </span>
          </div>

          {storesPrices && storesPrices.length > 0 ? (
            <div className="space-y-4">
              {storesPrices.map((store, index) => (
                <div 
                  key={store.id} 
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                    index === 0 
                      ? 'bg-neutral-900/90 border-green-500/50 shadow-lg shadow-green-950/20' 
                      : 'bg-black/40 border-neutral-900 hover:border-neutral-800'
                  }`}
                >
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      index === 0 ? 'bg-green-500 text-black' : 'bg-neutral-800 text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-lg text-white flex items-center gap-2">
                        {store.store_name}
                        {index === 0 && (
                          <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-md font-sans">
                            السعر الأفضل 🔥
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">متوفر وجاهز للشحن</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 space-x-reverse">
                    <span className="text-2xl font-bold font-mono text-green-400">
                      ${store.price}
                    </span>
                    <a
                      href={store.store_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        index === 0
                          ? 'bg-green-500 text-black hover:bg-green-400'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700'
                      }`}
                    >
                      اذهب للمتجر ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 font-mono text-sm border border-dashed border-neutral-800 rounded-2xl">
              لم يتم إقرار متاجر لهذا المنتج بعد. (أضف أسعار في جدول product_prices في Supabase لتظهر هنا)
            </div>
          )}
        </div>

      </div>
      
      <footer className="mt-16 text-center py-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500 font-mono mb-2">
            © 2026 SETUP BUILDER. ALL RIGHTS RESERVED.
          </p>
      </footer>
    </main>
  );
}
