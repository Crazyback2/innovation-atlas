import Link from 'next/link'
import { signup } from './actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const params = await searchParams
  const labelStyle = {
    fontFamily: 'var(--font-geist-mono), monospace',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  }

  const inputStyle = {
    fontFamily: 'inherit',
    fontSize: '15px',
    padding: '12px 14px',
    border: '1px solid #E3E3E3',
    backgroundColor: '#FFFFFF',
    color: '#171717',
    outline: 'none',
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#F6F6F6',
        color: '#171717',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E3E3E3',
          padding: '48px 40px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontSize: '30px',
            lineHeight: 1.1,
            fontWeight: 500,
            marginBottom: '8px',
          }}
        >
          Registrati
        </h1>
        <p style={{ fontSize: '15px', lineHeight: 1.5, opacity: 0.7, marginBottom: '32px' }}>
          Crea un account per iniziare a usare Innovation Atlas.
        </p>

        <form action={signup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="full_name" style={labelStyle}>Nome completo</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              style={inputStyle}
            />
            <span style={{ fontSize: '11px', opacity: 0.6 }}>Minimo 6 caratteri</span>
          </div>

          {params?.error && (
            <div
              style={{
                fontSize: '13px',
                backgroundColor: '#FFE5E5',
                border: '1px solid #FFB3B3',
                padding: '10px 12px',
              }}
            >
              {params?.error}
            </div>
          )}

          {params?.message && (
            <div
              style={{
                fontSize: '13px',
                backgroundColor: '#F6F6F6',
                border: '1px solid #E3E3E3',
                padding: '10px 12px',
              }}
            >
              {params?.message}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: '8px',
              fontFamily: 'inherit',
              fontSize: '15px',
              fontWeight: 500,
              padding: '14px 16px',
              backgroundColor: '#171717',
              color: '#F6F6F6',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Crea account
          </button>
        </form>

        <p style={{ fontSize: '13px', marginTop: '24px', opacity: 0.7 }}>
          Hai già un account?{' '}
          <Link href="/login" style={{ color: '#171717', textDecoration: 'underline' }}>
            Accedi
          </Link>
        </p>
      </div>
    </main>
  )
}