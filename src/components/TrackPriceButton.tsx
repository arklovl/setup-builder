'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function TrackPriceButton({ productId }: { productId: string | number }) {
  const [isTracking, setIsTracking] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkTracking() {
      const { data: { session } ) = await supabase.auth.getSession()
      if (!session) return

      const { data } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('product_id', productId)
        .single()

      if (data) setIsTracking(true)
    }
    checkTracking()
  }, [productId])

  const handleToggleTrack = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    if (isTracking) {
      await supabase
        .from('price_alerts')
        .delete()
        .eq('user_id', session.user.id)
        .eq('product_id', productId)
      setIsTracking(false)
    } else {
      await supabase
        .from('price_alerts')
        .insert([{ user_id: session.user.id, product_id: productId }])
      setIsTracking(true)
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleToggleTrack}
      disabled={loading}
      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
        isTracking 
          ? 'bg-green-600/20 text-green-400 border-green-500/40' 
          : 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
      }`}
    >
      <span>{isTracking ? '✓' : '🔔'}</span>
      <span>{isTracking ? 'جاري تتبع الأسعار' : 'تتبع انخفاض الأسعار'}</span>
    </button>
  )
}
