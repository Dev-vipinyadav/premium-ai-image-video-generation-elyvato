'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, Sparkles, UserRound, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { authenticate, saveAuthSession } from '@/lib/auth'

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const registering = mode === 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState({ name: '', email: '', mobile: '', password: '', identity: '' })
  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues(current => ({ ...current, [key]: event.target.value }))
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError(''); setBusy(true)
    try {
      const session = await authenticate(mode, registering
        ? { name: values.name.trim(), email: values.email.trim(), mobile: values.mobile.trim(), password: values.password }
        : { [values.identity.includes('@') ? 'email' : 'mobile']: values.identity.trim(), password: values.password })
      saveAuthSession(session)
      router.replace('/')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not connect. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="auth-page"><div className="auth-glow auth-glow-one"/><div className="auth-glow auth-glow-two"/><section className="auth-card"><Link href="/login" className="auth-brand"><span className="brand-mark"><Sparkles className="size-4"/></span><span>Trivi.ai<span className="text-[#F97A00]">.</span></span></Link><div className="auth-heading"><span className="auth-eyebrow">{registering ? 'YOUR CREATIVE SPACE' : 'WELCOME BACK'}</span><h1>{registering ? 'Create your account' : 'Sign in to Trivi.ai'}</h1><p>{registering ? 'One account for every idea you want to bring to life.' : 'Pick up where your imagination left off.'}</p></div><form className="auth-form" onSubmit={submit}>
    {registering && <><label className="auth-label">Full name<div className="auth-input-wrap"><UserRound/><input autoComplete="name" required value={values.name} onChange={update('name')} placeholder="Your name"/></div></label><label className="auth-label">Email address<div className="auth-input-wrap"><Mail/><input type="email" autoComplete="email" required value={values.email} onChange={update('email')} placeholder="you@example.com"/></div></label><label className="auth-label">Mobile number<div className="auth-input-wrap"><Smartphone/><input type="tel" autoComplete="tel" required value={values.mobile} onChange={update('mobile')} placeholder="Your mobile number"/></div></label></>}
    {!registering && <label className="auth-label">Email or mobile<div className="auth-input-wrap"><Mail/><input autoComplete="username" required value={values.identity} onChange={update('identity')} placeholder="Email address or mobile number"/></div></label>}
    <label className="auth-label">Password<div className="auth-input-wrap"><LockKeyhole/><input type={showPassword ? 'text' : 'password'} autoComplete={registering ? 'new-password' : 'current-password'} required minLength={registering ? 8 : undefined} value={values.password} onChange={update('password')} placeholder={registering ? 'At least 8 characters' : 'Enter your password'}/><button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff/> : <Eye/>}</button></div></label>
    {error && <p className="auth-error" role="alert">{error}</p>}<button type="submit" className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}{!busy && <ArrowRight/>}</button>
   </form><p className="auth-switch">{registering ? 'Already have an account?' : 'New to Trivi.ai?'} <Link href={registering ? '/login' : '/register'}>{registering ? 'Sign in' : 'Create an account'}</Link></p><p className="auth-footnote"><span/>Your account and creations stay yours.</p></section><aside className="auth-side"><span className="auth-side-kicker"><Sparkles/> THE CREATIVE WORKSPACE</span><h2>Your next idea<br/>starts <span className="gradient-text">here.</span></h2><p>Turn a simple prompt into something extraordinary. Create images and cinematic videos in one beautifully focused workspace.</p><div className="auth-side-art"><div className="auth-art-orb"/><div className="auth-art-line auth-art-line-one"/><div className="auth-art-line auth-art-line-two"/><div className="auth-art-chip"><Sparkles/> Made for your imagination</div></div></aside></main>
}
