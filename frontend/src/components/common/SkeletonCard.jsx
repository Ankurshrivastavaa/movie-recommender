export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-dark-700">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-3 skeleton rounded-md w-4/5" />
        <div className="h-2.5 skeleton rounded-md w-2/5" />
      </div>
    </div>
  );
}
