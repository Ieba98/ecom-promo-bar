import crypto from 'node:crypto';

export function verifyAppProxyRequest(urlString: string, secret: string): boolean {
  try {
    const url = new URL(urlString);
    const received = url.searchParams.get('signature');
    if (!received) return false;
    // Build string to sign: path + '?' + sorted query (excluding signature)
    const qp = new URLSearchParams(url.search);
    qp.delete('signature');
    const sorted = new URLSearchParams(Array.from(qp.entries()).sort((a, b) => a[0].localeCompare(b[0])));
    const stringToSign = url.pathname + (sorted.toString() ? `?${sorted.toString()}` : '');
    const digest = crypto.createHmac('sha256', secret).update(stringToSign).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(digest, 'utf8'), Buffer.from(received, 'utf8'));
  } catch {
    return false;
  }
} 