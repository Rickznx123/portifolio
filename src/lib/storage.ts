import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './firebase';

export type UploadKind = 'videos' | 'thumbnails' | 'showreel' | 'photo';

const acceptedTypes: Record<UploadKind, string[]> = {
  videos: ['video/mp4', 'video/quicktime', 'video/webm'],
  thumbnails: ['image/jpeg', 'image/png', 'image/webp'],
  showreel: ['video/mp4', 'video/quicktime', 'video/webm'],
  photo: ['image/jpeg', 'image/png', 'image/webp'],
};

export function validateUpload(file: File, kind: UploadKind) {
  if (!acceptedTypes[kind].includes(file.type)) {
    throw new Error(kind === 'thumbnails' || kind === 'photo' ? 'Use JPG, JPEG, PNG ou WEBP.' : 'Use MP4, MOV ou WEBM.');
  }
}

export function uploadFile(file: File, kind: UploadKind, onProgress: (progress: number) => void) {
  if (!storage) return Promise.reject(new Error('Firebase ainda não foi configurado.'));
  validateUpload(file, kind);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${kind}/${crypto.randomUUID()}-${safeName}`;
  const upload = uploadBytesResumable(ref(storage, path), file, { contentType: file.type });

  return new Promise<{ url: string; path: string }>((resolve, reject) => {
    upload.on(
      'state_changed',
      (snapshot) => onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
      reject,
      async () => {
        try {
          const url = await getDownloadURL(upload.snapshot.ref);
          resolve({ url, path });
        } catch (error) {
          console.error('[Firebase Storage] Falha ao obter a URL do arquivo enviado.', error);
          reject(error);
        }
      },
    );
  });
}

export function removeFile(path?: string) {
  if (!storage || !path) return Promise.resolve();
  return deleteObject(ref(storage, path));
}
