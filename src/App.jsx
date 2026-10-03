import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  BarChart3,
  Megaphone,
  MonitorPlay,
  Package,
  Search,
  Sparkles,
  Store,
  Wand2,
} from 'lucide-react';

const capitalOptions = [1000, 5000, 10000, 25000, 50000];
const platforms = ['TikTok', 'Instagram', 'Facebook'];

const initialProductCatalog = [
  { id: 'p1', name: 'GlowLift Pro', category: 'Beauty', supplierCost: 9.5, recommendedPrice: 29.99, margin: 68, trend: 92, saturation: 31, competition: 44, demand: 91, estimatedSales: 2840, rating: 4.8, shippingDays: 5, tikTok: 91, instagram: 88, metaAds: 85, winningScore: 94, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80' },
  { id: 'p2', name: 'HydraCore Bottle', category: 'Wellness', supplierCost: 12.2, recommendedPrice: 34.99, margin: 66, trend: 85, saturation: 42, competition: 47, demand: 86, estimatedSales: 2670, rating: 4.7, shippingDays: 4, tikTok: 89, instagram: 81, metaAds: 84, winningScore: 90, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
  { id: 'p3', name: 'SmartFlex Mat', category: 'Fitness', supplierCost: 18, recommendedPrice: 59.99, margin: 70, trend: 82, saturation: 38, competition: 46, demand: 82, estimatedSales: 2350, rating: 4.7, shippingDays: 6, tikTok: 84, instagram: 86, metaAds: 80, winningScore: 88, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80' },
  { id: 'p4', name: 'NestPulse Lamp', category: 'Home', supplierCost: 17, recommendedPrice: 49.99, margin: 65, trend: 80, saturation: 35, competition: 41, demand: 78, estimatedSales: 2140, rating: 4.6, shippingDays: 5, tikTok: 80, instagram: 84, metaAds: 83, winningScore: 86, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
  { id: 'p5', name: 'BreezeDesk Mini', category: 'Lifestyle', supplierCost: 22, recommendedPrice: 69, margin: 69, trend: 88, saturation: 29, competition: 39, demand: 85, estimatedSales: 2875, rating: 4.9, shippingDays: 7, tikTok: 88, instagram: 90, metaAds: 87, winningScore: 92, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
  { id: 'p6', name: 'AirNest Mask', category: 'Beauty', supplierCost: 8.7, recommendedPrice: 24.99, margin: 64, trend: 79, saturation: 45, competition: 52, demand: 80, estimatedSales: 2100, rating: 4.4, shippingDays: 4, tikTok: 86, instagram: 85, metaAds: 83, winningScore: 85, image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
  { id: 'p7', name: 'QuietBoost Speaker', category: 'Tech', supplierCost: 15.4, recommendedPrice: 42.99, margin: 62, trend: 72, saturation: 50, competition: 58, demand: 76, estimatedSales: 1880, rating: 4.3, shippingDays: 5, tikTok: 77, instagram: 76, metaAds: 81, winningScore: 80, image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80' },
  { id: 'p8', name: 'CleanNest Organizer', category: 'Home', supplierCost: 10.8, recommendedPrice: 31.99, margin: 66, trend: 83, saturation: 37, competition: 42, demand: 79, estimatedSales: 2050, rating: 4.5, shippingDays: 4, tikTok: 83, instagram: 82, metaAds: 79, winningScore: 84, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80' },
];

const defaultCampaignForm = {
  productId: '',
  platform: 'Meta Ads',
  budget: 150,
  duration: 7,
  audience: 'Women 18-35',
  age: '18-34',
  interests: 'Wellness, Beauty, Lifestyle',
  country: 'Italia',
  objective: 'Sales',
  creativity: 'A/B testing',
};

const defaultContentForm = {
  productId: '',
  type: 'Unboxing',
  platform: 'TikTok',
  hook: 'Il prodotto che ogni routine di domani richiede.',
  caption: 'Ogni dettaglio e la qualità che cercavi.',
  hashtags: '#viral #dropshipping #smartshop',
  cta: 'Scopri di più',
};

function createInitialGame(capital = 10000) {
  return {
    capital,
    availableCash: capital,
    revenue: 0,
    cogs: 0,
    adSpend: 0,
    refunds: 0,
    otherExpenses: 150,
    netProfit: 0,
    roas: 0,
    followers: 420,
    fame: 24,
    storeValue: Math.round(capital * 1.6),
    day: 1,
    stats: {
      visitors: 1800,
      customers: 0,
      conversionRate: 2.4,
      followers: 420,
      fame: 24,
      growth: 1,
    },
    store: {
      name: 'Empire Nova',
      logo: 'DE',
      colors: { primary: '#8b5cf6', accent: '#22c55e' },
      homepage: 'Build the next generation of premium products.',
      shipping: '3-5 giorni',
    },
    storeProducts: [],
    productCatalog: initialProductCatalog,
    campaigns: [],
    contentItems: [],
    orders: [],
    financeHistory: [{ label: 'Starting capital', amount: capital, date: new Date().toISOString() }],
    statsData: [
      { name: 'Day 1', sales: 0, profit: 0, visitors: 1200, advertising: 120, followers: 420 },
      { name: 'Day 2', sales: 35, profit: 8, visitors: 1450, advertising: 140, followers: 440 },
      { name: 'Day 3', sales: 50, profit: 12, visitors: 1700, advertising: 165, followers: 470 },
      { name: 'Day 4', sales: 70, profit: 18, visitors: 1950, advertising: 190, followers: 520 },
    ],
  };
}

function App() {
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [researchFilter, setResearchFilter] = useState('All');
  const [sortBy, setSortBy] = useState('winningScore');
  const [capitalChoice, setCapitalChoice] = useState(10000);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState(defaultCampaignForm);
  const [contentForm, setContentForm] = useState(defaultContentForm);
  const [advisorInput, setAdvisorInput] = useState('Suggeriscimi un prodotto da lanciare questa settimana con margine forte e buon potenziale TikTok.');
  const [advisorResponse, setAdvisorResponse] = useState('DropEmpire AI Advisor è pronto. Ti aiuterà a scegliere prodotti, prezzi, copy e strategie ad.');

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/me', { credentials: 'include' });
      const data = await response.json();
      setUser(data.user || null);
      setGame(data.game || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const saveGame = async (nextGame) => {
    if (!nextGame) return;
    const response = await fetch('/api/game', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game: nextGame }),
    });
    const data = await response.json();
    setGame(data.game);
    return data.game;
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleMockLogin = () => {
    window.location.href = '/api/auth/mock-google';
  };

  const handleOnboard = async () => {
    const response = await fetch('/api/onboard', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ capital: capitalChoice }),
    });
    const data = await response.json();
    setUser(data.user);
    setGame(data.game);
  };

  const addProductToStore = async (product) => {
    const next = { ...game };
    if ((next.storeProducts || []).some((item) => item.id === product.id)) return;
    next.storeProducts = [...(next.storeProducts || []), { ...product, storePrice: Number((product.recommendedPrice * 1.06).toFixed(2)), inStore: true }];
    await saveGame(next);
  };

  const updateStorePrice = async (productId, newPrice) => {
    const next = { ...game };
    next.storeProducts = (next.storeProducts || []).map((item) => item.id === productId ? { ...item, storePrice: Number(newPrice) } : item);
    await saveGame(next);
  };

  const updateStoreField = async (field, value) => {
    const next = { ...game };
    next.store = { ...next.store, [field]: value };
    await saveGame(next);
  };

  const createCampaign = async () => {
    if (!campaignForm.productId) return;
    const product = (game.productCatalog || []).find((item) => item.id === campaignForm.productId);
    if (!product) return;

    const next = { ...game };
    const amount = Number(campaignForm.budget || 0);
    if ((next.availableCash || 0) < amount) return;

    next.availableCash = Number((next.availableCash - amount).toFixed(2));
    const campaign = {
      id: `cmp-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      status: 'Active',
      platform: campaignForm.platform,
      budget: amount,
      duration: Number(campaignForm.duration),
      audience: campaignForm.audience,
      age: campaignForm.age,
      interests: campaignForm.interests,
      country: campaignForm.country,
      objective: campaignForm.objective,
      creativity: campaignForm.creativity,
      metrics: {
        impressions: Math.round(amount * 120 + product.demand * 20),
        reach: Math.round(amount * 65 + product.demand * 16),
        cpm: 12 + (100 - product.competition) * 0.08,
        cpc: 0.8 + (100 - product.demand) * 0.03,
        ctr: 1.8 + product.trend * 0.018,
        clicks: Math.round(amount * 3.2 + product.demand * 1.4),
        addToCart: Math.round((amount / 12) + product.trend / 4),
        purchases: Math.round((amount / 18) + product.demand / 12),
        cpa: Number((amount / Math.max(1, Math.round((amount / 18) + product.demand / 12))).toFixed(2)),
        roas: 1.1 + (product.winningScore / 100) * 2.8,
      },
      createdAt: new Date().toISOString(),
    };

    next.campaigns = [campaign, ...(next.campaigns || [])];
    next.adSpend = Number((Number(next.adSpend || 0) + amount).toFixed(2));
    next.financeHistory = [{ label: 'Campaign', amount: -amount, date: new Date().toISOString() }, ...(next.financeHistory || [])];
    await saveGame(next);
    setCampaignForm({ ...defaultCampaignForm, productId: product.id });
  };

  const publishContent = async () => {
    if (!contentForm.productId) return;
    const product = (game.productCatalog || []).find((item) => item.id === contentForm.productId);
    if (!product) return;

    const next = { ...game };
    const content = {
      id: `content-${Date.now()}`,
      type: contentForm.type,
      productId: product.id,
      productName: product.name,
      platform: contentForm.platform,
      hook: contentForm.hook,
      caption: contentForm.caption,
      hashtags: contentForm.hashtags,
      cta: contentForm.cta,
      createdAt: new Date().toISOString(),
      stats: {
        views: Math.round(product.demand * 22 + (next.fame || 0) * 25),
        likes: Math.round(product.demand * 14 + (next.fame || 0) * 18),
        comments: Math.round(product.demand * 2 + (next.fame || 0) * 4),
        shares: Math.round(product.demand * 3 + (next.fame || 0) * 5),
      },
      viral: product.trend > 74 && next.fame > 25,
    };

    next.contentItems = [content, ...(next.contentItems || [])];
    next.stats = { ...next.stats, followers: (next.stats?.followers || 0) + Math.round(content.stats.likes / 25), fame: Math.min(100, (next.stats?.fame || 0) + (content.viral ? 6 : 2)) };
    next.followers = next.stats.followers;
    next.fame = next.stats.fame;
    await saveGame(next);
    setContentForm({ ...defaultContentForm, productId: product.id });
  };

  const advanceDay = async () => {
    if (!game) return;
    const next = { ...game };
    const growth = (next.stats?.growth || 0) + 1;
    const baseOrderRate = (next.fame || 15) / 100;

    next.day = (next.day || 1) + 1;
    next.stats = {
      ...next.stats,
      visitors: Math.round((next.stats?.visitors || 1800) * (1 + baseOrderRate * 0.12 + 0.03)),
      followers: Math.round((next.stats?.followers || 420) + ((next.fame || 10) * 4 + growth * 4)),
      fame: Math.min(100, (next.stats?.fame || 24) + (next.campaigns?.length || 0) * 0.7 + (next.contentItems?.filter((item) => item.viral).length || 0) * 1.5),
    };

    next.followers = next.stats.followers;
    next.fame = next.stats.fame;

    const extraOrders = Math.max(1, Math.round((next.stats?.visitors || 1200) * 0.008 * (baseOrderRate + 0.6)));
    const orderValue = Number((extraOrders * 48.5).toFixed(2));
    const supplierCost = Number((extraOrders * 18.1).toFixed(2));
    const adCost = Number((next.adSpend || 0) * 0.08).toFixed(2);

    next.orders = [{ id: `ord-${Date.now()}`, customer: `Customer ${Math.floor(Math.random() * 80) + 1}`, product: next.storeProducts?.[0]?.name || 'AI-ranked product', amount: orderValue, status: 'Delivered', total: orderValue, createdAt: new Date().toISOString() }, ...(next.orders || [])];
    next.revenue = Number((Number(next.revenue || 0) + orderValue).toFixed(2));
    next.cogs = Number((Number(next.cogs || 0) + supplierCost).toFixed(2));
    next.adSpend = Number((Number(next.adSpend || 0) + Number(adCost)).toFixed(2));
    next.netProfit = Number((next.revenue - next.cogs - next.adSpend - (next.refunds || 0) - (next.otherExpenses || 0)).toFixed(2));
    next.availableCash = Number((Number(next.availableCash || next.capital) + orderValue - supplierCost - Number(adCost)).toFixed(2));
    next.roas = Number((next.revenue / Math.max(1, next.adSpend || 1)).toFixed(2));
    next.financeHistory = [{ label: `Day ${next.day}`, amount: Number((orderValue - supplierCost - Number(adCost)).toFixed(2)), date: new Date().toISOString() }, ...(next.financeHistory || [])];
    await saveGame(next);
  };

  const askAdvisor = () => {
    const base = game?.productCatalog?.slice(0, 3) ?? [];
    const suggestion = base[0]
      ? `Suggerimento: lancia ${base[0].name} come prodotto principale. Prezzo target €${base[0].recommendedPrice}, budget giornaliero €180, CTA: “Scopri perché lo usano...”`
      : 'Suggerimento: concentra i primi 7 giorni su 1 prodotto a forte riscontro e 1 creatività sola.';
    setAdvisorResponse(suggestion);
  };

  const chartData = useMemo(() => game?.statsData || [
    { name: 'Day 1', sales: 0, profit: 0, visitors: 1200, advertising: 120, followers: 420 },
    { name: 'Day 2', sales: 35, profit: 8, visitors: 1450, advertising: 140, followers: 440 },
    { name: 'Day 3', sales: 50, profit: 12, visitors: 1700, advertising: 165, followers: 470 },
    { name: 'Day 4', sales: 70, profit: 18, visitors: 1950, advertising: 190, followers: 520 },
  ], [game]);

  if (loading) return <div className="loading-shell">Loading DropEmpire AI…</div>;

  if (!user) {
    return (
      <div className="landing-root">
        <div className="landing-shell">
          <nav className="landing-nav">
            <div className="brand-lockup">
              <div className="brand-icon">DE</div>
              <div><strong>DropEmpire AI</strong></div>
            </div>
            <div className="landing-actions">
              <button className="ghost" onClick={handleMockLogin}>Demo login</button>
              <button className="primary" onClick={handleGoogleLogin}>Accedi con Google</button>
            </div>
          </nav>

          <main className="hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">SIMULATION / VIRTUAL MONEY</span>
              <h1>Costruisci il tuo impero e-commerce in modo intelligente.</h1>
              <p>Simula ricerche prodotti, ad creative, social content, store growth e ordini virtuali.</p>
              <div className="hero-actions">
                <button className="primary" onClick={handleGoogleLogin}>Inizia a costruire il tuo impero</button>
                <button className="ghost" onClick={handleMockLogin}>Test demo</button>
              </div>
              <div className="trust-row">
                <span>Product research</span>
                <span>Marketing simulation</span>
                <span>Store growth</span>
              </div>
            </div>

            <div className="hero-panel">
              <div className="mini-card top-card">
                <div className="mini-label">Fame</div>
                <div className="big-number">82</div>
                <div className="trend positive">+18% this week</div>
              </div>
              <div className="mini-grid">
                <div className="mini-card"><div className="mini-label">ROAS</div><strong>4.2x</strong></div>
                <div className="mini-card"><div className="mini-label">Cash</div><strong>€18.4k</strong></div>
              </div>
              <div className="mini-card highlight-card">
                <div className="mini-label">Winning product</div>
                <strong>GlowLift Pro</strong>
                <p>Trend 93 · Demand 89 · Meta Ads 88</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="onboarding-shell">
        <div className="onboarding-card">
          <span className="eyebrow">Nuova partita</span>
          <h2>Seleziona il capitale iniziale virtuale</h2>
          <p className="muted">Tutto il capitale è virtuale. Non viene speso denaro reale.</p>
          <div className="capital-grid">
            {capitalOptions.map((value) => (
              <button key={value} className={`capital-btn ${capitalChoice === value ? 'selected' : ''}`} onClick={() => setCapitalChoice(value)}>
                <span>€{value.toLocaleString('it-IT')}</span>
                {value === 10000 && <small>Consigliato</small>}
              </button>
            ))}
          </div>
          <button className="primary big" onClick={handleOnboard}>Inizia la partita</button>
        </div>
      </div>
    );
  }

  const storeProducts = game.storeProducts || [];
  const productCatalog = game.productCatalog || [];
  const activeCampaigns = game.campaigns || [];
  const socialContent = game.contentItems || [];
  const orders = game.orders || [];

  const renderDashboard = () => (
    <>
      <div className="page-header">
        <div><span className="eyebrow">Dashboard</span><h2>Overview</h2></div>
        <div className="header-actions">
          <button className="ghost" onClick={advanceDay}>Advance 1 day</button>
          <button className="primary" onClick={() => setActiveTab('research')}>Find products</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Saldo disponibile</span><strong>€{Number(game.availableCash || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Fatturato</span><strong>€{Number(game.revenue || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Profitto netto</span><strong>€{Number(game.netProfit || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Spese ads</span><strong>€{Number(game.adSpend || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>ROAS</span><strong>{Number(game.roas || 0).toFixed(2)}x</strong></div>
        <div className="stat-card"><span>Ordini</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Visitatori</span><strong>{(game.stats?.visitors || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Conversion rate</span><strong>{(game.stats?.conversionRate || 2.4).toFixed(2)}%</strong></div>
        <div className="stat-card"><span>Clienti</span><strong>{(game.stats?.customers || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Follower</span><strong>{(game.followers || game.stats?.followers || 0).toLocaleString('it-IT')}</strong></div>
        <div className="stat-card"><span>Fama</span><strong>{(game.fame || game.stats?.fame || 0).toFixed(0)}/100</strong></div>
        <div className="stat-card"><span>Valore store</span><strong>€{Number(game.storeValue || (game.availableCash * 1.8)).toLocaleString('it-IT')}</strong></div>
      </div>

      <div className="chart-panel-grid">
        <div className="chart-card large">
          <div className="panel-header"><h3>Vendite</h3><div className="segmented">{['Oggi', '7 giorni', '30 giorni', '90 giorni', 'Tutto'].map((item) => <span key={item}>{item}</span>)}</div></div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2b3455" />
              <XAxis dataKey="name" stroke="#8aa0c4" />
              <YAxis stroke="#8aa0c4" />
              <Tooltip />
              <Area type="monotone" dataKey="sales" stroke="#8b5cf6" fill="url(#salesFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card"><h3>Profitto</h3><ResponsiveContainer width="100%" height={220}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2b3455" /><XAxis dataKey="name" stroke="#8aa0c4" /><YAxis stroke="#8aa0c4" /><Tooltip /><Bar dataKey="profit" fill="#34d399" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
        <div className="chart-card"><h3>Visitatori</h3><ResponsiveContainer width="100%" height={220}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2b3455" /><XAxis dataKey="name" stroke="#8aa0c4" /><YAxis stroke="#8aa0c4" /><Tooltip /><Line type="monotone" dataKey="visitors" stroke="#60a5fa" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        <div className="chart-card"><h3>Advertising</h3><ResponsiveContainer width="100%" height={220}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#2b3455" /><XAxis dataKey="name" stroke="#8aa0c4" /><YAxis stroke="#8aa0c4" /><Tooltip /><Bar dataKey="advertising" fill="#f59e0b" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div>
        <div className="chart-card"><h3>Follower</h3><ResponsiveContainer width="100%" height={220}><AreaChart data={chartData}><defs><linearGradient id="followersFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.7} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} /></linearGradient></defs><XAxis dataKey="name" stroke="#8aa0c4" /><YAxis stroke="#8aa0c4" /><Tooltip /><Area type="monotone" dataKey="followers" stroke="#22c55e" fill="url(#followersFill)" /></AreaChart></ResponsiveContainer></div>
      </div>
    </>
  );

  const renderResearch = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">Product Research</span><h2>Catalogo prodotti</h2></div></div>
      <div className="toolbar-row">
        <select value={researchFilter} onChange={(e) => setResearchFilter(e.target.value)}>
          {['All', 'Beauty', 'Wellness', 'Home', 'Tech', 'Fitness', 'Kitchen', 'Lifestyle'].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="winningScore">Winning Score</option>
          <option value="estimatedSales">Estimated sales</option>
          <option value="demand">Demand</option>
          <option value="tikTok">TikTok potential</option>
        </select>
      </div>

      <div className="product-grid">
        {(productCatalog || [])
          .filter((product) => researchFilter === 'All' ? true : product.category === researchFilter)
          .sort((a, b) => {
            if (sortBy === 'estimatedSales') return b.estimatedSales - a.estimatedSales;
            if (sortBy === 'demand') return b.demand - a.demand;
            if (sortBy === 'tikTok') return b.tikTok - a.tikTok;
            return b.winningScore - a.winningScore;
          })
          .map((product) => {
            const isAdded = (storeProducts || []).some((item) => item.id === product.id);
            const currentStorePrice = (storeProducts || []).find((item) => item.id === product.id)?.storePrice ?? product.recommendedPrice;
            return (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <div className="product-body">
                  <div className="meta-row"><span className="pill">{product.category}</span><span className="score">Winning Score {product.winningScore}</span></div>
                  <h4>{product.name}</h4>
                  <div className="stats-grid small-grid">
                    <div><span>Supplier</span><strong>€{product.supplierCost}</strong></div>
                    <div><span>Price</span><strong>€{product.recommendedPrice}</strong></div>
                    <div><span>Margin</span><strong>{product.margin}%</strong></div>
                    <div><span>Trend</span><strong>{product.trend}</strong></div>
                  </div>
                  <div className="score-bars">
                    <div><label>Demand {product.demand}</label><div className="bar"><span style={{ width: `${product.demand}%` }} /></div></div>
                    <div><label>Competition {product.competition}</label><div className="bar"><span style={{ width: `${100 - product.competition}%` }} /></div></div>
                  </div>
                  <div className="product-footer">
                    <div><span>Estimated sales</span><strong>{product.estimatedSales}</strong></div>
                    <button className="primary" onClick={() => addProductToStore(product)} disabled={isAdded}>{isAdded ? 'Added to Store' : 'Add to Store'}</button>
                  </div>
                  {isAdded && (
                    <div className="inline-price">
                      <label>Sell at</label>
                      <input type="number" min="10" step="0.5" value={currentStorePrice} onChange={(e) => updateStorePrice(product.id, Number(e.target.value))} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );

  const renderStore = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">Store Builder</span><h2>Brand & storefront</h2></div></div>
      <div className="split-layout">
        <div className="panel">
          <div className="field-grid">
            <label>Nome store<input value={game.store.name} onChange={(e) => updateStoreField('name', e.target.value)} /></label>
            <label>Logo/Brand<input value={game.store.logo || 'DE'} onChange={(e) => updateStoreField('logo', e.target.value)} /></label>
            <label>Colore primario<input type="color" value={game.store.colors?.primary || '#8b5cf6'} onChange={(e) => updateStoreField('colors', { ...game.store.colors, primary: e.target.value })} /></label>
            <label>Colore secondario<input type="color" value={game.store.colors?.accent || '#22c55e'} onChange={(e) => updateStoreField('colors', { ...game.store.colors, accent: e.target.value })} /></label>
            <label className="full">Homepage copy<textarea rows={4} value={game.store.homepage || 'Build the next generation of premium products.'} onChange={(e) => updateStoreField('homepage', e.target.value)} /></label>
          </div>
        </div>

        <div className="store-preview panel">
          <div className="preview-topbar" style={{ background: game.store.colors?.primary || '#8b5cf6' }}>
            <div className="preview-logo">{game.store.logo || 'DE'}</div>
            <strong>{game.store.name}</strong>
          </div>
          <div className="preview-hero">
            <div><span className="eyebrow">Top products</span><h3>{game.store.homepage || 'Premium product drops'}</h3></div>
            <button className="primary" style={{ background: game.store.colors?.accent || '#22c55e' }}>Shop now</button>
          </div>
          <div className="preview-grid">
            {(storeProducts || []).slice(0, 4).map((product) => (
              <div className="preview-item" key={product.id}><img src={product.image} alt={product.name} /><strong>{product.name}</strong><span>€{product.storePrice || product.recommendedPrice}</span></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderMarketing = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">Marketing Hub</span><h2>Meta Ads Manager</h2></div></div>
      <div className="split-layout">
        <div className="panel">
          <div className="field-grid">
            <label>Prodotto<select value={campaignForm.productId} onChange={(e) => setCampaignForm({ ...campaignForm, productId: e.target.value })}><option value="">Seleziona</option>{(productCatalog || []).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
            <label>Budget giornaliero<input type="number" value={campaignForm.budget} onChange={(e) => setCampaignForm({ ...campaignForm, budget: e.target.value })} /></label>
            <label>Durata (giorni)<input type="number" value={campaignForm.duration} onChange={(e) => setCampaignForm({ ...campaignForm, duration: e.target.value })} /></label>
            <label>Pubblico<input value={campaignForm.audience} onChange={(e) => setCampaignForm({ ...campaignForm, audience: e.target.value })} /></label>
            <label>Età<input value={campaignForm.age} onChange={(e) => setCampaignForm({ ...campaignForm, age: e.target.value })} /></label>
            <label>Interessi<input value={campaignForm.interests} onChange={(e) => setCampaignForm({ ...campaignForm, interests: e.target.value })} /></label>
            <label>Paese<input value={campaignForm.country} onChange={(e) => setCampaignForm({ ...campaignForm, country: e.target.value })} /></label>
            <label>Obiettivo<select value={campaignForm.objective} onChange={(e) => setCampaignForm({ ...campaignForm, objective: e.target.value })}><option value="Sales">Sales</option><option value="Leads">Leads</option><option value="Awareness">Awareness</option></select></label>
            <label className="full">Creatività<input value={campaignForm.creativity} onChange={(e) => setCampaignForm({ ...campaignForm, creativity: e.target.value })} /></label>
          </div>
          <button className="primary" onClick={createCampaign}>Create campaign</button>
        </div>

        <div className="panel">
          <h3>Campagne attive</h3>
          <div className="campaign-list">
            {activeCampaigns.length === 0 ? <p className="empty-state">Nessuna campagna attiva.</p> : activeCampaigns.map((camp) => (
              <div className="campaign-item" key={camp.id}><div className="campaign-top"><strong>{camp.productName}</strong><span className="pill success">{camp.status}</span></div><div className="stats-grid small-grid"><div><span>Budget</span><strong>€{camp.budget}</strong></div><div><span>Impressions</span><strong>{camp.metrics?.impressions}</strong></div><div><span>CTR</span><strong>{camp.metrics?.ctr?.toFixed(2)}%</strong></div><div><span>ROAS</span><strong>{camp.metrics?.roas?.toFixed(2)}x</strong></div></div></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderContent = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">Content Studio</span><h2>Video virali & social content</h2></div></div>
      <div className="split-layout">
        <div className="panel">
          <div className="field-grid">
            <label>Prodotto<select value={contentForm.productId} onChange={(e) => setContentForm({ ...contentForm, productId: e.target.value })}><option value="">Seleziona</option>{(productCatalog || []).map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
            <label>Tipo<select value={contentForm.type} onChange={(e) => setContentForm({ ...contentForm, type: e.target.value })}>{['Unboxing', 'Problem/Solution', 'UGC', 'Testimonial', 'Before/After', 'Viral Hook', 'Product Demo'].map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
            <label>Piattaforma<select value={contentForm.platform} onChange={(e) => setContentForm({ ...contentForm, platform: e.target.value })}>{platforms.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            <label className="full">Hook<textarea rows={2} value={contentForm.hook} onChange={(e) => setContentForm({ ...contentForm, hook: e.target.value })} /></label>
            <label className="full">Caption<textarea rows={3} value={contentForm.caption} onChange={(e) => setContentForm({ ...contentForm, caption: e.target.value })} /></label>
            <label className="full">Hashtag & CTA<input value={`${contentForm.hashtags} · ${contentForm.cta}`} onChange={(e) => { const value = e.target.value; const split = value.split(' · '); setContentForm({ ...contentForm, hashtags: split[0] || '#viral', cta: split[1] || 'Scopri di più' }); }} /></label>
          </div>
          <div className="content-actions"><button className="primary" onClick={publishContent}>Pubblica</button><button className="ghost" onClick={() => setContentForm({ ...defaultContentForm, productId: productCatalog[0]?.id || '' })}>Reset</button></div>
        </div>

        <div className="panel">
          <h3>Anteprima 9:16</h3>
          <div className="video-preview"><div className="video-frame"><div className="video-topline">{contentForm.platform}</div><h4>{contentForm.type}</h4><p>{contentForm.hook}</p><span>{contentForm.caption}</span><strong>{contentForm.cta}</strong></div></div>
          <div className="content-list">{socialContent.length === 0 ? <p className="empty-state">Nessun contenuto pubblicato.</p> : socialContent.slice(0, 4).map((content) => <div className="content-item" key={content.id}><div className="content-meta"><span>{content.platform}</span><span>{content.type}</span></div><strong>{content.productName}</strong><p>{content.hook}</p><small>{content.stats?.views} views · {content.stats?.likes} likes</small></div>)}</div>
        </div>
      </div>
    </>
  );

  const renderOrders = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">Orders & Finance</span><h2>Ordini e cash flow</h2></div></div>
      <div className="finance-grid">
        <div className="panel">
          <h3>Conto economico</h3>
          <div className="finance-list">
            <div><span>Revenue</span><strong>€{Number(game.revenue || 0).toLocaleString('it-IT')}</strong></div>
            <div><span>COGS</span><strong>€{Number(game.cogs || 0).toLocaleString('it-IT')}</strong></div>
            <div><span>Ad Spend</span><strong>€{Number(game.adSpend || 0).toLocaleString('it-IT')}</strong></div>
            <div><span>Gross Profit</span><strong>€{Number((game.revenue || 0) - (game.cogs || 0)).toLocaleString('it-IT')}</strong></div>
            <div><span>Net Profit</span><strong>€{Number(game.netProfit || 0).toLocaleString('it-IT')}</strong></div>
            <div><span>Cash Flow</span><strong>€{Number(game.availableCash || 0).toLocaleString('it-IT')}</strong></div>
            <div><span>ROAS</span><strong>{Number(game.roas || 0).toFixed(2)}x</strong></div>
          </div>
        </div>

        <div className="panel">
          <h3>Ordini</h3>
          <div className="orders-list">
            {orders.length === 0 ? <p className="empty-state">Nessun ordine ancora.</p> : orders.slice(0, 8).map((order) => (
              <div className="order-item" key={order.id}><div><strong>{order.customer}</strong><small>{order.product}</small></div><div><span className="pill success">{order.status}</span><strong>€{Number(order.amount || 0).toLocaleString('it-IT')}</strong></div></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderAI = () => (
    <>
      <div className="page-header"><div><span className="eyebrow">AI Advisor</span><h2>DropEmpire AI Advisor</h2></div></div>
      <div className="panel ai-shell">
        <textarea value={advisorInput} onChange={(e) => setAdvisorInput(e.target.value)} rows={4} />
        <div className="ai-actions"><button className="primary" onClick={askAdvisor}>Ask advisor</button></div>
        <div className="ai-response"><strong>Risposta</strong><p>{advisorResponse}</p></div>
      </div>
    </>
  );

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'research': return renderResearch();
      case 'store': return renderStore();
      case 'marketing': return renderMarketing();
      case 'content': return renderContent();
      case 'orders': return renderOrders();
      case 'ai': return renderAI();
      default: return renderDashboard();
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-icon">DE</div>
          <div><strong>DropEmpire AI</strong><small>VIRTUAL BUSINESS</small></div>
        </div>
        <nav>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'research', label: 'Product Research', icon: Search },
            { id: 'store', label: 'Store', icon: Store },
            { id: 'marketing', label: 'Marketing', icon: Megaphone },
            { id: 'content', label: 'Content Studio', icon: MonitorPlay },
            { id: 'orders', label: 'Ordini', icon: Package },
            { id: 'ai', label: 'AI Advisor', icon: Wand2 },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="avatar">{user.name?.slice(0, 2).toUpperCase() || 'U'}</div>
            <div><strong>{user.name}</strong><small>{user.email}</small></div>
          </div>
          <button className="ghost" onClick={() => window.location.href = '/api/auth/logout'}>Logout</button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-toggle" onClick={() => setMobileMenuOpen((value) => !value)}>☰</button>
          <div className="topbar-badges"><span className="badge success">SIMULATION</span><span className="badge warning">VIRTUAL MONEY</span></div>
          <div className="topbar-user"><Sparkles size={16} /><span>Fama {Number(game.fame || 0).toFixed(0)}/100</span></div>
        </header>
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
