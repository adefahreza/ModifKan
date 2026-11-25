import ProductImage from "@/components/shop/ProductImage";
import { imageUrl, initials } from "@/lib/format";

// Foto profil; tanpa foto atau gambar gagal dimuat, tampil inisial nama. alt="" untuk pemakaian dekoratif.
export default function UserAvatar({ name, avatar, alt = `Foto profil ${name}`, className = "", fallbackClassName = "" }) {
  return (
    <ProductImage src={imageUrl(avatar)} alt={alt} className={`object-cover ${className}`}
      fallback={<span className={`flex size-full items-center justify-center ${fallbackClassName}`}>{initials(name)}</span>} />
  );
}
