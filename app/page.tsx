'use client'

import { useMemo, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Download,
  FileImage,
  Film,
  Grid2X2,
  History,
  ImagePlus,
  Layers3,
  LayoutDashboard,
  Lightbulb,
  LoaderCircle,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  Video,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'

const images = [
  'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=85',
]

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, view: 'overview' },
  { label: 'Create image', icon: ImagePlus, view: 'image' },
  { label: 'Create video', icon: Video, view: 'video' },
  { label: 'History', icon: History, view: 'history' },
]
const secondaryItems = [
  { label: 'Pricing & credits', icon: Zap, view: 'pricing' },
  { label: 'Profile & settings', icon: Settings2, view: 'profile' },
]

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5"><div className="brand-mark"><Sparkles className="size-4" /></div>{!compact && <span className="text-[15px] font-semibold tracking-tight text-white">Lumina<span className="text-[#F97A00]">.</span></span>}</div>
}

function AppShell({ children, view, setView }: { children: React.ReactNode; view: string; setView: (view: string) => void }) {
  const [collapsed, setCollapsed] = useState(false)
  return <div className="min-h-screen bg-[#0B0B0F] text-white">
    <aside className={`sidebar hidden lg:flex ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="flex h-16 items-center px-5"><Logo compact={collapsed} /></div>
      <div className="px-3 py-5">
        <button onClick={() => setView('image')} className="create-button mb-6 w-full"><Plus data-icon="inline-start" /> {!collapsed && 'New creation'}</button>
        <p className="nav-label">{!collapsed && 'Workspace'}</p>
        <nav className="flex flex-col gap-1">{navItems.map(item => <NavItem key={item.view} {...item} active={view === item.view} collapsed={collapsed} onClick={() => setView(item.view)} />)}</nav>
        <p className="nav-label mt-7">{!collapsed && 'Manage'}</p>
        <nav className="flex flex-col gap-1">{secondaryItems.map(item => <NavItem key={item.view} {...item} active={view === item.view} collapsed={collapsed} onClick={() => setView(item.view)} />)}</nav>
      </div>
      <div className="mt-auto border-t border-[#2B2B35] p-3"><button className="nav-item w-full" title="Help"><CircleHelp className="size-[18px]" />{!collapsed && <span>Help center</span>}</button><div className="mt-2 flex items-center gap-3 rounded-xl bg-[#141419] p-2.5"><div className="avatar">AM</div>{!collapsed && <div className="min-w-0"><p className="truncate text-xs font-medium">Alex Morgan</p><p className="truncate text-[11px] text-[#71717A]">Pro workspace</p></div>}</div></div>
      <button onClick={() => setCollapsed(!collapsed)} className="collapse-button" aria-label="Toggle sidebar"><ChevronLeft className={`size-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} /></button>
    </aside>
    <div className="lg:hidden mobile-topbar"><button className="icon-button" onClick={() => setView('overview')}><Menu className="size-5" /></button><Logo /><div className="flex items-center gap-2"><span className="credit-pill"><Zap className="size-3.5" /> 2,480</span><div className="avatar size-8 text-[10px]">AM</div></div></div>
    <div className="lg:pl-[248px]" style={{ minHeight: '100vh' }}><header className="topbar hidden lg:flex"><div><p className="text-xs text-[#71717A]">Wednesday, October 12, 2026</p><h1 className="mt-1 text-lg font-semibold">{view === 'overview' ? 'Good morning, Alex' : navItems.concat(secondaryItems).find(i => i.view === view)?.label}</h1></div><div className="flex items-center gap-3"><button className="credit-pill"><Zap className="size-3.5" /> 2,480 credits <ChevronDown className="size-3.5" /></button><button className="icon-button"><Bell className="size-[18px]" /><span className="notification-dot" /></button><div className="avatar">AM</div></div></header><main className="mx-auto max-w-[1480px] px-4 pb-24 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">{children}</main></div>
    <nav className="mobile-bottomnav lg:hidden">{[{ label: 'Home', icon: LayoutDashboard, view: 'overview' }, { label: 'Create', icon: WandSparkles, view: 'image' }, { label: 'History', icon: History, view: 'history' }, { label: 'Profile', icon: UserRound, view: 'profile' }].map(item => <button key={item.view} onClick={() => setView(item.view)} className={view === item.view || (item.view === 'image' && view === 'video') ? 'active' : ''}><item.icon className="size-[19px]" /><span>{item.label}</span></button>)}</nav>
  </div>
}

