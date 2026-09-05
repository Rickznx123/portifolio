import { FormEvent, useState } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

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
    try { await login(email, password); navigate('/admin'); } catch { setError('Não foi possível entrar. Confira seu e-mail e senha.'); } finally { setSending(false); }
  }

  async function handleReset() {
    if (!email) { setError('Informe seu e-mail para recuperar a senha.'); return; }
    try { await resetPassword(email); setMessage('Enviamos as instruções para o seu e-mail.'); } catch { setError('Não foi possível enviar a recuperação de senha.'); }
  }

  return <main className="admin-auth"><Link className="back-link" to="/"><ArrowLeft size={16} /> Voltar ao portfólio</Link><div className="admin-auth-card"><LockKeyhole size={22} /><p className="eyebrow">ÁREA ADMINISTRATIVA</p><h1>Entrar no painel</h1><p className="admin-muted">Gerencie seus projetos, mídias e informações.</p>{!configured && <p className="form-message error">Configure as variáveis do Firebase no arquivo .env.local.</p>}<form onSubmit={handleSubmit}><label>E-MAIL<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>SENHA<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button className="admin-primary" type="submit" disabled={sending || !configured}>{sending ? 'ENTRANDO...' : 'ENTRAR'}</button></form><button className="text-button" type="button" onClick={handleReset}>Esqueci minha senha</button>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}</div></main>;
}
