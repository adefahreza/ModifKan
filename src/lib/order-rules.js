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
