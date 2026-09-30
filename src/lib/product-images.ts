import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { firebaseStorage } from './firebase';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export interface UploadedProductImages {
  urls: string[];
  storagePaths: string[];
}

export const compressImageToDataUrl = async (
  file: File,
  maxWidth = 720,
  maxHeight = 960,
  quality = 0.72,
): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      if (typeof src !== 'string') {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          // If browser doesn't support webp export, it falls back to image/png
          resolve(dataUrl);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const uploadProductImages = async (productId: string, files: File[]): Promise<UploadedProductImages> => {
  if (files.length === 0) return { urls: [], storagePaths: [] };
  if (files.some((file) => !ALLOWED_IMAGE_TYPES.has(file.type))) {
    throw new Error('Ảnh chỉ được dùng định dạng JPG, PNG, WEBP hoặc GIF.');
  }
  if (files.some((file) => file.size > MAX_IMAGE_BYTES)) {
    throw new Error('Mỗi ảnh phải có dung lượng tối đa 10 MB.');
  }

  // Attempt upload to Firebase Storage if initialized, with timeout per file
  if (firebaseStorage) {
    const uploadedRefs: ReturnType<typeof ref>[] = [];
    try {
      const urls: string[] = [];
      for (const file of files) {
        const extension = file.name.match(/\.(jpe?g|png|webp|gif)$/i)?.[1]?.toLowerCase() ?? 'img';
        const storageRef = ref(firebaseStorage, `products/${productId}/${crypto.randomUUID()}.${extension}`);
        
        const uploadTask = uploadBytes(storageRef, file, { contentType: file.type });
        const timeoutTask = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firebase Storage timeout')), 4000),
        );

        await Promise.race([uploadTask, timeoutTask]);
        uploadedRefs.push(storageRef);
        urls.push(await getDownloadURL(storageRef));
      }
      return { urls, storagePaths: uploadedRefs.map((storageRef) => storageRef.fullPath) };
    } catch (storageError) {
      console.warn('Firebase Storage upload failed, falling back to optimized inline images:', storageError);
      // Clean up any partial uploads
      await Promise.all(uploadedRefs.map((storageRef) => deleteObject(storageRef).catch(() => undefined)));
    }
  }

  // Fallback: Compress files into WebP Data URLs directly stored in product data
  const urls: string[] = [];
  for (const file of files) {
    const dataUrl = await compressImageToDataUrl(file);
    if (dataUrl) {
      urls.push(dataUrl);
    }
  }

  if (urls.length === 0) {
    throw new Error('Không thể xử lý ảnh tải lên. Vui lòng chọn ảnh khác.');
  }

  return { urls, storagePaths: [] };
};

export const deleteUploadedProductImages = async (storagePaths: string[]) => {
  const storage = firebaseStorage;
  if (!storage || storagePaths.length === 0) return;
  await Promise.all(storagePaths.map((storagePath) => deleteObject(ref(storage, storagePath)).catch(() => undefined)));
};