// Utility functions for cropping and rotating images
// Based on react-easy-crop documentation

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set canvas to the correct size
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location to allow rotating and cropping around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image
  ctx.drawImage(
    image,
    (safeArea - image.width) / 2,
    (safeArea - image.height) / 2
  );

  // crop the image
  const data = ctx.getImageData(
    pixelCrop.x + (safeArea - image.width) / 2,
    pixelCrop.y + (safeArea - image.height) / 2,
    pixelCrop.width,
    pixelCrop.height
  );

  // set canvas to final size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste cropped image
  ctx.putImageData(data, 0, 0);

  // return base64 image
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }, 'image/jpeg');
  });
}
