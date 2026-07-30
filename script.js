import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Heart, X, MessageCircle, Filter, MapPin, Search, ChevronLeft,
  Zap, Award, CheckCircle2, Send, User, Home, Ticket, ShieldCheck,
  Star, Clock, Sparkles, ArrowRight, Smartphone, Building2, Sun,
  Waves, Mountain, Sunrise, Landmark, Users, Calendar, Gauge,
  QrCode, ChevronRight, Flag, TrendingUp, BadgeCheck, Plus, Minus,
  SlidersHorizontal, RefreshCcw, Footprints
} from "lucide-react";

/* =========================================================================
   MOCK DATA
   ========================================================================= */

const RUNNERS = [
  { id: 1, name: "Dinda Pratiwi", age: 26, gender: "female", pace: "5:45", distance: "5K / 10K", location: "GBK, Jakarta", bio: "Ngejar sunrise di GBK tiap minggu 🌅", seed: "Dinda-Pratiwi", registeredEvents: [1, 3] },
  { id: 2, name: "Bagas Wirawan", age: 29, gender: "male", pace: "4:50", distance: "10K / HM", location: "Lapangan Merdeka, Medan", bio: "Easy run santai, sub-2 jam half marathon.", seed: "Bagas-Wirawan", registeredEvents: [6] },
  { id: 3, name: "Sari Maharani", age: 24, gender: "female", pace: "6:15", distance: "5K", location: "Alun-Alun, Bandung", bio: "Baru mulai lari, cari partner santai & konsisten.", seed: "Sari-Maharani", registeredEvents: [2] },
  { id: 4, name: "Rian Saputra", age: 31, gender: "male", pace: "5:10", distance: "Half Marathon", location: "Kenjeran, Surabaya", bio: "Target sub-1:45 tahun ini. Gas terus!", seed: "Rian-Saputra", registeredEvents: [3] },
  { id: 5, name: "Nadya Kusuma", age: 27, gender: "female", pace: "5:30", distance: "10K", location: "GBK, Jakarta", bio: "Weekday morning runs, weekend long run.", seed: "Nadya-Kusuma", registeredEvents: [1] },
  { id: 6, name: "Fajar Nugroho", age: 34, gender: "male", pace: "4:30", distance: "Full Marathon", location: "Malioboro, Yogyakarta", bio: "Marathon ke-5, cari pacer buat LSD 30K.", seed: "Fajar-Nugroho", registeredEvents: [5] },
  { id: 7, name: "Intan Permatasari", age: 23, gender: "female", pace: "6:00", distance: "5K / 10K", location: "Sanur, Denpasar", bio: "Lari sambil healing pinggir pantai 🌊", seed: "Intan-Permatasari", registeredEvents: [4] },
  { id: 8, name: "Yoga Pradana", age: 28, gender: "male", pace: "5:00", distance: "10K", location: "GBK, Jakarta", bio: "Ex-atlet kampus, sekarang lari buat fun.", seed: "Yoga-Pradana", registeredEvents: [1] },
  { id: 9, name: "Kirana Ayu", age: 25, gender: "female", pace: "5:50", distance: "10K / HM", location: "Kota Tua, Jakarta", bio: "Suka nightrun sambil foto-foto sunset.", seed: "Kirana-Ayu", registeredEvents: [] },
  { id: 10, name: "Dimas Anggara", age: 30, gender: "male", pace: "4:45", distance: "Half Marathon", location: "Kenjeran, Surabaya", bio: "Interval Selasa & Kamis, LSD tiap Minggu.", seed: "Dimas-Anggara", registeredEvents: [3] },
];

const EVENT_ICONS = [Sun, Mountain, Waves, Landmark, Sunrise, Flag];
const EVENT_GRADIENTS = [
  ["#1E222B", "#3a4210"],
  ["#1E222B", "#4a1f0a"],
  ["#1E222B", "#123130"],
  ["#1E222B", "#2a1f3a"],
  ["#1E222B", "#3a2a10"],
  ["#1E222B", "#123a2a"],
];

