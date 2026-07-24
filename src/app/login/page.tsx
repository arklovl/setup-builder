'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setErrorMsg(error.message)
      } else {
        alert('تم إنشاء الحساب بنجاح!')
        router.push('/')
        router.refresh()
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      } else {
        router.push('/')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 selection:bg-white selection:text-black">
      <div className="w-full max-w-md bg-neutral-900/60 border border-neutral-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono tracking-widest text-xs font-bold text-neutral-300">BRIEF</span>
          </div>
          <Link href="/" className="text-xs font-mono text-neutral-400 hover:text-white transition-colors">
            العودة للرئيسية ←
          </Link>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">
            {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            {isSignUp ? 'سجل لكي تتمكن من تتبع الأسعار' : 'أدخل بياناتك للمتابعة في موقع BRIEF'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-400 font-mono text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">البريد الإلكتروني</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-400">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'جاري التنفيذ...' : (isSignUp ? 'إنشاء الحساب' : 'دخول')}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-mono text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
          >
            {isSignUp ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
          </button>
        </div>

      </div>
    </main>
  )
}
