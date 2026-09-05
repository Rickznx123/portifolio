import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFile, type UploadKind } from '../../lib/storage';
import { uploadVideoToCloudinary } from '../../lib/cloudinary';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

type UploadFieldProps = {
  kind: UploadKind;
  label: string;
  accept: string;
  value?: string;
  onChange: (value: { url: string; path: string }) => void;
  onStateChange?: (state: UploadState) => void;
};

function friendlyUploadError(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  if (code.includes('storage/unauthorized')) return 'Você não tem permissão para enviar este arquivo.';
  if (code.includes('storage/canceled')) return 'O envio foi cancelado.';
  if (code.includes('storage/quota-exceeded')) return 'O limite de armazenamento do Firebase foi excedido.';
  if (code.includes('storage/network-request-failed')) return 'A conexão foi interrompida. Tente novamente.';
  if (error instanceof Error && error.message) return error.message;
  return 'Não foi possível enviar o arquivo.';
}

export default function UploadField({ kind, label, accept, value, onChange, onStateChange }: UploadFieldProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  async function handleChange(file?: File) {
    if (!file) return;
    setError('');
    setStatus(kind === 'videos' || kind === 'showreel' ? 'Selecionando vídeo...' : 'Enviando...');
    setProgress(0);
    onStateChange?.('uploading');

    try {
      const result = kind === 'videos' || kind === 'showreel'
        ? await uploadVideoToCloudinary(file, (progress) => {
          setProgress(progress);
          if (progress < 100) setStatus('Enviando vídeo...');
        })
        : await uploadFile(file, kind, setProgress);
      onChange(result);
      setStatus('Upload concluído.');
      onStateChange?.('success');
    } catch (uploadError) {
      console.error(kind === 'videos' || kind === 'showreel' ? '[Cloudinary] Falha no upload.' : '[Firebase Storage] Falha no upload.', uploadError);
      setStatus('');
      setError(friendlyUploadError(uploadError));
      onStateChange?.('error');
    }
  }

  return (
    <div className="upload-field">
      <label>{label}
        <div className="upload-control">
          <UploadCloud size={19} />
          <span>{value ? 'Substituir arquivo' : 'Selecionar arquivo'}</span>
          <input type="file" accept={accept} onChange={(event) => handleChange(event.target.files?.[0])} />
        </div>
      </label>
      {progress > 0 && progress < 100 && <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>}
      {status && <small className="upload-success">{status} {progress > 0 && `${progress}%`}</small>}
      {error && <small className="upload-error">{error}</small>}
      {value && <small className="upload-preview-label">Arquivo pronto para salvar</small>}
    </div>
  );
}
