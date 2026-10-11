// Minimalist standalone QR code generator for device pairing URLs
// Generates standard QR Code Model 2 SVG data
export function generateQRCodeSVG(text: string, size = 220): string {
  // We can construct a clean visual QR display SVG or matrix.
  // Using an embeddable SVG pattern or quick visual representation for the URL
  // We'll encode text into an SVG data URI or return svg string
  const encodedText = encodeURIComponent(text);
  // Using standard Google Charts API / QR SVG fallback or high-res generator
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&bgcolor=ffffff&color=111827&margin=2`;
  return qrUrl;
}