function NavItem({ label, icon: Icon, active, collapsed, onClick }: { label: string; icon: any; active: boolean; collapsed: boolean; onClick: () => void }) { return <button onClick={onClick} title={collapsed ? label : undefined} className={`nav-item ${active ? 'active' : ''}`}><Icon className="size-[18px]" />{!collapsed && <span>{label}</span>}{!collapsed && active && <span className="ml-auto size-1.5 rounded-full bg-[#F97A00]" />}</button> }

function Overview({ setView }: { setView: (view: string) => void }) {
  return <div className="animate-in">
    <section className="hero-panel"><div className="relative z-10 max-w-xl"><span className="eyebrow"><Sparkles className="size-3.5" /> Creative workspace</span><h2 className="mt-5 max-w-lg text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-5xl">Turn your ideas<br /><span className="gradient-text">into reality.</span></h2><p className="mt-5 max-w-md text-sm leading-6 text-[#A1A1AA]">Create stunning images and videos with the world&apos;s most capable generative models — all in one focused workspace.</p><div className="mt-7 flex flex-wrap gap-3"><button onClick={() => setView('image')} className="primary-button"><ImagePlus data-icon="inline-start" /> Create image</button><button onClick={() => setView('video')} className="secondary-button"><Video data-icon="inline-start" /> Create video</button></div></div><div className="hero-art" aria-hidden="true"><div className="art-orb" /><div className="art-card art-card-one"><img src={images[0]} alt="Abstract generated landscape" /></div><div className="art-card art-card-two"><img src={images[4]} alt="Ocean generated artwork" /></div><div className="art-line" /></div></section>
    <section className="mt-9"><div className="section-heading"><div><p className="eyebrow text-[#A1A1AA]">Start creating</p><h3 className="section-title">Explore models</h3></div><button className="text-button" onClick={() => setView('image')}>View all <ChevronRight className="size-4" /></button></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><ModelCard name="Aurora XL" type="Image generation" icon={Sparkles} color="orange" image={images[1]} onClick={() => setView('image')} /><ModelCard name="Motion 01" type="Text to video" icon={Film} color="purple" image={images[2]} onClick={() => setView('video')} /><ModelCard name="Canvas Pro" type="Image editing" icon={Layers3} color="blue" image={images[5]} onClick={() => setView('image')} /></div></section>
    <section className="mt-9"><div className="section-heading"><div><p className="eyebrow text-[#A1A1AA]">Your workspace</p><h3 className="section-title">Recent generations</h3></div><button className="text-button" onClick={() => setView('history')}>View history <ChevronRight className="size-4" /></button></div><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{images.slice(0, 5).map((src, i) => <MediaTile key={src} src={src} label={i === 1 ? 'Video' : 'Image'} />)}</div></section>
  </div>
}

function ModelCard({ name, type, icon: Icon, color, image, onClick }: any) { return <button onClick={onClick} className="model-card text-left"><img src={image} alt="" /><div className="model-overlay" /><div className="relative z-10 flex h-full flex-col justify-between p-4"><div className={`model-icon ${color}`}><Icon className="size-4" /></div><div><p className="font-medium">{name}</p><p className="mt-1 text-xs text-white/60">{type}</p></div></div></button> }
function MediaTile({ src, label, tall = false }: { src: string; label: string; tall?: boolean }) { return <div className={`media-tile group ${tall ? 'aspect-[3/4]' : 'aspect-square'}`}><img src={src} alt="Generated creative" loading="lazy" /><div className="media-hover"><button className="size-8 rounded-lg bg-white/15"><MoreHorizontal className="mx-auto size-4" /></button></div><span className="media-badge">{label === 'Video' ? <Play className="size-3 fill-current" /> : <FileImage className="size-3" />}{label}</span></div> }

