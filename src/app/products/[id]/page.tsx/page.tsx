'use client';

import { use, useState } from 'react';
import Link from 'next/link';

// قائمة المنتجات المؤقتة (تأكد أنها متطابقة مع الرئيسية)
const productsData: Record<string, { name: string; price: number; category: string; description: string; specs: string[] }> = {
  '1': {
    name: 'معالج احترافي Core i7',
    price: 1450,
    category: 'قطع الغيار',
    description: 'معالج أداء عالي مخصص للألعاب الثقيلة وبرامج المونتاج والتصميم الهندسي.',
    specs: ['الجيل الرابع عشر', 'سرعة تصل إلى 5.0 GHz', 'استهلاك طاقة متوازن']
  },
  '2': {
    name: 'كرت شاشة RTX 4080',
    price: 4200,
    category: 'كرت الشاشة',
    description: 'أداء خارق لتشغيل أحدث الألعاب بدقة 4K مع تقنيات تتبع الرسوميات المتقدمة.',
    specs: ['ذاكرة 16GB GDDR6X', 'دعم تقنية DLSS 3', 'تبريد ثلاثي متطور']
  },
  '3': {
    name: 'لوحة أم للالعاب Z790',
    price: 1100,
    category: 'اللوحة الأم',
    description: 'لوحة أم احترافية تدعم كبريات المعגלات وتمنحك استقراراً كاملاً أثناء كسر السرعة.',
    specs: ['دعم DDR5', 'منافذ M.2 متعددة للسرعة العالية', 'إضاءة RGB مخصصة']
  },
  '4': {
    name: 'ذاكرة عشوائية 32GB RAM',
    price: 450,
    category: 'الذاكرة',
    description: 'رامات سرعة عالية لتعدد المهام بسلاسة فائقة بدون أي تعليق.',
    specs: ['سرعة 6000MHz', 'توقيتات ممتازة للاستجابة السريعة', 'هيت سينك لتشتيت الحرارة']
  }
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const product = productsData[productId];

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">عذراً، المنتج غير موجود</h1>
        <p className="text-gray-400 mb-6">المنتج الذي تبحث عنه غير متوفر أو تم حذفه.</p>
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
          {/* صورة وهمية للمنتج */}
          <div className="aspect-square bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-center">
            <span className="text-neutral-600 text-lg">صورة المنتج</span>
          </div>

          {/* تفاصيل المنتج */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs text-blue-400 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-green-400 mb-6">{product.price} ر.س</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">{product.description}</p>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">المميزات الرئيسية:</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                  {product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
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
