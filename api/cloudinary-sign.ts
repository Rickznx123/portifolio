import { v2 as cloudinary } from 'cloudinary';

type RequestBody = {
  folder?: unknown;
};

type Request = {
  method?: string;
  body?: RequestBody;
};

type Response = {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

function getServerConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('A configuração server-side do Cloudinary está incompleta.');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return { apiKey };
}

export default function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const { apiKey } = getServerConfig();
    const folder = req.body?.folder;

    if (typeof folder !== 'string' || !folder.trim()) {
      return res.status(400).json({ error: 'O parâmetro folder é obrigatório.' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      process.env.CLOUDINARY_API_SECRET as string,
    );

    return res.status(200).json({ signature, timestamp, apiKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível gerar a assinatura.';
    return res.status(500).json({ error: message });
  }
}
