'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function FavoriteButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkFav() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('product_id', productId)
          .single();
        
        if (data) setIsFavorite(true);
      }
    }
    checkFav();
  }, [productId]);

  const toggleFavorite = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) setIsFavorite(false);
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });

      if (!error) setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl border transition-all duration-200 active:scale-95 cursor-pointer ${
        isFavorite 
          ? 'bg-red-950/60 border-red-800/80 text-red-400 hover:bg-red-900/60 shadow-lg shadow-red-950/30' 
          : 'bg-neutral-900/80 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
      }`}
      title="إضافة/إزالة من المفضلة"
    >
      <span className="text-base select-none">{isFavorite ? '♥' : '♡'}</span>
      <span>{isFavorite ? 'في المفضلة' : 'إضافة للمفضلة'}</span>
    </button>
  );
}