function Generator({ type }: { type: 'image' | 'video' }) {
  const isVideo = type === 'video'; const [prompt, setPrompt] = useState(''); const [mode, setMode] = useState('Text to video'); const [advanced, setAdvanced] = useState(false); const [generating, setGenerating] = useState(false); const [uploaded, setUploaded] = useState<string | null>(null); const fileRef = useRef<HTMLInputElement>(null)
  const submit = () => { if (!prompt.trim()) return; setGenerating(true); setTimeout(() => setGenerating(false), 3600) }
  return <div className="animate-in"><div className="mb-7 flex items-start justify-between gap-4"><div><p className="eyebrow"><WandSparkles className="size-3.5" /> {isVideo ? 'Motion studio' : 'Image studio'}</p><h2 className="page-title">Create {isVideo ? 'video' : 'image'}</h2><p className="mt-2 max-w-xl text-sm text-[#A1A1AA]">{isVideo ? 'Bring a scene to life with cinematic motion and precise control.' : 'Describe anything you can imagine. Our models will handle the rest.'}</p></div><button className="icon-button hidden sm:flex"><MessageSquareText className="size-[18px]" /></button></div><div className="generator-layout"><div className="generator-card"><div className="flex flex-wrap gap-2 border-b border-[#2B2B35] pb-4">{isVideo && ['Text to video', 'Image to video'].map(item => <button key={item} onClick={() => setMode(item)} className={`mode-tab ${mode === item ? 'active' : ''}`}>{item === 'Text to video' ? <WandSparkles className="size-4" /> : <ImagePlus className="size-4" />}{item}</button>)}</div><label className="field-label">Prompt <span>Be specific and descriptive</span></label><textarea value={prompt} onChange={e => setPrompt(e.target.value)} className="prompt-textarea" placeholder={isVideo ? 'A slow cinematic tracking shot through a misty pine forest at golden hour...' : 'A quiet Japanese tea house floating above the clouds, soft morning light...'} /><div className="prompt-footer"><span className="text-[11px] text-[#71717A]">{prompt.length}/1,000</span><button className="ghost-icon"><Lightbulb className="size-4" /></button></div>{!isVideo && <><label className="field-label mt-6">Negative prompt <span>Optional</span></label><input className="text-input" placeholder="blurry, distorted, low quality..." /></>}<label className="field-label mt-6">{isVideo ? 'Video model' : 'Image model'}</label><div className="select-input"><div className={`model-icon ${isVideo ? 'purple' : 'orange'} size-7`}><Sparkles className="size-3.5" /></div><div className="min-w-0 flex-1"><p className="text-sm font-medium">{isVideo ? 'Motion 01' : 'Aurora XL'}</p><p className="text-[11px] text-[#71717A]">{isVideo ? 'Cinematic video · 1080p' : 'High detail · Photorealistic'}</p></div><ChevronDown className="size-4 text-[#71717A]" /></div>{isVideo && <div className="mt-6 grid grid-cols-2 gap-3"><div><label className="field-label">Aspect ratio</label><select className="text-input"><option>16:9 Landscape</option><option>9:16 Portrait</option><option>1:1 Square</option></select></div><div><label className="field-label">Duration</label><select className="text-input"><option>5 seconds</option><option>10 seconds</option></select></div></div>}{!isVideo && <div className="mt-6"><label className="field-label">Aspect ratio</label><div className="option-grid">{['1:1', '16:9', '9:16', '4:3', '3:4'].map((item, i) => <button key={item} className={`option-button ${i === 0 ? 'selected' : ''}`}><span className={`ratio-icon ratio-${item.replace(':', '-')}`} />{item}</button>)}</div></div>}<div className="mt-6"><label className="field-label">Reference image <span>Optional</span></label><input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={e => e.target.files?.[0] && setUploaded(URL.createObjectURL(e.target.files[0]))} />{uploaded ? <div className="upload-preview"><img src={uploaded} alt="Uploaded reference" /><button onClick={() => setUploaded(null)}><X className="size-4" /></button></div> : <button onClick={() => fileRef.current?.click()} className="upload-zone"><Upload className="size-5 text-[#F97A00]" /><span><strong>Drop an image here</strong> or browse files<p>PNG, JPG up to 10MB</p></span></button>}</div><button onClick={() => setAdvanced(!advanced)} className="advanced-toggle"><Settings2 className="size-4" /> Advanced settings <ChevronDown className={`ml-auto size-4 transition-transform ${advanced ? 'rotate-180' : ''}`} /></button>{advanced && <div className="advanced-panel"><div><label className="field-label">{isVideo ? 'Audio' : 'Images'} <span>Supported by model</span></label><div className="flex gap-2">{(isVideo ? ['On', 'Off'] : ['1 image', '2 images', '4 images']).map((x, i) => <button key={x} className={`mini-option ${i === 0 ? 'selected' : ''}`}>{x}</button>)}</div></div></div>}<div className="mt-6 flex items-center justify-between gap-4 border-t border-[#2B2B35] pt-5"><div><p className="text-xs text-[#71717A]">Estimated cost</p><p className="mt-1 text-sm font-semibold"><Zap className="mr-1 inline size-3.5 text-[#F97A00]" /> {isVideo ? '120' : '12'} credits</p></div><button onClick={submit} disabled={!prompt.trim() || generating} className="primary-button flex-1 sm:flex-none">{generating ? <LoaderCircle data-icon="inline-start" className="animate-spin" /> : <Sparkles data-icon="inline-start" />}{generating ? 'Generating...' : `Generate ${isVideo ? 'video' : 'image'}`}</button></div></div><div className="preview-card"><div className="preview-header"><span>Preview</span><span className="status-dot"><span /> Ready</span></div>{generating ? <div className="generation-state"><div className="loader-ring"><Sparkles className="size-5 text-[#F97A00]" /></div><p className="mt-5 font-medium">Creating your {isVideo ? 'video' : 'image'}</p><p className="mt-2 text-center text-xs leading-5 text-[#71717A]">Your generation is in progress. This usually takes a moment.</p><div className="mt-6 flex items-center gap-2 text-xs text-[#A1A1AA]"><LoaderCircle className="size-3.5 animate-spin text-[#8C32F6]" /> Processing request</div></div> : <div className="preview-empty"><div className="preview-icon">{isVideo ? <Film className="size-6" /> : <ImagePlus className="size-6" />}</div><p className="mt-4 font-medium">Your creation will appear here</p><p className="mt-2 max-w-[220px] text-center text-xs leading-5 text-[#71717A]">Write a prompt and hit generate to see the magic happen.</p></div>}<div className="preview-tip"><Lightbulb className="size-4 text-[#F97A00]" /><span>Tip: Add lighting, camera angle and mood for more control.</span></div></div></div></div>
}