const EVENTS = [
  { id: 1, name: "Jakarta Night Run 10K", date: "2026-09-06", location: "GBK, Senayan, Jakarta", price: 350000, slotsLeft: 120, totalSlots: 2000, categories: ["5K", "10K"], desc: "Lari malam mengelilingi kawasan GBK dengan rute bercahaya lampu kota Jakarta. Cocok buat kamu yang suka suasana race yang seru dan penuh energi." },
  { id: 2, name: "Bandung Heritage Half Marathon", date: "2026-08-23", location: "Alun-Alun Bandung", price: 450000, slotsLeft: 45, totalSlots: 1500, categories: ["10K", "Half Marathon"], desc: "Rute menyusuri gedung-gedung heritage kota Bandung dengan udara sejuk khas Paris van Java." },
  { id: 3, name: "Surabaya City Run", date: "2026-09-20", location: "Kenjeran Park, Surabaya", price: 275000, slotsLeft: 300, totalSlots: 3000, categories: ["5K", "10K"], desc: "Race pagi hari di sepanjang pesisir Kenjeran dengan pemandangan Jembatan Suramadu." },
  { id: 4, name: "Bali Beach Marathon", date: "2026-10-11", location: "Sanur Beach, Denpasar", price: 650000, slotsLeft: 80, totalSlots: 1000, categories: ["Half Marathon", "Full Marathon"], desc: "Marathon pinggir pantai Sanur dengan sunrise terbaik di Bali. Full marathon paling scenic tahun ini." },
  { id: 5, name: "Yogyakarta Heritage Run", date: "2026-08-30", location: "Malioboro, Yogyakarta", price: 300000, slotsLeft: 200, totalSlots: 2500, categories: ["5K", "10K"], desc: "Lari melewati Jalan Malioboro dan Tugu Jogja yang ikonik, ditutup dengan jajanan pasar lokal di finish line." },
  { id: 6, name: "Medan Sunrise 5K", date: "2026-09-13", location: "Lapangan Merdeka, Medan", price: 200000, slotsLeft: 15, totalSlots: 800, categories: ["5K"], desc: "Fun run santai buat keluarga di jantung kota Medan, sarapan lontong Medan gratis di finish line." },
];

const CATEGORY_TAGS = ["All", "5K", "10K", "Half Marathon", "Full Marathon"];
const LOCATIONS = ["all", ...Array.from(new Set(RUNNERS.map(r => r.location)))];

/* =========================================================================
   HELPERS
   ========================================================================= */

