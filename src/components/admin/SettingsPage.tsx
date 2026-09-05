import { FormEvent, useEffect, useState } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { getSettings, saveSettings } from '../../lib/firestore';
import { defaultSettings, type PortfolioSettings } from '../../types/portfolio';
import { removeFile } from '../../lib/storage';
import UploadField from './UploadField';

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

export default function SettingsPage() {
  const [form, setForm] = useState<PortfolioSettings>(defaultSettings);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getSettings().then(setForm).catch((loadError) => {
      console.error('[Firestore] Falha ao carregar configurações.', loadError);
      setError('Não foi possível carregar as configurações.');
    });
  }, []);

  function setField<K extends keyof PortfolioSettings>(field: K, value: PortfolioSettings[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (uploadState === 'uploading') {
      setError('Aguarde o término do envio do vídeo antes de salvar.');
      return;
    }
    if (uploadState === 'error') {
      setError('Corrija o envio do vídeo antes de salvar as configurações.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('Salvando configurações...');
    try {
      await saveSettings(form);
      setMessage('Configurações salvas.');
    } catch (saveError) {
      console.error('[Firestore] Falha ao salvar configurações.', saveError);
      setMessage('');
      setError('Não foi possível salvar as configurações. Verifique sua conexão e suas permissões no Firebase.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteShowreel() {
    if (!window.confirm('Excluir o showreel atual?')) return;
    setSaving(true);
    setError('');
    setMessage('Excluindo showreel...');
    try {
      await removeFile(form.showreelPath);
      const nextForm = { ...form, showreelUrl: '', showreelPath: '' };
      setForm(nextForm);
      await saveSettings(nextForm);
      setMessage('Showreel excluído.');
    } catch (deleteError) {
      console.error('[Firebase] Falha ao excluir showreel.', deleteError);
      setMessage('');
      setError('Não foi possível excluir o showreel.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePhoto() {
    if (!window.confirm('Excluir a foto de perfil atual?')) return;
    setSaving(true);
    setError('');
    setMessage('Excluindo foto de perfil...');
    try {
      await removeFile(form.photoPath);
      const nextForm = { ...form, photoUrl: '', photoPath: '' };
      setForm(nextForm);
      await saveSettings(nextForm);
      setMessage('Foto de perfil excluída.');
    } catch (deleteError) {
      console.error('[Firebase] Falha ao excluir foto de perfil.', deleteError);
      setMessage('');
      setError('Não foi possível excluir a foto de perfil.');
    } finally {
      setSaving(false);
    }
  }

  return <div className="admin-page"><div className="admin-page-heading"><div><p className="eyebrow">ADMINISTRAÇÃO</p><h1>Configurações</h1><p className="admin-muted">Essas informações aparecem no site público.</p></div></div><form className="settings-form" onSubmit={submit}><section className="admin-panel form-panel"><p className="eyebrow">APRESENTAÇÃO</p><div className="form-grid"><label>NOME<input value={form.name} onChange={(event) => setField('name', event.target.value)} required /></label><label>TÍTULO PROFISSIONAL<input value={form.title} onChange={(event) => setField('title', event.target.value)} required /></label></div><label>DESCRIÇÃO PRINCIPAL<input value={form.description} onChange={(event) => setField('description', event.target.value)} required /></label><div className="form-grid"><label>TÍTULO DO HERO<input value={form.heroTitle} onChange={(event) => setField('heroTitle', event.target.value)} /></label><label>SUBTÍTULO DO HERO<input value={form.heroSubtitle} onChange={(event) => setField('heroSubtitle', event.target.value)} /></label></div><label>DESCRIÇÃO DO HERO<input value={form.heroDescription} onChange={(event) => setField('heroDescription', event.target.value)} /></label><label>BIO<textarea rows={9} value={form.bio} onChange={(event) => setField('bio', event.target.value)} required /></label></section><section className="admin-panel form-panel"><p className="eyebrow">CONTATO</p><div className="form-grid"><label>INSTAGRAM<input value={form.instagram} onChange={(event) => setField('instagram', event.target.value)} /></label><label>URL DO INSTAGRAM<input type="url" value={form.instagramUrl} onChange={(event) => setField('instagramUrl', event.target.value)} /></label><label>E-MAIL<input type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} /></label><label>WHATSAPP EXIBIDO<input value={form.whatsapp} onChange={(event) => setField('whatsapp', event.target.value)} /></label><label>URL DO WHATSAPP<input type="url" value={form.whatsappUrl} onChange={(event) => setField('whatsappUrl', event.target.value)} /></label></div></section><section className="admin-panel form-panel"><p className="eyebrow">SHOWREEL</p><UploadField kind="showreel" label="VÍDEO · MP4, MOV ou WEBM" accept="video/mp4,video/quicktime,video/webm" value={form.showreelUrl} onChange={(value) => { setField('showreelUrl', value.url); setField('showreelPath', value.path); }} onStateChange={setUploadState} />{form.showreelUrl && <><video className="admin-video-preview showreel-preview" src={form.showreelUrl} controls playsInline /><button type="button" className="admin-secondary danger-action" onClick={deleteShowreel} disabled={saving}><Trash2 size={16} /> EXCLUIR SHOWREEL</button></>}</section><section className="admin-panel form-panel"><p className="eyebrow">FOTO DE PERFIL (SEÇÃO SOBRE MIM)</p><UploadField kind="photo" label="FOTO · JPG, PNG ou WEBP" accept="image/jpeg,image/png,image/webp" value={form.photoUrl} onChange={(value) => { setField('photoUrl', value.url); setField('photoPath', value.path); }} onStateChange={setUploadState} />{form.photoUrl && <><img className="admin-thumbnail-preview" src={form.photoUrl} alt="Foto de perfil" /><button type="button" className="admin-secondary danger-action" onClick={deletePhoto} disabled={saving}><Trash2 size={16} /> EXCLUIR FOTO</button></>}</section>{message && <p className="form-message success">{message}</p>}{error && <p className="form-message error">{error}</p>}<div className="form-actions"><button className="admin-primary" disabled={saving || uploadState === 'uploading'} type="submit"><Save size={16} /> {saving ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}</button></div></form></div>;
}
