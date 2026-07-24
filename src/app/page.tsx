'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  name: string
  category: string
  price: number | string
  currency?: string
}

const QUICK_TAGS = ['GPUs', 'Mice', 'Keyboards', 'Monitors', 'Audio']

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [user, setUser] = useState<any>(null)

  // جلب المستخدم وحالة الجلسة
  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  // جلب البيانات من Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')

      if (error) {
        console.error('Error fetching products from Supabase:', error)
      } else {
        setProducts(data || [])
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  // الفلترة حسب البحث
  const filteredProducts = query.trim() === '' 
  ? [] 
  : products.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.name.includes(query)
    )

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 bg-[#0a0a0a] overflow-hidden relative">
      
      {/* 1. Nav Bar (الهيدر العلوي المتناسق) */}
      <header className="w-full max-w-5xl flex items-center justify-between z-20 py-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase font-mono">
            BRIEF
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/favorites')} 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
          >
            المفضلة ♡
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">{user.email}</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-red-400 bg-neutral-900 hover:bg-neutral-800 border border-gray-800 px-3.5 py-1.5 rounded-full transition-all duration-200"
              >
                تسجيل الخروج
              </button>
            </div>
          ) : (
            <button 
              onClick={() => router.push('/login')} 
              className="text-xs text-white bg-neutral-900 hover:bg-neutral-800 border border-gray-800 px-3.5 py-1.5 rounded-full transition-all duration-200"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      </header>

      {/* 2. المحتوى الرئيسي في المنتصف */}
      <div className="relative w-full max-w-2xl flex flex-col items-center z-10 my-auto">

        {/* العنوان والوصف */}
        <div className={`text-center mb-8 transition-opacity duration-300 ${isFocused ? 'opacity-40' : 'opacity-100'}`}>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-white uppercase mb-3 font-mono">
            BRIEF
          </h1>
          <p className="text-gray-300 text-sm sm:text-base tracking-wide font-normal">
            ابحث عن أفضل القطع بأرخص سعر موجود في السوق
          </p>
        </div>

        {/* شريط البحث مع الحدود البيضاء الواضحة */}
        <div className="relative w-full">
          {isFocused && (
            <>
              <div className="absolute -inset-[2px] rounded-lg overflow-hidden p-[2px] blur-sm opacity-80 transition-all duration-500">
                <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0_240deg,#fff_360deg)] animate-[spin_3s_linear_infinite]" />
              </div>

              <div className="absolute -inset-[1.5px] rounded-lg overflow-hidden p-[1.5px] transition-all duration-500">
                <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0_240deg,#ffffff_360deg)] animate-[spin_3s_linear_infinite]" />
              </div>
            </>
          )}

          <div className="relative bg-[#111111] rounded-lg flex items-center border border-white/80 hover:border-white transition-colors duration-300">
            <svg 
              className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="وش تفكر فيه اليوم؟"
              className="w-full text-base sm:text-lg pl-12 pr-16 py-3.5 bg-transparent text-gray-100 placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-0 transition-all duration-300 dir-auto"
            />

            <span className="absolute right-4 text-xs font-mono text-gray-400 bg-neutral-900 border border-white/20 px-2 py-1 rounded">
              ⌘K
            </span>

          </div>

          {/* قائمة النتائج الساحبة من Supabase */}
          {filteredProducts.length > 0 && (
            <div className="absolute left-0 right-0 mt-3 bg-[#121212] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-900 border-b border-white/10 last:border-0 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-gray-200 font-medium text-sm">{product.name}</div>
                    <div className="text-gray-500 text-xs uppercase font-mono">{product.category}</div>
                  </div>
                  <div className="text-gray-400 text-sm font-mono">
                    {typeof product.price === 'number' ? `$${product.price}` : product.price}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* حالة التحميل */}
          {loading && query.trim() !== '' && (
            <div className="absolute left-0 right-0 mt-3 bg-[#121212] border border-white/20 rounded-lg p-4 text-center text-gray-500 text-sm z-50 font-mono">
              جاري البحث في قاعدة البيانات...
            </div>
          )}

          {/* رسالة عند عدم وجود نتائج */}
          {!loading && query.trim() !== '' && filteredProducts.length === 0 && (
            <div className="absolute left-0 right-0 mt-3 bg-[#121212] border border-white/20 rounded-lg p-4 text-center text-gray-500 text-sm z-50">
              No gear found for "{query}"
            </div>
          )}
        </div>

        {/* الفلاتر السريعة */}
        <div className={`flex flex-wrap items-center justify-center gap-2 mt-5 dir-rtl transition-opacity duration-300 ${isFocused ? 'opacity-40' : 'opacity-100'}`}>
          <span className="text-xs text-gray-500 ml-1 font-medium">مقترحات:</span>
          <div className="flex flex-wrap gap-2 dir-ltr">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-xs text-gray-400 hover:text-white bg-[#121212] hover:bg-neutral-900 border border-gray-800 px-3 py-1.5 rounded-full transition-all duration-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Footer (فوتر سفلي) */}
      <footer className="w-full max-w-5xl flex items-center justify-between z-20 py-2 border-t border-neutral-900/50">
        <span className="text-[11px] text-gray-600 font-mono tracking-widest">
          © 2026 BRIEF. ALL RIGHTS RESERVED.
        </span>
        <div className="flex gap-4 text-[11px] text-gray-600">
          <a href="#" className="hover:text-gray-400 transition-colors">عن الموقع</a>
          <a href="#" className="hover:text-gray-400 transition-colors">الخصوصية</a>
        </div>
      </footer>

    </main>
  )
}
