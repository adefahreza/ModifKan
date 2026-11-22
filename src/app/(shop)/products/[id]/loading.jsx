import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div role="status" aria-busy="true" className="grid gap-6 lg:grid-cols-12">
      <span className="sr-only">Memuat…</span>
      <Skeleton className="aspect-square lg:col-span-4" />
      <div className="space-y-3 lg:col-span-5">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
      <Skeleton className="h-48 lg:col-span-3" />
    </div>
  );
}
