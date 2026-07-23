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
      <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-3">المنتج غير موجود</h1>
        <p className="text-neutral-400 mb-8 text-sm font-mono">لم نتمكن من العثور على هذا المنتج في قاعدة البيانات.</p>
        <Link href="/" className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-sm transition-colors">
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  // 2. جلب أسعار المتاجر وترتيبها من الأرخص للأغلى
  const { data: storesPrices } = await supabase
    .from('product_prices')
    .select('*')
    .eq('product_id', productId)
    .order('price', { ascending: true });

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black p-4 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* زر العودة */}
        <div>
          <Link href="/" className="inline-flex items-center text-xs font-mono text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-lg group">
            <span className="ml-2 group-hover:-translate-x-1 transition-transform">→</span> العودة للمنتجات
          </Link>
        </div>

        {/* كارت المنتج الرئيسي */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* صورة المنتج */}
          <div className="md:col-span-5 aspect-square bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-contain drop-shadow-2xl" />
            ) : (
              <span className="text-neutral-600 text-xs font-mono">لا توجد صورة</span>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center space-x-2 space-x-reverse w-fit">
              <span className="px-3 py-1 bg-neutral-800/80 border border-neutral-700 text-neutral-300 text-xs font-mono rounded-full uppercase tracking-wider">
                {product.category || 'HARDWARE'}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {product.name}
            </h1>
            
            <p className="text-neutral-400 text-sm leading-relaxed text-justify">
              {product.description || "قطعة أداء احترافية متوفرة في السوق السعودي. قارن الأسعار أدناه لتجد العرض الأنسب لجهازك."}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button className="px-5 py-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700 transition-all flex items-center gap-2">
                <span>🔔</span> تتبع انخفاض السعر
              </button>
            </div>
          </div>
        </div>

        {/* قسم جدول الأسعار الاحترافي */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
            <div>
              <h3 className='text-xl font-bold tracking-tight'>عروض المتاجر</h3>
              <p className="text-xs text-neutral-400 font-mono mt-1">مقارنة لحظية لأفضل الأسعار المتاحة بالسوق</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-mono bg-neutral-800/80 border border-neutral-700 px-3 py-1.5 rounded-lg w-fit">
              <span>📉</span> مرتبة تنازلياً من الأرخص
            </span>
          </div>

          {storesPrices && storesPrices.length > 0 ? (
            <div className="space-y-3">
              {storesPrices.map((store, index) => (
                <div 
                  key={store.id} 
                  className={`group relative flex items-center justify-between px-5 py-4 rounded-2xl border transition-all gap-4 ${
                    index === 0 
                      ? 'bg-neutral-900 border-white/40 shadow-xl shadow-black/50' 
                      : 'bg-neutral-950/50 border-neutral-800/70 hover:border-neutral-700'
                  }`}
                >
                  {/* معلومات المتجر: ترتيب مباشر وثابت بدون عكس */}
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white tracking-wide">{store.store_name}</span>
                        {index === 0 && (
                          <span className="text-[10px] bg-white text-black font-extrabold px-2 py-0.5 rounded shadow-sm">
                            🔥 الأرخص
                          </span>
                        )}
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          index === 0 ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono mt-0.5 block">متوفر للشحن السريع</span>
                    </div>
                  </div>

                  {/* السعر وزر الشراء */}
                  <div className="flex items-center space-x-6 space-x-reverse">
                    <div className="text-left sm:text-right font-mono">
                      <span className="text-2xl font-black text-white tracking-tight">
                        {store.price}
                      </span>
                      <span className="text-xs font-semibold text-neutral-400 uppercase mr-1.5">ر.س</span>
                    </div>

                    <a
                      href={store.store_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        index === 0
                          ? 'bg-white text-black hover:bg-neutral-200 active:scale-95'
                          : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700 active:scale-95'
                      }`}
                    >
                      <span>زيارة المتجر</span>
                      <span className="font-mono text-xs">↗</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/30">
              لا توجد أسعار مسجلة لهذا المنتج حالياً. أضف روابط المتاجر والأسعار من لوحة تحكم Supabase.
            </div>
          )}
        </div>

      </div>
      
      <footer className="mt-20 text-center py-6 border-t border-neutral-900">
        <p className="text-[11px] text-neutral-600 font-mono tracking-widest uppercase">
          © 2026 SETUP BUILDER. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </main>
  );
}
