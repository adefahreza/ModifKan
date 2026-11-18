export function homePathFor(user) {
  if (!user) return '/login';
  if (user.role === 'admin') return '/admin';
  if (user.role === 'seller') return user.storeStatus === 'approved' ? '/seller' : '/seller/pending';
  return '/';
}

export function safeNext(next) {
  if (typeof next !== 'string') return null;
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return null;
  if (next.includes('://')) return null;
  return next;
}
