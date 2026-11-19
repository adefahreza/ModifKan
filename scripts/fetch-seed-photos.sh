#!/usr/bin/env bash
# Mengunduh foto seed dari Unsplash (design.md §6) lalu mengubahnya ke WebP ±800px.
# Pakai: bash scripts/fetch-seed-photos.sh  (dijalankan dari root proyek, butuh sips dan cwebp)
set -euo pipefail

OUT="uploads/seed"
TMP="$(mktemp -d)"
mkdir -p "$OUT"

PHOTOS="
1-1 photo-1725289339928-06ee31684df5
1-2 photo-1527383418406-f85a3b146499
1-6 photo-1591879742348-13012c2963bf
2-1 photo-1760836395716-7dd00b71311a
2-3 photo-1760317890322-364a810cd4da
2-5 photo-1696494561430-de087dd0bd69
3-3 photo-1594500067118-456bba17ba14
3-5 photo-1770750942596-be791b5d0ffe
3-6 photo-1791147129664-da2e4c4d24e7
3-8 photo-1573939843624-b22996c1a31c
4-1 photo-1760821388066-a7c910bc39bd
4-2 photo-1692309175422-b9d614f4764e
5-3 photo-1776400995983-c08c8cdb5f3c
5-5 photo-1685914375066-02f02003fae5
6-1 photo-1779263449928-575a82e73c53
6-2 photo-1790343072355-7fd1047f0b1b
6-5 photo-1772903848899-352531ff0288
7-1 photo-1542282088-fe8426682b8f
7-2 photo-1556448851-9359658faa54
7-4 photo-1598586958772-8bf368215c2a
8-1 photo-1590227763209-821c686b932f
8-5 photo-1771581136070-5322586211d6
9-1 photo-1783078909671-485d6bb1dd8a
9-4 photo-1772903789023-370243b27258
10-3 photo-1615906655593-ad0386982a0f
10-4 photo-1771340012319-0b4fca008b54
10-6 photo-1551522435-b2347f669045
"

echo "$PHOTOS" | while read -r kode id; do
  [ -z "${kode:-}" ] && continue
  curl -fL --silent --show-error "https://images.unsplash.com/${id}?w=800&q=80&fm=jpg" -o "$TMP/${kode}.jpg"
  sips -Z 800 "$TMP/${kode}.jpg" --out "$TMP/${kode}-s.jpg" >/dev/null
  # sips tidak bisa menulis WebP di macOS; pakai cwebp (brew install webp)
  cwebp -quiet -q 80 "$TMP/${kode}-s.jpg" -o "$OUT/${kode}.webp"
  echo "OK ${kode}"
done

rm -rf "$TMP"
echo "Selesai: $(ls "$OUT"/*.webp | wc -l | tr -d ' ') file di $OUT"
