export const TOAST_EVENT = 'modifkan:toast';

// Memicu toast dari aksi klien tanpa redirect (isi dari toast-messages.js, dicari lewat kunci).
export function showToast(key) {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: key }));
}
