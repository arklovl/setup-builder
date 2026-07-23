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

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow">
        {/* الصندوق الرئيسي */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-neutral-950 border border-neutral-900 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/30">
          {/* الجزء الأيمن: الصورة */}
          <div className="flex flex-col">
            {/* زر العودة (داخل الصندوق) */}
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

          {/* الجزء الأيسر: التفاصيل */}
          <div className="flex flex-col pt-12">
            <span className="text-sm text-blue-400 uppercase font-mono tracking-widest">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-3 mb-6 tracking-tight">{product.name}</h1>
            <p className="text-3xl font-semibold text-green-400 font-mono mb-8 tabular-nums">
              {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
            </p>
            
            {/* الوصف النصي */}
            <div className="space-y-6 text-gray-300 text-base leading-relaxed mb-12 border-y border-neutral-900 py-8">
              <h4 className='font-bold text-white text-lg'>وصف المنتج</h4>
              <p className="text-gray-300 text-base leading-relaxed text-justify">
                قطعة أداء احترافية فائقة متوفرة الآن حصرياً في متجر Setup Builder. تم اختيارها بعناية لتعزيز قدرات جهازك المكتبي بأفضل جودة وأداء استثنائي يضمن لك تجربة لعب وعمل لا مثيل لها.
              </p>
              <p className="text-gray-300 text-base leading-relaxed text-justify">
                متوافقة مع أحدث إصدارات اللوحات الأم وتدعم تقنيات الـ Ray Tracing و DLSS لأداء جرافيكي مذهل. اطلبها الآن واستفد من ضمان الجودة وسرعة التوصيل.
              </p>
            </div>

            {/* الأزرار */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
               <button className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors text-sm flex items-center justify-center group">
                  <span className='mr-3'>🛒</span>
                  <span>إضافة إلى السلة</span>
                </button>
                <Link
                  href="/"
                  className="w-full py-4 bg-neutral-800 text-white text-center font-semibold rounded-xl hover:bg-neutral-700 transition-colors text-sm"
                >
                  متابعة التسوق
                </Link>
            </div>
          </div>
        </div>
        
        {/* قسم المنتجات المقترحة (مثال توضيحي - يمكن إزالته أو ملؤه ببيانات حقيقية لاحقاً) */}
        <div className="mt-16 border-t border-neutral-900 pt-12">
           <h3 className='text-2xl font-bold mb-8 text-center'>قد يعجبك أيضاً</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
               {/* هنا يمكنك جلب 4 منتجات عشوائية وعرضها */}
                <div className='bg-neutral-950 p-4 rounded-xl border border-neutral-900 h-40'></div>
                <div className='bg-neutral-950 p-4 rounded-xl border border-neutral-900'></div>
                <div className='bg-neutral-950 p-4 rounded-xl border border-neutral-900'></div>
                <div className='bg-neutral-950 p-4 rounded-xl border border-neutral-900'></div>
            </div>
        </div>
      </div>
      
      {/* الفوتر السفلي */}
      <footer className="mt-16 text-center py-6 border-t border-neutral-900">
          <p className="text-xs text-neutral-500 font-mono mb-2">
            © 2026 SETUP BUILDER. ALL RIGHTS RESERVED.
          </p>
          <p className="text-xs text-neutral-600 font-mono">
             POWERED BY NEXT.JS & SUPABASE.
          </p>
      </footer>
    </main>
  );
}
