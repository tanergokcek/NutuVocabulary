import { useState, type FormEvent } from 'react';
import type { User } from '../types';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }

    setIsLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // For demo: accept any credentials
    const name = email.split('@')[0];
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    // Save to localStorage
    const user: User = { email: email.trim(), name: capitalizedName };
    localStorage.setItem('nutu_user', JSON.stringify(user));

    setIsLoading(false);
    onLogin(user);
  };

  return (
    <div className="login-page">
      {/* Decorative glass panels — representing "4 words" */}
      <div className="login-glass-decoration" />
      <div className="login-glass-decoration" />
      <div className="login-glass-decoration" />
      <div className="login-glass-decoration" />

      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="M8 7h6" />
              <path d="M8 11h8" />
            </svg>
          </div>
          <h1>NutuVocabulary</h1>
          <p>Günde sadece 4 kelime yeterli</p>
        </div>

        {/* Login Card */}
        <div className="login-card glass-panel">
          <h2>Hoş Geldiniz</h2>
          <p className="login-subtitle">Hesabınıza giriş yaparak kelime öğrenmeye devam edin</p>

          {error && <div className="login-error">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">E-posta</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="login-email"
                  type="email"
                  className="input-field"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Şifre</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
              id="login-submit-btn"
            >
              {isLoading ? (
                <span className="btn-loader">
                  <span className="spinner" />
                  Giriş yapılıyor...
                </span>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>veya</span>
          </div>

          <div className="social-login">
            <button className="btn btn-glass social-btn" type="button" id="google-login-btn">
              <svg viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.27 9.76A7.18 7.18 0 0 1 12.01 5c1.73 0 3.3.61 4.53 1.63l3.38-3.38A11.97 11.97 0 0 0 12.01 0 12 12 0 0 0 .69 9.76l4.58 3.57z" />
                <path fill="#34A853" d="M16.04 18.01A7.15 7.15 0 0 1 12 19.2a7.18 7.18 0 0 1-6.73-4.68L.69 18.09A12 12 0 0 0 12.01 24c3.08 0 5.94-1.17 8.09-3.15l-4.06-2.84z" />
                <path fill="#4A90D9" d="M20.1 20.85A11.94 11.94 0 0 0 24 12.21c0-.83-.08-1.47-.22-2.12H12v4.6h6.73a5.66 5.66 0 0 1-2.49 3.68l4.06 2.84z" transform="translate(0 -.36)" />
                <path fill="#FBBC05" d="M5.27 14.52a7.2 7.2 0 0 1 0-5.09L.69 5.86a12 12 0 0 0 0 12.23l4.58-3.57z" transform="translate(0 .23)" />
              </svg>
              Google
            </button>
            <button className="btn btn-glass social-btn" type="button" id="apple-login-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.12 4.53-3.74 4.25z" />
              </svg>
              Apple
            </button>
          </div>
        </div>

        <p className="login-footer">
          Hesabınız yok mu? <a href="#" onClick={(e) => e.preventDefault()}>Kayıt Ol</a>
        </p>
      </div>
    </div>
  );
}
