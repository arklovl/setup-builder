'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Product {
  id: number
  name: string
  category: string
  price: number | string
}

export default function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    async function fetchFavorites() {
      setLoading(true)
      
      // 1. التحقق من حالة الجلسة (Session)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        router.push('/login')
        return
      }
      
      setUser(session.user)

      // 2. جلب المفضلة باستخدام العلاقة
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          products (
            id,
            name,
            category,
            price
          )
        `)
        .eq('user_id', session.user.id)

      if (error) {
        console.error('Error fetching favorites:', error)
      } else {
        // استخدام any لتفادي مشاكل وتطابقات الـ TypeScript الصارمة
        const formattedProducts = (data || []).map((item: any) => item.products).filter(Boolean)
        setFavorites(formattedProducts)
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [router])

  // دالة حذف من المفضلة
  const removeFavorite = async (productId: number) => {
    if (!user) return

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) {
      console.error('Error removing favorite:', error)
      alert('حدث خطأ أثناء الإزالة')
    } else {
      setFavorites(favorites.filter(item => item.id !== productId))
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-[#050505] text-white">
      {/* هيدر الصفحة */}
      <header className="w-full max-w-5xl flex items-center justify-between z-20 py-2 border-b border-neutral-900/50 mb-10">
        <div 
          onClick={() => router.push('/')}
          className="cursor-pointer flex items-center gap-2"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-gray-300 uppercase font-mono">
            BRIEF
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')} 
            className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
          >
            الرئيسية ←
          </button>
          {user && (
             <span className="text-xs text-gray-600 font-mono hidden sm:inline">{user.email}</span>
          )}
        </div>
      </header>

      {/* محتوى صفحة المفضلة */}
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider mb-8 font-mono text-white flex items-center gap-3">
          <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
          المفضلة المحفوظة
        </h1>

        {loading ? (
          <div className="text-center text-gray-500 py-12 font-mono text-sm animate-pulse">
            جاري تحميل المفضلة...
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-white/10 rounded-3xl bg-[#080808]">
            قائمة المفضلة لديك فارغة حالياً. ابحث عن قطع وأضفها بالضغط على أيقونة القلب ♡.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favorites.map((product) => (
              <div 
                key={product.id}
                className="flex items-center justify-between px-6 py-4 bg-[#080808] border border-white/10 rounded-2xl hover:border-white/20 transition-all"
              >
                <div 
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="cursor-pointer flex-1 min-w-0 pr-4"
                >
                  <div className="font-medium text-sm text-gray-100 truncate">{product.name}</div>
                  <div className="text-xs text-gray-500 uppercase font-mono mt-0.5">{product.category}</div>
                </div>
                
                <div className="flex items-center gap-5 shrink-0 pl-2">
                  <div className="text-sm font-mono text-gray-300 w-24 text-right">
                    {typeof product.price === 'number' ? `$${product.price}` : product.price}
                  </div>
                  <button 
                    onClick={() => removeFavorite(product.id)}
                    className="text-xs text-red-400 hover:text-red-200 px-4 py-1.5 rounded-xl bg-neutral-900/50 border border-neutral-800 transition-all hover:border-red-900/50 active:scale-95"
                  >
                    إزالة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
