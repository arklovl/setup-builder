export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div style={{ background: 'black', color: 'white', minHeight: '100vh', padding: '50px', fontSize: '30px' }}>
      <h1>أهلاً بك! رقم المنتج هو: {resolvedParams.id}</h1>
    </div>
  );
}
