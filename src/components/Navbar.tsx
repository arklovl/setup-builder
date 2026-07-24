'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }
    getUser()

    // الاستماع لأي تغيير في حالة تسجيل الدخول (دخول أو خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  return (
    <header className="max-w-5xl mx-auto flex items-center justify-between pb-6 mb-4 border-b border-neutral-900">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <Link href="/" className="font-mono tracking-widest text-xs font-bold text-neutral-300">BRIEF</Link>
      </div>
      <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
        <Link href="/favorites" className="hover:text-white transition-colors">♡ المفضلة</Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-neutral-300 hidden sm:inline">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-red-400"
            >
              تسجيل الخروج
            </button>
          </div>
        ) : (
          <Link href="/login" className="hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
            تسجيل الدخول
          </Link>
        )}
      </div>
    </header>
  )
}
