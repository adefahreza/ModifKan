export const ORDER_STATUSES = ['menunggu_pembayaran', 'diproses', 'dikirim', 'selesai', 'dibatalkan'];

export const STATUS_LABELS = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  diproses: 'Diproses',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export function isOrderStatus(value) {
  return ORDER_STATUSES.includes(value);
}

export const ORDER_ACTIONS = {
  konfirmasi: { from: 'menunggu_pembayaran', to: 'diproses', actors: ['seller'], label: 'Konfirmasi → Diproses' },
  kirim: { from: 'diproses', to: 'dikirim', actors: ['seller'], label: 'Tandai Dikirim' },
  terima: { from: 'dikirim', to: 'selesai', actors: ['buyer'], label: 'Pesanan Diterima' },
  batalkan: { from: 'menunggu_pembayaran', to: 'dibatalkan', actors: ['seller', 'buyer'], label: 'Batalkan' },
};

export const TIMELINE_STEPS = ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'];

export function availableActions(status, actor) {
  return Object.entries(ORDER_ACTIONS)
    .filter(([, a]) => a.from === status && a.actors.includes(actor))
    .map(([name]) => name);
}

export function resolveTransition(action, actor) {
  const a = Object.hasOwn(ORDER_ACTIONS, action) ? ORDER_ACTIONS[action] : null;
  if (!a || !a.actors.includes(actor)) return null;
  return { from: a.from, to: a.to };
}

export function timelineIndex(status) {
  if (status === 'dibatalkan') return -1;
  return ['menunggu_pembayaran', 'diproses', 'dikirim', 'selesai'].indexOf(status);
}
