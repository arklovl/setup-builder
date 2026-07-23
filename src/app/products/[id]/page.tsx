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

  // جلب المنتج مباشرة من Supabase في السيرفر
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">المنتج غير موجود</h1>
        <p className="text-gray-400 mb-6 text-sm font-mono">لم نتمكن من العثور على هذا المنتج في قاعدة البيانات.</p>
        <Link href="/" className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-gray-800 rounded-lg text-sm transition-colors">
          العودة للرئيسية
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full">
        {/* زر العودة */}
        <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors">
          ← العودة للرئيسية
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-neutral-950 border border-neutral-900 rounded-2xl p-6 md:p-8">
          {/* صورة المنتج */}
          <div className="aspect-square bg-black border border-neutral-900 rounded-xl flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-neutral-600 text-sm font-mono">لا توجد صورة</span>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-blue-400 uppercase font-mono tracking-wider">{product.category}</span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-green-400 font-mono mb-6">
                {typeof product.price === 'number' ? `$${product.price}` : product.price} {product.currency || ''}
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                قطعة أداء احترافية متوفرة الآن في متجر Setup Builder لتعزيز إعدادات جهازك المكتبي بأفضل جودة وأداء استثنائي.
              </p>
            </div>

            {/* الأزرار */}
            <div className="pt-4 border-t border-neutral-900">
              <Link
                href="/"
                className="block w-full py-3 bg-white text-black text-center font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                العودة للتسوق واختيار القطع
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-[11px] text-gray-600 font-mono">
        © 2026 SETUP BUILDER. ALL RIGHTS RESERVED.
      </div>
    </main>
  );
}
