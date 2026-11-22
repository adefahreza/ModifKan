import Skeleton, { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-56" />
      <ProductGridSkeleton count={10} />
    </div>
  );
}
