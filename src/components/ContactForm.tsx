'use client';

import { useState, FormEvent } from 'react';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: 'var(--muted)',
  marginBottom: '6px',
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: '46px',
  padding: '0 14px',
  fontSize: '14px',
  background: 'var(--paper)',
  border: '1px solid var(--line-strong)',
  borderRadius: 'var(--r-sm)',
  color: 'var(--ink)',
  outline: 'none',
};

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Suivi de commande');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Une erreur est survenue. Réessayez ou écrivez-nous directement par e-mail.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Une erreur est survenue. Réessayez ou écrivez-nous directement par e-mail.');
    }
  };

  if (status === 'sent') {
    return (
      <div role="status" style={{ padding: '24px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Message envoyé !</p>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          Merci de nous avoir contactés, nous vous répondrons sous 24 à 48h ouvrées.
        </p>
        <button type="button" className="btn btn--secondary" style={{ marginTop: '16px' }} onClick={() => setStatus('idle')}>
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contact-name" style={labelStyle}>Nom complet</label>
        <input
          id="contact-name"
          type="text"
          required
          maxLength={120}
          placeholder="Votre nom et prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={fieldStyle}
        />
      </div>

      <div>
        <label htmlFor="contact-email" style={labelStyle}>Adresse e-mail</label>
        <input
          id="contact-email"
          type="email"
          required
          maxLength={254}
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={fieldStyle}
        />
      </div>

      <div>
        <label htmlFor="contact-subject" style={labelStyle}>Sujet</label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={{
            ...fieldStyle,
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237A7467' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
          }}
        >
          <option>Suivi de commande</option>
          <option>Question sur un produit</option>
          <option>Livraison et retours</option>
          <option>Partenariat / Grossiste</option>
          <option>Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" style={labelStyle}>Message</label>
        <textarea
          id="contact-message"
          rows={6}
          required
          maxLength={2000}
          placeholder="Comment pouvons-nous vous aider ?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px',
            fontSize: '14px',
            background: 'var(--paper)',
            border: '1px solid var(--line-strong)',
            borderRadius: 'var(--r-sm)',
            color: 'var(--ink)',
            outline: 'none',
            resize: 'vertical',
            lineHeight: '1.6',
          }}
        />
      </div>

      {status === 'error' && (
        <p style={{ color: 'var(--brick)', fontSize: '13.5px' }}>{errorMsg}</p>
      )}

      <button type="submit" className="btn btn--primary btn--block" disabled={status === 'sending'}>
        {status === 'sending' ? 'Envoi…' : 'Envoyer le message'}
      </button>
    </form>
  );
}
