const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function groupThousands(n) {
  return String(Math.trunc(Math.abs(Number(n)))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatRupiah(n) {
  const num = Number(n) || 0;
  return `${num < 0 ? '-' : ''}Rp${groupThousands(num)}`;
}

export function formatOrderNumber(id) {
  return `#ORD-${String(id).padStart(4, '0')}`;
}

export function formatDate(date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta', day: 'numeric', month: 'numeric', year: 'numeric',
  }).formatToParts(new Date(date));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  return `${get('day')} ${BULAN[get('month') - 1]} ${get('year')}`;
}

export function imageUrl(name) {
  return name ? `/api/images/${name}` : null;
}

export { groupThousands };

// "Dewi Lestari" -> "DL": huruf pertama kata awal dan kata akhir.
export function initials(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)[0] : '')).toUpperCase() || '?';
}

// Tautan WhatsApp dari nomor HP Indonesia: 08xx / 62xx / +62xx -> https://wa.me/628xx. Selain itu null.
export function waLink(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  const intl = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return /^628\d{7,12}$/.test(intl) ? `https://wa.me/${intl}` : null;
}
