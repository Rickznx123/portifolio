import { FormEvent, useState } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

const AUTH_REQUEST_TIMEOUT = 15000;

function withTimeout<T>(promise: Promise<T>, timeout: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error('auth/network-request-failed')), timeout);
    promise.then((value) => { window.clearTimeout(timer); resolve(value); }, (reason) => { window.clearTimeout(timer); reject(reason); });
  });
}

function getAuthErrorMessage(error: unknown) {
  const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/user-not-found': 'Nenhum usuário foi encontrado com este e-mail.',
    'auth/wrong-password': 'E-mail ou senha inválidos.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
    'auth/network-request-failed': 'Não foi possível acessar o Firebase. Verifique sua conexão e a configuração do projeto.',
    'auth/invalid-api-key': 'A chave da API do Firebase é inválida ou não foi configurada.',
    'auth/operation-not-allowed': 'O login por e-mail e senha não está habilitado no Firebase.',
  };
  if (code && messages[code]) return messages[code];
  if (code) return `Não foi possível entrar. O Firebase retornou: ${code}.`;
  if (error instanceof Error && error.message) return `Não foi possível entrar: ${error.message}`;
  return 'Não foi possível entrar. Tente novamente.';
}

export default function AdminLogin() {
  const { login, resetPassword, configured } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); setError(''); setMessage(''); setSending(true);
    try { await withTimeout(login(email, password), AUTH_REQUEST_TIMEOUT); navigate('/admin'); } catch (submitError) { setError(getAuthErrorMessage(submitError)); } finally { setSending(false); }
  }

  async function handleReset() {
    if (!email) { setError('Informe seu e-mail para recuperar a senha.'); return; }
    try { await withTimeout(resetPassword(email), AUTH_REQUEST_TIMEOUT); setMessage('Enviamos as instruções para o seu e-mail.'); } catch (resetError) { setError(getAuthErrorMessage(resetError)); }
  }

  return <main className="admin-auth"><Link className="back-link" to="/"><ArrowLeft size={16} /> Voltar ao portfólio</Link><div className="admin-auth-card"><LockKeyhole size={22} /><p className="eyebrow">ÁREA ADMINISTRATIVA</p><h1>Entrar no painel</h1><p className="admin-muted">Gerencie seus projetos, mídias e informações.</p>{!configured && <p className="form-message error">Configure as variáveis do Firebase no arquivo .env.local.</p>}<form onSubmit={handleSubmit}><label>E-MAIL<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>SENHA<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button className="admin-primary" type="submit" disabled={sending || !email.trim() || !password}>{sending ? 'ENTRANDO...' : 'ENTRAR'}</button></form><button className="text-button" type="button" onClick={handleReset}>Esqueci minha senha</button>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}</div></main>;
}
