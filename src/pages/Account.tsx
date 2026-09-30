import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { firebaseConfigured } from '../lib/firebase';

export const Account: React.FC = () => {
  const { user, loading, login, register } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const nextPath = searchParams.get('next');
  const destination = nextPath?.startsWith('/') && !nextPath.startsWith('//')
    ? nextPath
    : user?.role === 'admin' ? '/admin' : '/';

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F7F5]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#263C36] border-t-transparent" />
          <p className="text-xs text-[#777]">Đang tải tài khoản...</p>
        </div>
      </div>
    );
  }
  if (user) return <Navigate to={destination} replace />;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedInUser = isRegister
        ? await register(name, email, password)
        : await login(email, password);
      const safeDestination = nextPath?.startsWith('/') && !nextPath.startsWith('//')
        ? nextPath
        : signedInUser.role === 'admin' ? '/admin' : '/';
      navigate(safeDestination, { replace: true });
    } catch (submitError) {
      const firebaseCode = submitError && typeof submitError === 'object' && 'code' in submitError
        ? String(submitError.code).toLowerCase()
        : '';
      if (firebaseCode.includes('api-key-not-valid') || firebaseCode.includes('invalid-api-key')) {
        setError('Firebase không chấp nhận API key. Trong Firebase Console → Project settings → General → Web API Key, sao chép lại đúng key của project hv-clothings vào VITE_FIREBASE_API_KEY trong file .env, rồi khởi động lại npm.cmd run dev.');
      } else if (firebaseCode === 'auth/operation-not-allowed') {
        setError('Email/Password chưa được bật. Mở Firebase Console → Authentication → Sign-in method và bật Email/Password.');
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Không thể đăng nhập.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-[78vh] bg-[#F7F7F5] px-5 py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden border border-[#E2E0DB] bg-white md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden min-h-[560px] bg-[#263C36] p-12 text-white md:flex md:flex-col md:justify-between">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img src="/logo.png" alt="HV CLOTHING" className="h-10 w-auto brightness-0 invert" />
            <span className="font-serif text-2xl tracking-[0.18em]">HV CLOTHING</span>
          </Link>
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-[#C8D2C8]">HV CLOTHING STUDIO</p>
            <h1 className="max-w-sm font-serif text-4xl leading-tight">Phong cách của bạn, bắt đầu từ đây.</h1>
          </div>
          <p className="text-xs text-[#D1D8D1]">Thiết kế có chủ đích. Sống cùng thời gian.</p>
        </div>

        <div className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-12">
          <Link to="/" className="mb-12 inline-flex w-fit items-center gap-2 text-xs text-[#777] hover:text-black">
            <ArrowLeft size={14} aria-hidden="true" /> Trở về cửa hàng
          </Link>
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#777]">
            {isRegister ? 'THÀNH VIÊN HV CLOTHING' : 'CHÀO MỪNG TRỞ LẠI'}
          </p>
          <h2 className="mb-8 font-serif text-3xl text-[#171A18]">
            {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h2>

          {!firebaseConfigured && (
            <p role="alert" className="mb-5 border border-[#E6D5A8] bg-[#FFF9E9] px-3 py-2 text-xs text-[#715B20]">
              Firebase chưa được cấu hình. Hãy điền thông tin VITE_FIREBASE_* trong file .env rồi khởi động lại ứng dụng.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label htmlFor="account-name" className="mb-1.5 block text-xs text-[#555]">Họ và tên</label>
                <input id="account-name" autoComplete="name" required minLength={2} maxLength={120}
                  value={name} onChange={(event) => setName(event.target.value)}
                  className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]" />
              </div>
            )}
            <div>
              <label htmlFor="account-email" className="mb-1.5 block text-xs text-[#555]">Email</label>
              <input id="account-email" type="email" autoComplete="email" required maxLength={254}
                value={email} onChange={(event) => setEmail(event.target.value)}
                className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]" />
            </div>
            <div>
              <label htmlFor="account-password" className="mb-1.5 block text-xs text-[#555]">Mật khẩu</label>
              <input id="account-password" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'}
                required minLength={isRegister ? 10 : undefined} maxLength={128}
                value={password} onChange={(event) => setPassword(event.target.value)}
                className="w-full border-b border-[#D8D6D0] bg-transparent py-3 text-sm outline-none focus:border-[#263C36]" />
              {isRegister && <p className="mt-2 text-[11px] text-[#777]">Tối thiểu 10 ký tự.</p>}
            </div>

            {error && <p role="alert" className="text-xs text-[#A43131]">{error}</p>}

            <button type="submit" disabled={submitting}
              className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#263C36] px-5 text-xs font-medium tracking-[0.14em] text-white transition-colors hover:bg-[#192A25] disabled:opacity-60">
              {submitting && <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />}
              {isRegister ? 'TẠO TÀI KHOẢN' : 'ĐĂNG NHẬP'}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-[#666]">
            {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
            <button type="button" onClick={() => { setError(''); setIsRegister((value) => !value); }}
              className="font-medium text-[#263C36] underline underline-offset-4">
              {isRegister ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};