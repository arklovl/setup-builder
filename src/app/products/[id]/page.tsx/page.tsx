'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// إعداد اتصال Supabase (تأكد أن المفاتيح مطابقة للمشروع عندك أو استبدلها بمتغيرات البيئة)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  category: string;
  image_url: string | null;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">جاري تحميل تفاصيل المنتج...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">عذراً، المنتج غير موجود</h1>
        <p className="text-gray-400 mb-6">المنتج الذي تبحث عنه غير متوفر في قاعدة البيانات.</p>
        <Link href="/" className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* زر العودة */}
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          ← العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8">
          {/* صورة المنتج */}
          <div className="aspect-square bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-600 text-lg">لا توجد صورة</span>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-blue-400 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-green-400 mb-6">
                {product.price} {product.currency || 'USD'}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                قطعة أداء احترافية وممتازة تم اختيارها بعناية لتعزيز أداء جهازك المكتبي وتوفير أفضل تجربة استجابة وسرعة.
              </p>
            </div>

            {/* زر الشراء والكمية */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">الكمية:</span>
                <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                {added ? 'تمت الإضافة للسلة بنجاح! ✓' : 'إضافة إلى السلة'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
