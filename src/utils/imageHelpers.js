const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_QUALITY = 0.82;
const THUMB_MAX_WIDTH = 400;
const THUMB_QUALITY = 0.75;

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not compress image'))),
      mimeType,
      quality
    );
  });
}

async function resizeImage(file, maxWidth, quality, mimeType = 'image/jpeg') {
  const img = await loadImageFromFile(file);
  const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await canvasToBlob(canvas, mimeType, quality);
  return { blob, width, height, mimeType };
}

export async function compressPhotoForUpload(file) {
  return resizeImage(file, DEFAULT_MAX_WIDTH, DEFAULT_QUALITY);
}

export async function compressPhotoThumbnail(file) {
  return resizeImage(file, THUMB_MAX_WIDTH, THUMB_QUALITY);
}

export async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(blob);
  });
}

export function buildPhotoFileName({ admissionNumber, studentName, visitDate, index }) {
  const id = (admissionNumber || studentName || 'student')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_]/g, '');
  const date = (visitDate || new Date().toISOString().slice(0, 10)).replace(/\//g, '-');
  const seq = String(index + 1).padStart(2, '0');
  return `SJM_${id}_${date}_${seq}.jpg`;
}
