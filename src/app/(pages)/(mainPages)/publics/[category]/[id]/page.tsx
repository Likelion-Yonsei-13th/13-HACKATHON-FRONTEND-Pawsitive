export default async function PublicsDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">공공 데이터 상세</h2>
      <p>category: {decodeURIComponent(category)}</p>
      <p>id: {id}</p>
    </div>
  );
}
