const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

const acceptedVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];

type CloudinarySignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
};

type CloudinaryResponse = {
  secure_url?: string;
  public_id?: string;
  error?: { message?: string };
};

export function validateCloudinaryVideo(file: File) {
  if (!acceptedVideoTypes.includes(file.type)) {
    throw new Error('Use vídeos MP4, MOV ou WEBM.');
  }

  if (!cloudName || !apiKey) {
    throw new Error('A configuração pública do Cloudinary está incompleta.');
  }
}

async function requestSignature(): Promise<CloudinarySignature> {
  const response = await fetch('/api/cloudinary-sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder: 'portfolio' }),
  });

  const body = await response.json() as Partial<CloudinarySignature> & { error?: string };
  if (!response.ok || !body.signature || !body.timestamp || !body.apiKey) {
    throw new Error(body.error || 'Não foi possível obter a assinatura do Cloudinary.');
  }

  return body as CloudinarySignature;
}

export async function uploadVideoToCloudinary(file: File, onProgress: (progress: number) => void) {
  validateCloudinaryVideo(file);
  const signed = await requestSignature();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signed.apiKey);
  formData.append('timestamp', String(signed.timestamp));
  formData.append('signature', signed.signature);
  formData.append('folder', 'portfolio');

  return new Promise<{ url: string; path: string }>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    request.responseType = 'text';

    request.addEventListener('error', () => reject(new Error('A conexão com o Cloudinary falhou.')));
    request.addEventListener('abort', () => reject(new Error('O envio para o Cloudinary foi cancelado.')));
    request.addEventListener('load', () => {
      let response: CloudinaryResponse | null = null;
      try {
        response = request.responseText ? JSON.parse(request.responseText) : null;
      } catch {
        response = null;
      }

      if (request.status >= 200 && request.status < 300 && response?.secure_url) {
        resolve({ url: response.secure_url, path: response.public_id || '' });
        return;
      }

      reject(new Error(response?.error?.message || 'O Cloudinary recusou o vídeo.'));
    });

    request.send(formData);
  });
}
