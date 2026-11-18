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
