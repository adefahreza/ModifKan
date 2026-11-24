// Semua ikon kategori adalah PNG di public/icons/kategori. Dipakai sebagai mask + bg-current supaya
// warnanya mengikuti warna teks (merah di grid kategori, putih di badge gelap, abu-abu di placeholder).
const ICONS = {
  "Mesin": "mesin",
  "Kaki-kaki & Rem": "kaki-kaki-rem",
  "Velg & Ban": "velg-ban",
  "Knalpot": "knalpot",
  "Body Kit & Eksterior": "body-kit-eksterior",
  "Interior": "interior",
  "Lampu & Kelistrikan": "lampu-kelistrikan",
  "Oli & Perawatan": "oli-perawatan",
  "Aksesoris": "aksesoris",
};

// Kategori baru buatan admin yang tidak ada di daftar memakai ikon "lainnya" (kunci pas).
export default function CategoryIcon({ name, size = 20, className = "" }) {
  const url = `url(/icons/kategori/${ICONS[name] ?? "lainnya"}.png)`;
  return (
    <span aria-hidden="true" className={`inline-block shrink-0 bg-current ${className}`}
      style={{ width: size, height: size, maskImage: url, WebkitMaskImage: url, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} />
  );
}
