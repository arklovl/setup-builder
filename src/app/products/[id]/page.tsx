'use client';

import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TrackPriceButton '@/components/TrackPriceButton';
import Navbar from '@/components/Navbar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: PageProps) {
  const router = useRouter();
  const [productId, setProductId] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [storesPrices, setStoresPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setProductId(id);

      // 1. التحقق من المستخدم الحالي
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // التحقق هل المنتج في المفضلة مسبقاً
        const { data: favData } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('product_id', id)
          .single();
        
        if (favData) setIsFavorite(true);
      }

      // 2. جلب بيانات المنتج الأساسي
      const { data: prodData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !prodData) {
        setProduct(null);
        setLoading(false);
        return;
      }
      setProduct(prodData);

      // 3. جلب أسعار المتاجر وترتيبها من الأرخص للأغلى
      const { data: pricesData } = await supabase
        .from('product_prices')
        .select('*')
        .eq('product_id', id)
        .order('price', { ascending: true });

      setStoresPrices(pricesData || []);
      setLoading(false);
    }

    loadData();
  }, [params]);

  // دالة تبديل المفضلة (إضافة / إزالة)
  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isFavorite) {
      // إزالة من المفضلة
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        setIsFavorite(false);
      }
    } else {
      // إضافة للمفضلة
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });

      if (!error) {
        setIsFavorite(true);
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-mono text-sm">
        جاري التحميل...
      </main>
    );
  }

  if (!product) {
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

  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black p-4 md:p-10">
      
      {/* الهيدر العلوي */}
      <Navbar />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* زر العودة */}
        <div>
          <Link href="/" className="inline-flex items-center text-xs font-mono text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 border border-neutral-800 px-4 py-2 rounded-lg group">
            <span className="ml-2 group-hover:-translate-x-1 transition-transform">→</span> العودة للمنتجات
          </Link>
        </div>

        {/* كارت المنتج الرئيسي */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-5 aspect-square bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <span className="text-neutral-600 text-xs font-mono">لا توجد صورة</span>
            )}
          </div>

          <div className="md:col-span-7 flex flex-col justify-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-neutral-800/80 border border-neutral-700 text-neutral-300 text-xs font-mono rounded-full uppercase tracking-wider">
                {product.category || 'GPU'}
              </span>

              {/* زر المفضلة (القلب) بجانب الفئة */}
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl border transition-all ${
                  isFavorite 
                    ? 'bg-red-950/40 border-red-900/60 text-red-400' 
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
                title="إضافة/إزالة من المفضلة"
              >
                <span className="text-base">{isFavorite ? '♥' : '♡'}</span>
                <span>{isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}</span>
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              {product.name}
            </h1>
          </div>
        </div>

        {/* قسم جدول الأسعار */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold tracking-tight">عروض المتاجر</h3>
              <TrackPriceButton productId={product.id} />
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
                  className={`group relative flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 rounded-2xl border transition-all gap-4 ${
                    index === 0 
                      ? 'bg-neutral-900/90 border-white/60 shadow-2xl shadow-white/5 ring-1 ring-white/30' 
                      : 'bg-neutral-950/50 border-neutral-800/70 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          index === 0 ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="font-bold text-base text-white tracking-wide">
                          {store.store_name}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono mt-0.5 block">
                        متوفر للشحن السريع
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6 space-x-reverse shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-800">
                    
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-2xl font-black text-white tracking-tight">
                        {store.price}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">ر.س</span>
                    </div>

                    <a
                      href={store.store_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                        index === 0
                          ? 'bg-white text-black hover:bg-neutral-200 active:scale-95 shadow-lg shadow-white/10'
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
              لا توجد أسعار مسجلة لهذا المنتج حالياً.
            </div>
          )}
        </div>

      </div>
      
      <footer className="mt-20 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between py-6 border-t border-neutral-900 text-[11px] text-neutral-600 font-mono tracking-widest">
        <p>© 2026 BRIEF. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:text-neutral-400 transition-colors">الخصوصية</Link>
          <Link href="/about" className="hover:text-neutral-400 transition-colors">عن الموقع</Link>
        </div>
      </footer>
    </main>
  );
}
