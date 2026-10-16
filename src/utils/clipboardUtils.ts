/**
 * Descarga una imagen desde su URL (Cloudinary) y la copia al portapapeles como Blob de imagen.
 */
export async function copyImageToClipboard(imageUrl: string): Promise<boolean> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Convertir a PNG si es necesario (ClipboardItem requiere image/png en la mayoría de navegadores)
    const pngBlob = blob.type === 'image/png' 
      ? blob 
      : await convertBlobToPng(blob);

    await navigator.clipboard.write([
      new ClipboardItem({
        [pngBlob.type]: pngBlob,
      }),
    ]);
    return true;
  } catch (error) {
    console.error('Error al copiar imagen al portapapeles:', error);
    return false;
  }
}

/**
 * Convierte un Blob de cualquier formato de imagen a PNG usando Canvas
 */
async function convertBlobToPng(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('No se pudo obtener el contexto 2d'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error('Error al convertir imagen a PNG'));
      }, 'image/png');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}