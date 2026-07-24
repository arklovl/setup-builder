import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black flex flex-col justify-between p-4 md:p-10">
      
      {/* الهيدر العلوي */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-mono tracking-widest text-xs font-bold text-neutral-300">BRIEF</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
          <Link href="/favorites" className="hover:text-white transition-colors">♡ المفضلة</Link>
          <Link href="/login" className="hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">تسجيل الدخول</Link>
        </div>
      </header>

      {/* قسم البحث الرئيسي في المنتصف */}
      <div className="max-w-xl w-full mx-auto text-center space-y-6 my-auto">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            BRIEF
          </h1>
          <p className="text-neutral-400 text-sm font-mono">
            ابحث عن أفضل القطع بأرخص سعر موجود في السوق
          </p>
        </div>

        {/* خانة البحث */}
        <div className="relative">
          <div className="flex items-center bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-colors rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl">
            <span className="text-neutral-400 ml-3">🔍</span>
            <input 
              type="text" 
              placeholder="وش تفكر فيه اليوم؟" 
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-neutral-600 text-right font-mono"
            />
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded border border-neutral-700">⌘K</span>
          </div>
        </div>

        {/* الكلمات المقترحة */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-neutral-400 pt-2">
          <span className="text-neutral-600">:مقترحات</span>
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 cursor-pointer transition-colors">GPUs</span>
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 cursor-pointer transition-colors">Mice</span>
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 cursor-pointer transition-colors">Keyboards</span>
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 cursor-pointer transition-colors">Monitors</span>
          <span className="px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-neutral-700 cursor-pointer transition-colors">Audio</span>
        </div>
      </div>

      {/* الفوتر السفلي */}
      <footer className="max-w-5xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between py-6 border-t border-neutral-900 text-[11px] text-neutral-600 font-mono tracking-widest">
        <p>© 2026 BRIEF. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link href="/privacy" className="hover:text-neutral-400 transition-colors">الخصوصية</Link>
          <Link href="/about" className="hover:text-neutral-400 transition-colors">عن الموقع</Link>
        </div>
      </footer>

    </main>
  );
}
