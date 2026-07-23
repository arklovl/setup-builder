export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '50px', fontFamily: 'monospace' }}>
      <h1>صفحة المنتج اشتغلت بنجاح!</h1>
      <p style={{ fontSize: '24px', color: '#00ff00', marginTop: '20px' }}>
        الـ ID المستلم من الرابط هو: "{resolvedParams.id}"
      </p>
    </div>
  );
}