function HistoryPage() { const [tab, setTab] = useState('All'); const filtered = tab === 'Videos' ? images.slice(1, 4) : tab === 'Images' ? images.slice(0, 5) : images; return <div className="animate-in"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow"><History className="size-3.5" /> Your workspace</p><h2 className="page-title">Generation history</h2></div><div className="flex gap-2"><div className="search-box"><Search className="size-4" /><input placeholder="Search creations" /></div><button className="icon-button"><Settings2 className="size-[18px]" /></button></div></div><div className="mt-8 flex gap-1 border-b border-[#2B2B35]">{['All', 'Images', 'Videos'].map(x => <button key={x} onClick={() => setTab(x)} className={`history-tab ${tab === x ? 'active' : ''}`}>{x}<span>{x === 'All' ? 24 : x === 'Images' ? 18 : 6}</span></button>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((src, i) => <MediaTile key={src} src={src} label={tab === 'Videos' || i % 4 === 1 ? 'Video' : 'Image'} tall />)}</div></div> }

function PricingPage() { const plans = [{ name: 'Free', price: '$0', desc: 'Explore the essentials', features: ['50 credits / month', 'Standard queue', 'Community support'] }, { name: 'Starter', price: 'Placeholder', desc: 'For curious creators', features: ['2,000 credits / month', 'Faster generation', 'HD exports'], featured: true }, { name: 'Pro', price: 'Placeholder', desc: 'For serious production', features: ['10,000 credits / month', 'Priority queue', 'Commercial license'] }, { name: 'Business', price: 'Placeholder', desc: 'For teams and studios', features: ['Shared workspace', 'Custom limits', 'Dedicated support'] }]; return <div className="animate-in"><p className="eyebrow"><Zap className="size-3.5" /> Workspace plans</p><h2 className="page-title">Make more room for ideas.</h2><p className="mt-2 max-w-xl text-sm text-[#A1A1AA]">Simple plans for every creative workflow. Placeholder pricing is shown until billing is connected.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{plans.map(plan => <div key={plan.name} className={`plan-card ${plan.featured ? 'featured' : ''}`}><div className="flex items-center justify-between"><h3 className="font-semibold">{plan.name}</h3>{plan.featured && <span className="featured-badge">Popular</span>}</div><p className="mt-6 text-2xl font-semibold">{plan.price}</p><p className="mt-1 text-xs text-[#71717A]">{plan.desc}</p><div className="my-6 h-px bg-[#2B2B35]" /><ul className="flex flex-col gap-3 text-sm text-[#A1A1AA]">{plan.features.map(f => <li key={f}><span className="mr-2 text-[#22C55E]">✓</span>{f}</li>)}</ul><button className={plan.featured ? 'primary-button mt-8 w-full' : 'secondary-button mt-8 w-full'}>{plan.name === 'Free' ? 'Current plan' : 'Choose plan'}</button></div>)}</div><div className="mt-8 balance-card"><div><p className="text-xs text-[#A1A1AA]">Current balance</p><p className="mt-2 text-3xl font-semibold">2,480 <span className="text-sm font-normal text-[#71717A]">credits</span></p></div><div className="balance-progress"><div /></div><p className="text-xs text-[#71717A]">Resets in 18 days</p></div></div> }

function ProfilePage() { return <div className="animate-in max-w-3xl"><p className="eyebrow"><UserRound className="size-3.5" /> Workspace</p><h2 className="page-title">Profile & settings</h2><div className="settings-card mt-8"><div className="flex items-center gap-4"><div className="avatar size-16 text-lg">AM</div><div><h3 className="font-semibold">Alex Morgan</h3><p className="mt-1 text-sm text-[#A1A1AA]">alex@lumina.studio</p></div><button className="secondary-button ml-auto hidden sm:flex">Change photo</button></div><div className="my-7 h-px bg-[#2B2B35]" /><div className="grid gap-5 sm:grid-cols-2"><div><label className="field-label">First name</label><input className="text-input" value="Alex" readOnly /></div><div><label className="field-label">Last name</label><input className="text-input" value="Morgan" readOnly /></div><div className="sm:col-span-2"><label className="field-label">Email address</label><input className="text-input" value="alex@lumina.studio" readOnly /></div></div><button className="primary-button mt-6">Save changes</button></div><div className="settings-card mt-4"><h3 className="font-semibold">Generation preferences</h3><p className="mt-1 text-sm text-[#A1A1AA]">Set the defaults for your creative workspace.</p><div className="mt-6 flex items-center justify-between border-t border-[#2B2B35] pt-5"><div><p className="text-sm font-medium">Auto-save generations</p><p className="mt-1 text-xs text-[#71717A]">Keep every creation in your history</p></div><div className="toggle active"><span /></div></div></div></div> }

export default function Page() { const [view, setView] = useState('overview'); const content = useMemo(() => view === 'overview' ? <Overview setView={setView} /> : view === 'image' ? <Generator type="image" /> : view === 'video' ? <Generator type="video" /> : view === 'history' ? <HistoryPage /> : view === 'pricing' ? <PricingPage /> : <ProfilePage />, [view]); return <AppShell view={view} setView={setView}>{content}</AppShell> }