const formatIDR = (n) => "Rp " + n.toLocaleString("id-ID");
const paceToNum = (p) => { const [m, s] = p.split(":").map(Number); return m + s / 60; };
const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const avatarUrl = (seed) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1e222b,20242e,171a21`;
const qrUrl = (data, size = 180) => `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=1E222B&color=CCFF00&qzone=1&data=${encodeURIComponent(data)}`;
const genBib = (eventId) => `PM-${eventId}${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;

/* =========================================================================
   THEME STYLES (Diubah prefix CSS class ke pm-*)
   ========================================================================= */

function ThemeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
      .pm-root { font-family: 'Inter', sans-serif; background:#0B0D12; color:#F5F7FA; }
      .pm-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
      .pm-mono { font-family: 'JetBrains Mono', monospace; }
      .pm-surface { background:#12151C; }
      .pm-card { background:#1B1F28; }
      .pm-card-alt { background:#20242E; }
      .pm-border { border-color:#272C38; }
      .pm-lime { color:#CCFF00; }
      .pm-bg-lime { background-color:#CCFF00; }
      .pm-orange { color:#FF5A1F; }
      .pm-bg-orange { background-color:#FF5A1F; }
      .pm-muted { color:#8B92A5; }
      .pm-track-lanes {
        background-image: repeating-linear-gradient(115deg, rgba(204,255,0,0.05) 0px, rgba(204,255,0,0.05) 2px, transparent 2px, transparent 26px);
      }
      .pm-scrollbar-none::-webkit-scrollbar { display:none; }
      .pm-scrollbar-none { -ms-overflow-style:none; scrollbar-width:none; }
      .pm-btn-lime { background:#CCFF00; color:#0B0D12; }
      .pm-btn-lime:active { transform: scale(0.97); }
      .pm-btn-orange { background:#FF5A1F; color:#0B0D12; }
      .pm-tag-active { background:#CCFF00; color:#0B0D12; }
      .pm-tag { background:#1B1F28; color:#8B92A5; border:1px solid #272C38; }
      .pm-fade-in { animation: pmFadeIn 0.25s ease; }
      @keyframes pmFadeIn { from { opacity:0; transform: translateY(6px);} to { opacity:1; transform:translateY(0);} }
      .pm-pop { animation: pmPop 0.35s cubic-bezier(.34,1.56,.64,1); }
      @keyframes pmPop { from { opacity:0; transform: scale(0.7);} to { opacity:1; transform:scale(1);} }
      input, select, textarea { background:#12151C; color:#F5F7FA; }
      input:focus, select:focus, textarea:focus { outline: 2px solid #CCFF00; outline-offset:1px; }
      ::placeholder { color:#5A6072; }
    `}</style>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${active ? "pm-tag-active" : "pm-tag"}`}
    >
      {children}
    </button>
  );
}

function GenderTag({ gender }) {
  const isFemale = gender === "female";
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full pm-mono"
      style={{ background: isFemale ? "rgba(255,90,31,0.18)" : "rgba(204,255,0,0.15)", color: isFemale ? "#FF8A5B" : "#CCFF00" }}
    >
      {isFemale ? "FEMALE" : "MALE"}
    </span>
  );
}

/* =========================================================================
   BOTTOM NAV
   ========================================================================= */

function BottomNav({ tab, setTab }) {
  const items = [
    { id: "home", label: "Cari Buddy", icon: Zap },
    { id: "events", label: "Event Lari", icon: Calendar },
    { id: "profile", label: "Profil", icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div className="w-full max-w-md pm-surface border-t pm-border flex items-stretch" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {items.map((it) => {
          const Icon = it.icon;
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className="flex-1 flex flex-col items-center gap-1 py-2.5"
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} className={active ? "pm-lime" : "pm-muted"} />
              <span className={`text-[10px] font-semibold ${active ? "pm-lime" : "pm-muted"}`}>{it.label}</span>
              {active && <span className="w-1 h-1 rounded-full pm-bg-lime" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   FILTER MODAL
   ========================================================================= */

function FilterModal({ open, onClose, filters, setFilters }) {
  const [local, setLocal] = useState(filters);
  useEffect(() => { if (open) setLocal(filters); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md pm-card rounded-t-3xl p-5 pm-fade-in max-h-[85vh] overflow-y-auto pm-scrollbar-none">
        <div className="w-10 h-1 rounded-full bg-gray-600 mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="pm-display text-2xl">FILTER RUNNER</h3>
          <button onClick={onClose}><X size={22} className="pm-muted" /></button>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold pm-muted mb-2 uppercase tracking-wide">Gender</p>
          <div className="flex gap-2">
            <Pill active={local.gender === "all"} onClick={() => setLocal({ ...local, gender: "all" })}>Semua</Pill>
            <Pill active={local.gender === "female"} onClick={() => setLocal({ ...local, gender: "female" })}>Female Only</Pill>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold pm-muted mb-2 uppercase tracking-wide">Target Pace (min/km)</p>
          <div className="flex items-center gap-3">
            <input type="number" step="0.1" value={local.paceMin} onChange={(e) => setLocal({ ...local, paceMin: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl px-3 py-2 pm-mono text-sm pm-border border" />
            <span className="pm-muted">—</span>
            <input type="number" step="0.1" value={local.paceMax} onChange={(e) => setLocal({ ...local, paceMax: parseFloat(e.target.value) || 0 })} className="w-full rounded-xl px-3 py-2 pm-mono text-sm pm-border border" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold pm-muted mb-2 uppercase tracking-wide">Lokasi Favorit</p>
          <select value={local.location} onChange={(e) => setLocal({ ...local, location: e.target.value })} className="w-full rounded-xl px-3 py-2.5 text-sm pm-border border">
            {LOCATIONS.map((loc) => <option key={loc} value={loc}>{loc === "all" ? "Semua Lokasi" : loc}</option>)}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setLocal({ gender: "all", paceMin: 3, paceMax: 8, location: "all" })} className="flex-1 py-3 rounded-xl pm-tag text-sm font-semibold flex items-center justify-center gap-1">
            <RefreshCcw size={14} /> Reset
          </button>
          <button onClick={() => { setFilters(local); onClose(); }} className="flex-1 py-3 rounded-xl pm-btn-lime text-sm font-bold">
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SWIPE CARD
   ========================================================================= */

function SwipeCard({ runner, onSwiped, topCard }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false });
  const startRef = useRef({ x: 0, y: 0 });

  const onDown = (e) => {
    if (!topCard) return;
    const p = e.touches ? e.touches[0] : e;
    startRef.current = { x: p.clientX, y: p.clientY };
    setDrag((d) => ({ ...d, dragging: true }));
  };
  const onMove = (e) => {
    if (!drag.dragging || !topCard) return;
    const p = e.touches ? e.touches[0] : e;
    setDrag({ x: p.clientX - startRef.current.x, y: p.clientY - startRef.current.y, dragging: true });
  };
  const finish = (dir) => {
    setDrag({ x: dir === "left" ? -600 : dir === "right" ? 600 : 0, y: 0, dragging: false });
    setTimeout(() => onSwiped(dir), 180);
  };
  const onUp = () => {
    if (!drag.dragging) return;
    if (drag.x > 110) finish("right");
    else if (drag.x < -110) finish("left");
    else setDrag({ x: 0, y: 0, dragging: false });
  };

  const rotate = drag.x / 18;
  const likeOpacity = Math.min(Math.max(drag.x / 100, 0), 1);
  const passOpacity = Math.min(Math.max(-drag.x / 100, 0), 1);

  return (
    <div
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      className="absolute inset-0 select-none"
      style={{
        transform: `translate(${drag.x}px, ${drag.y * 0.15}px) rotate(${rotate}deg)`,
        transition: drag.dragging ? "none" : "transform 0.3s ease",
        touchAction: "pan-y",
      }}
    >
      <div className="pm-card pm-border border rounded-3xl h-full w-full overflow-hidden flex flex-col shadow-2xl relative">
        <div className="absolute top-5 left-5 z-20 rotate-[-12deg] border-4 rounded-lg px-3 py-1 font-black text-lg pm-display" style={{ borderColor: "#CCFF00", color: "#CCFF00", opacity: likeOpacity }}>RUN BUDDY</div>
        <div className="absolute top-5 right-5 z-20 rotate-[12deg] border-4 rounded-lg px-3 py-1 font-black text-lg pm-display" style={{ borderColor: "#FF5A1F", color: "#FF5A1F", opacity: passOpacity }}>SKIP</div>

        <div className="h-3/5 relative pm-track-lanes" style={{ background: "linear-gradient(160deg,#20242E,#12151C)" }}>
          <img src={avatarUrl(runner.seed)} alt={runner.name} className="w-full h-full object-contain p-2" draggable="false" />
          <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(transparent, #1B1F28)" }} />
        </div>

        <div className="flex-1 p-5 flex flex-col gap-3 overflow-y-auto pm-scrollbar-none">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="pm-display text-3xl leading-none">{runner.name.toUpperCase()}, {runner.age}</h2>
              <p className="pm-muted text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> {runner.location}</p>
            </div>
            <GenderTag gender={runner.gender} />
          </div>
          <p className="text-sm pm-muted italic">"{runner.bio}"</p>
          <div className="flex gap-2 mt-1">
            <div className="pm-card-alt rounded-xl px-3 py-2 flex-1">
              <p className="text-[10px] pm-muted uppercase font-semibold flex items-center gap-1"><Gauge size={11} /> Easy Pace</p>
              <p className="pm-mono pm-lime font-bold text-sm">{runner.pace} /km</p>
            </div>
            <div className="pm-card-alt rounded-xl px-3 py-2 flex-1">
              <p className="text-[10px] pm-muted uppercase font-semibold flex items-center gap-1"><Flag size={11} /> Target</p>
              <p className="pm-mono font-bold text-sm" style={{ color: "#FF8A5B" }}>{runner.distance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MATCHMAKING TAB
   ========================================================================= */

function MatchmakingTab({ matches, setMatches, chats, setChats, buddyEventFilter, clearBuddyFilter, openChat }) {
  const [subTab, setSubTab] = useState("swipe");
  const [filters, setFilters] = useState({ gender: "all", paceMin: 3, paceMax: 8, location: "all" });
  const [showFilter, setShowFilter] = useState(false);
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState(null);

  const passedOrMatched = useMemo(() => new Set(matches.map((m) => m.id)), [matches]);

  const filtered = useMemo(() => {
    return RUNNERS.filter((r) => {
      if (buddyEventFilter && !r.registeredEvents.includes(buddyEventFilter.id)) return false;
      if (filters.gender === "female" && r.gender !== "female") return false;
      const p = paceToNum(r.pace);
      if (p < filters.paceMin || p > filters.paceMax) return false;
      if (filters.location !== "all" && r.location !== filters.location) return false;
      return true;
    });
  }, [filters, buddyEventFilter]);

  useEffect(() => { setIndex(0); }, [filters, buddyEventFilter]);

  const stack = filtered.slice(index, index + 2);

  const handleSwipe = (dir) => {
    const runner = filtered[index];
    if (dir === "right" && runner) {
      if (!passedOrMatched.has(runner.id)) {
        setMatches((prev) => [...prev, runner]);
        setToast(runner);
        setTimeout(() => setToast(null), 1600);
      }
    }
    setIndex((i) => i + 1);
  };

  const handleDirectChat = () => {
    const runner = filtered[index];
    if (!runner) return;
    if (!passedOrMatched.has(runner.id)) setMatches((prev) => [...prev, runner]);
    setIndex((i) => i + 1);
    setTimeout(() => openChat(runner), 50);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 pm-surface border-b pm-border sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="pm-display text-3xl leading-none">PACE<span className="pm-lime">MATCH</span></h1>
            <p className="pm-muted text-xs">Temukan running buddy-mu</p>
          </div>
          <button onClick={() => setShowFilter(true)} className="w-10 h-10 rounded-full pm-card pm-border border flex items-center justify-center">
            <SlidersHorizontal size={17} className="pm-lime" />
          </button>
        </div>
        <div className="flex gap-2">
          <Pill active={subTab === "swipe"} onClick={() => setSubTab("swipe")}>Cari Buddy</Pill>
          <Pill active={subTab === "matches"} onClick={() => setSubTab("matches")}>
            Matches {matches.length > 0 && <span className="ml-1 pm-mono">({matches.length})</span>}
          </Pill>
        </div>
        {buddyEventFilter && (
          <div className="mt-3 flex items-center gap-2 pm-fade-in">
            <span className="text-[11px] px-3 py-1.5 rounded-full flex items-center gap-2" style={{ background: "rgba(204,255,0,0.12)", color: "#CCFF00" }}>
              Peserta {buddyEventFilter.name}
              <button onClick={clearBuddyFilter}><X size={12} /></button>
            </span>
          </div>
        )}
      </div>

      {subTab === "swipe" ? (
        <div className="flex-1 relative px-4 py-4 flex flex-col">
          <div className="relative flex-1" style={{ minHeight: 420 }}>
            {stack.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pm-card pm-border border rounded-3xl pm-fade-in text-center px-6">
                <Users size={40} className="pm-muted mb-3" />
                <p className="pm-display text-2xl">HABIS NIH!</p>
                <p className="pm-muted text-sm mt-1">Semua runner di filter ini udah kamu lihat. Coba ubah filter atau reset.</p>
                <button onClick={() => setIndex(0)} className="mt-4 px-5 py-2.5 rounded-xl pm-btn-lime text-sm font-bold">Ulangi dari Awal</button>
              </div>
            )}
            {stack.slice().reverse().map((r, i) => (
              <SwipeCard key={r.id} runner={r} topCard={i === stack.length - 1} onSwiped={handleSwipe} />
            ))}
          </div>

          {stack.length > 0 && (
            <div className="flex items-center justify-center gap-4 pt-5">
              <button onClick={() => handleSwipe("left")} className="w-14 h-14 rounded-full pm-card pm-border border-2 flex items-center justify-center active:scale-95 transition">
                <X size={24} style={{ color: "#FF5A1F" }} />
              </button>
              <button onClick={handleDirectChat} className="w-12 h-12 rounded-full pm-card pm-border border flex items-center justify-center active:scale-95 transition">
                <MessageCircle size={18} className="pm-muted" />
              </button>
              <button onClick={() => handleSwipe("right")} className="w-16 h-16 rounded-full pm-btn-lime flex items-center justify-center active:scale-95 transition shadow-lg" style={{ boxShadow: "0 0 24px rgba(204,255,0,0.35)" }}>
                <Zap size={28} fill="#0B0D12" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <MatchesList matches={matches} chats={chats} openChat={openChat} />
      )}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pm-pop">
          <div className="pm-btn-lime rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-xl font-bold text-sm">
            <Sparkles size={16} /> Ajak lari {toast.name.split(" ")[0]}!
          </div>
        </div>
      )}

      <FilterModal open={showFilter} onClose={() => setShowFilter(false)} filters={filters} setFilters={setFilters} />
    </div>
  );
}

function MatchesList({ matches, chats, openChat }) {
  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <Zap size={40} className="pm-muted mb-3" />
        <p className="pm-display text-2xl">BELUM ADA MATCH</p>
        <p className="pm-muted text-sm mt-1">Klik tombol kilat/run di tab Cari Buddy buat ajak running buddy-mu!</p>
      </div>
    );
  }
  return (
    <div className="flex-1 overflow-y-auto pm-scrollbar-none px-4 py-3 space-y-2">
      {matches.map((m) => {
        const thread = chats[m.id] || [];
        const last = thread[thread.length - 1];
        return (
          <button key={m.id} onClick={() => openChat(m)} className="w-full pm-card pm-border border rounded-2xl p-3 flex items-center gap-3 text-left active:scale-[0.99] transition">
            <img src={avatarUrl(m.seed)} className="w-12 h-12 rounded-full pm-card-alt" alt={m.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">{m.name}</p>
                <span className="pm-mono text-[10px] pm-muted">{m.pace}/km</span>
              </div>
              <p className="text-xs pm-muted truncate">{last ? (last.from === "me" ? "Kamu: " : "") + last.text : "Bilang halo dulu yuk 👋"}</p>
            </div>
            <ChevronRight size={16} className="pm-muted" />
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
   CHAT SCREEN
   ========================================================================= */

const AUTO_REPLIES = [
  "Sip, gaskeun! 🏃",
  "Wah boleh banget, kapan mulai?",
  "Aku biasa lari pagi jam 5.30, kamu?",
  "Oke deh, sampai ketemu di start line!",
  "Mantap, semangat ngejar target pace-nya 💪",
];

function ChatScreen({ runner, chats, setChats, onBack }) {
  const [text, setText] = useState("");
  const thread = chats[runner.id] || [];
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread.length]);

  const send = () => {
    if (!text.trim()) return;
    const msg = { from: "me", text: text.trim(), time: new Date() };
    setChats((prev) => ({ ...prev, [runner.id]: [...(prev[runner.id] || []), msg] }));
    setText("");
    setTimeout(() => {
      const reply = { from: "them", text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], time: new Date() };
      setChats((prev) => ({ ...prev, [runner.id]: [...(prev[runner.id] || []), reply] }));
    }, 900 + Math.random() * 700);
  };

  return (
    <div className="fixed inset-0 z-50 pm-root flex justify-center">
      <div className="w-full max-w-md flex flex-col h-full pm-surface">
        <div className="flex items-center gap-3 px-4 py-3 pm-card border-b pm-border">
          <button onClick={onBack}><ChevronLeft size={22} /></button>
          <img src={avatarUrl(runner.seed)} className="w-9 h-9 rounded-full pm-card-alt" alt={runner.name} />
          <div className="flex-1">
            <p className="font-semibold text-sm">{runner.name}</p>
            <p className="text-[11px] pm-muted flex items-center gap-1"><MapPin size={10} /> {runner.location}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pm-scrollbar-none px-4 py-4 space-y-2">
          <div className="text-center text-[11px] pm-muted mb-2">Kamu match dengan {runner.name.split(" ")[0]} 🎉</div>
          {thread.length === 0 && (
            <div className="text-center text-xs pm-muted mt-8">Belum ada pesan. Mulai obrolan soal jadwal lari bareng!</div>
          )}
          {thread.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${m.from === "me" ? "pm-btn-lime rounded-br-sm font-medium" : "pm-card-alt rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="p-3 border-t pm-border flex items-center gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Tulis pesan..." className="flex-1 rounded-full px-4 py-2.5 text-sm pm-border border" />
          <button onClick={send} className="w-10 h-10 rounded-full pm-btn-lime flex items-center justify-center shrink-0"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   EVENTS TAB & EVENT DETAILS
   ========================================================================= */

function EventBanner({ event, idx, size = "grid" }) {
  const Icon = EVENT_ICONS[idx % EVENT_ICONS.length];
  const [c1, c2] = EVENT_GRADIENTS[idx % EVENT_GRADIENTS.length];
  return (
    <div className={`relative w-full ${size === "grid" ? "h-28" : "h-44"} rounded-2xl overflow-hidden pm-track-lanes`} style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
      <Icon size={size === "grid" ? 54 : 84} className="absolute -right-2 -bottom-2 opacity-20" style={{ color: "#CCFF00" }} />
      <div className="absolute top-2 left-2 flex gap-1">
        {event.categories.map((c) => (
          <span key={c} className="text-[9px] font-bold px-1.5 py-0.5 rounded pm-mono" style={{ background: "rgba(204,255,0,0.15)", color: "#CCFF00" }}>{c}</span>
        ))}
      </div>
      {event.slotsLeft < 50 && (
        <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded pm-bg-orange">HAMPIR PENUH</span>
      )}
    </div>
  );
}

function EventsTab({ registrations, onOpenEvent }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = EVENTS.filter((e) => {
    if (cat !== "All" && !e.categories.includes(cat)) return false;
    if (query && !(e.name.toLowerCase().includes(query.toLowerCase()) || e.location.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 pm-surface border-b pm-border sticky top-0 z-20">
        <h1 className="pm-display text-3xl leading-none mb-3">EVENT <span className="pm-lime">LARI</span></h1>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pm-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama event atau kota..." className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm pm-border border" />
        </div>
        <div className="flex gap-2 overflow-x-auto pm-scrollbar-none pb-1">
          {CATEGORY_TAGS.map((c) => <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>)}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pm-scrollbar-none px-4 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 pm-muted text-sm">Tidak ada event yang cocok. Coba kata kunci lain.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((e) => {
              const idx = EVENTS.indexOf(e);
              const reg = registrations[e.id];
              return (
                <button key={e.id} onClick={() => onOpenEvent(e)} className="pm-card pm-border border rounded-2xl overflow-hidden text-left active:scale-[0.98] transition">
                  <EventBanner event={e} idx={idx} />
                  <div className="p-3">
                    <p className="font-bold text-sm leading-snug mb-1">{e.name}</p>
                    <p className="text-[11px] pm-muted flex items-center gap-1 mb-0.5"><Calendar size={11} /> {formatDate(e.date)}</p>
                    <p className="text-[11px] pm-muted flex items-center gap-1 mb-2"><MapPin size={11} /> {e.location}</p>
                    <div className="flex items-center justify-between">
                      <span className="pm-mono font-bold text-sm pm-lime">{formatIDR(e.price)}</span>
                      <span className="text-[10px] pm-muted">{e.slotsLeft} slot lagi</span>
                    </div>
                    {reg?.status === "paid" && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-bold pm-lime">
                        <CheckCircle2 size={13} /> Sudah Terdaftar (BIB: {reg.bib})
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   EVENT DETAIL & REGISTRATION MODAL
   ========================================================================= */

function EventDetailModal({ event, registration, onClose, onRegister, onFindBuddy }) {
  const [selectedCat, setSelectedCat] = useState(event?.categories[0] || "10K");
  const [step, setStep] = useState("detail");
  const idx = EVENTS.indexOf(event);

  useEffect(() => {
    if (event) {
      setSelectedCat(event.categories[0]);
      setStep(registration?.status === "paid" ? "success" : "detail");
    }
  }, [event, registration]);

  if (!event) return null;

  const handlePay = () => {
    const bib = genBib(event.id);
    onRegister(event.id, {
      status: "paid",
      category: selectedCat,
      bib,
      date: new Date().toISOString(),
    });
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-md pm-card rounded-t-3xl sm:rounded-3xl p-5 pm-fade-in max-h-[90vh] overflow-y-auto pm-scrollbar-none z-10">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-1 rounded-full bg-black/40"><X size={20} className="pm-muted" /></button>

        {step === "detail" && (
          <div className="space-y-4">
            <EventBanner event={event} idx={idx} size="hero" />
            <div>
              <h2 className="pm-display text-3xl leading-none">{event.name.toUpperCase()}</h2>
              <p className="text-xs pm-muted flex items-center gap-1 mt-1"><MapPin size={12} /> {event.location}</p>
              <p className="text-xs pm-muted flex items-center gap-1 mt-0.5"><Calendar size={12} /> {formatDate(event.date)}</p>
            </div>

            <p className="text-xs pm-muted leading-relaxed">{event.desc}</p>

            <div>
              <p className="text-xs font-semibold pm-muted mb-2 uppercase tracking-wide">Pilih Kategori</p>
              <div className="flex gap-2">
                {event.categories.map((c) => (
                  <Pill key={c} active={selectedCat === c} onClick={() => setSelectedCat(c)}>{c}</Pill>
                ))}
              </div>
            </div>

            <div className="pm-card-alt rounded-2xl p-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] pm-muted uppercase font-semibold">Biaya Pendaftaran</p>
                <p className="pm-mono font-bold text-lg pm-lime">{formatIDR(event.price)}</p>
              </div>
              <p className="text-xs pm-muted">{event.slotsLeft} slot tersisa</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { onClose(); onFindBuddy(event); }} className="flex-1 py-3 rounded-xl pm-tag text-xs font-bold flex items-center justify-center gap-1">
                <Users size={14} /> Cari Buddy Race
              </button>
              <button onClick={() => setStep("payment")} className="flex-1 py-3 rounded-xl pm-btn-lime text-xs font-bold">
                Daftar Sekarang
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-4">
            <h3 className="pm-display text-2xl">KONFIRMASI PEMBAYARAN</h3>
            <div className="pm-card-alt rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="pm-muted">Event</span><span className="font-semibold">{event.name}</span></div>
              <div className="flex justify-between"><span className="pm-muted">Kategori</span><span className="pm-mono font-bold pm-lime">{selectedCat}</span></div>
              <div className="flex justify-between border-t pm-border pt-2"><span className="pm-muted">Total Bayar</span><span className="pm-mono font-bold text-sm text-white">{formatIDR(event.price)}</span></div>
            </div>

            <div className="text-center py-3">
              <p className="text-xs pm-muted mb-2">Scan QRIS ini untuk simulasi pembayaran instant:</p>
              <img src={qrUrl(`PAY-${event.id}-${selectedCat}`)} alt="QRIS" className="w-36 h-36 mx-auto rounded-xl pm-border border" />
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep("detail")} className="flex-1 py-3 rounded-xl pm-tag text-xs font-bold">Batal</button>
              <button onClick={handlePay} className="flex-1 py-3 rounded-xl pm-btn-lime text-xs font-bold flex items-center justify-center gap-1">
                <CheckCircle2 size={14} /> Konfirmasi Lunas
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full pm-bg-lime text-black mx-auto flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h3 className="pm-display text-3xl">KAMU SIAP RACE!</h3>
              <p className="text-xs pm-muted">Pendaftaran {event.name} berhasil diselesaikan.</p>
            </div>

            <div className="pm-card-alt rounded-2xl p-4 space-y-3">
              <p className="text-[10px] pm-muted uppercase font-semibold">Nomor BIB Digital Kamu</p>
              <p className="pm-mono font-extrabold text-2xl pm-lime tracking-widest">{registration?.bib || genBib(event.id)}</p>
              <div className="pt-2 border-t pm-border flex justify-between text-[11px] pm-muted">
                <span>Kategori: {registration?.category || selectedCat}</span>
                <span>{formatDate(event.date)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { onClose(); onFindBuddy(event); }} className="flex-1 py-3 rounded-xl pm-btn-lime text-xs font-bold flex items-center justify-center gap-1">
                <Users size={14} /> Cari Runner Lain di Event Ini
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   PROFIL TAB
   ========================================================================= */

function ProfileTab({ userProfile, setUserProfile, registrations, onOpenEvent }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(userProfile);

  const registeredEventList = useMemo(() => {
    return EVENTS.filter((e) => registrations[e.id]?.status === "paid");
  }, [registrations]);

  const save = () => {
    setUserProfile(form);
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pm-scrollbar-none">
      <div className="px-4 pt-5 pb-3 pm-surface border-b pm-border sticky top-0 z-20 flex items-center justify-between">
        <h1 className="pm-display text-3xl leading-none">PROFIL <span className="pm-lime">RUNNER</span></h1>
        <button onClick={() => setEditing(!editing)} className="text-xs font-semibold pm-lime px-3 py-1.5 rounded-full pm-card border pm-border">
          {editing ? "Batal" : "Edit"}
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div className="pm-card pm-border border rounded-3xl p-5 text-center relative overflow-hidden">
          <img src={avatarUrl(userProfile.seed)} className="w-20 h-20 rounded-full mx-auto mb-3 pm-card-alt p-1" alt={userProfile.name} />
          {editing ? (
            <div className="space-y-3 text-left max-w-xs mx-auto">
              <div>
                <label className="text-[10px] pm-muted uppercase font-semibold">Nama</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl px-3 py-1.5 text-sm pm-border border" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] pm-muted uppercase font-semibold">Pace Easy</label>
                  <input value={form.pace} onChange={(e) => setForm({ ...form, pace: e.target.value })} className="w-full rounded-xl px-3 py-1.5 text-sm pm-border border pm-mono" />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] pm-muted uppercase font-semibold">Target</label>
                  <input value={form.distance} onChange={(e) => setForm({ ...form, distance: e.target.value })} className="w-full rounded-xl px-3 py-1.5 text-sm pm-border border" />
                </div>
              </div>
              <div>
                <label className="text-[10px] pm-muted uppercase font-semibold">Lokasi Utama</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-xl px-3 py-1.5 text-sm pm-border border" />
              </div>
              <div>
                <label className="text-[10px] pm-muted uppercase font-semibold">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full rounded-xl px-3 py-1.5 text-xs pm-border border h-16 resize-none" />
              </div>
              <button onClick={save} className="w-full py-2.5 rounded-xl pm-btn-lime text-xs font-bold">Simpan Profil</button>
            </div>
          ) : (
            <>
              <h2 className="pm-display text-2xl">{userProfile.name.toUpperCase()}</h2>
              <p className="text-xs pm-muted flex items-center justify-center gap-1 mt-0.5"><MapPin size={12} /> {userProfile.location}</p>
              <p className="text-xs italic pm-muted mt-2">"{userProfile.bio}"</p>

              <div className="flex gap-2 mt-4">
                <div className="pm-card-alt rounded-xl p-2.5 flex-1">
                  <p className="text-[10px] pm-muted uppercase font-semibold">Pace Santai</p>
                  <p className="pm-mono font-bold text-sm pm-lime">{userProfile.pace} /km</p>
                </div>
                <div className="pm-card-alt rounded-xl p-2.5 flex-1">
                  <p className="text-[10px] pm-muted uppercase font-semibold">Target Utama</p>
                  <p className="pm-mono font-bold text-sm" style={{ color: "#FF8A5B" }}>{userProfile.distance}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="pm-display text-xl mb-3 flex items-center gap-2">
            <Ticket size={18} className="pm-lime" /> EVENT TERDAFTAR ({registeredEventList.length})
          </h3>
          {registeredEventList.length === 0 ? (
            <div className="pm-card pm-border border rounded-2xl p-6 text-center text-xs pm-muted">
              Kamu belum mendaftar event lari apapun. Cek tab <span className="pm-lime font-semibold">Event Lari</span> untuk mendaftar!
            </div>
          ) : (
            <div className="space-y-2">
              {registeredEventList.map((e) => {
                const reg = registrations[e.id];
                return (
                  <div key={e.id} onClick={() => onOpenEvent(e)} className="pm-card pm-border border rounded-2xl p-3 flex items-center justify-between cursor-pointer active:scale-[0.99] transition">
                    <div>
                      <p className="font-bold text-xs">{e.name}</p>
                      <p className="text-[10px] pm-muted">{formatDate(e.date)} • {reg?.category}</p>
                      <p className="pm-mono text-[11px] font-bold pm-lime mt-1">BIB: {reg?.bib}</p>
                    </div>
                    <ChevronRight size={16} className="pm-muted" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN APP CONTAINER
   ========================================================================= */

export default function PaceMatchApp() {
  const [tab, setTab] = useState("home");
  const [matches, setMatches] = useState([RUNNERS[0]]);
  const [chats, setChats] = useState({ 1: [{ from: "them", text: "Halo! Minggu depan lari di GBK gak?", time: new Date() }] });
  const [activeChatRunner, setActiveChatRunner] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [buddyEventFilter, setBuddyEventFilter] = useState(null);

  const [registrations, setRegistrations] = useState({
    1: { status: "paid", category: "10K", bib: "PM-12026-88129", date: "2026-07-15" }
  });

  const [userProfile, setUserProfile] = useState({
    name: "Ahmad Rizky",
    age: 27,
    gender: "male",
    pace: "5:15",
    distance: "10K / HM",
    location: "GBK, Jakarta",
    bio: "Latihan rutin buat HM pertama. Cari teman pacer pace 5:15-5:30.",
    seed: "Ahmad-Rizky"
  });

  const handleRegisterEvent = (eventId, regData) => {
    setRegistrations((prev) => ({ ...prev, [eventId]: regData }));
  };

  const handleFindBuddyForEvent = (event) => {
    setBuddyEventFilter(event);
    setTab("home");
  };

  return (
    <div className="pm-root min-h-screen flex justify-center selection:bg-yellow-400 selection:text-black">
      <ThemeStyles />
      <div className="w-full max-w-md min-h-screen flex flex-col pm-surface relative pb-20 shadow-2xl overflow-hidden border-x pm-border">
        {tab === "home" && (
          <MatchmakingTab
            matches={matches}
            setMatches={setMatches}
            chats={chats}
            setChats={setChats}
            buddyEventFilter={buddyEventFilter}
            clearBuddyFilter={() => setBuddyEventFilter(null)}
            openChat={(runner) => setActiveChatRunner(runner)}
          />
        )}

        {tab === "events" && (
          <EventsTab
            registrations={registrations}
            onOpenEvent={(e) => setSelectedEvent(e)}
          />
        )}

        {tab === "profile" && (
          <ProfileTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            registrations={registrations}
            onOpenEvent={(e) => setSelectedEvent(e)}
          />
        )}

        <BottomNav tab={tab} setTab={setTab} />

        {activeChatRunner && (
          <ChatScreen
            runner={activeChatRunner}
            chats={chats}
            setChats={setChats}
            onBack={() => setActiveChatRunner(null)}
          />
        )}

        {selectedEvent && (
          <EventDetailModal
            event={selectedEvent}
            registration={registrations[selectedEvent.id]}
            onClose={() => setSelectedEvent(null)}
            onRegister={handleRegisterEvent}
            onFindBuddy={handleFindBuddyForEvent}
          />
        )}
      </div>
    </div>
  );
}