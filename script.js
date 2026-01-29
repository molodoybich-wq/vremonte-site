:root{
  --bg:#0b0f17;
  --bg2:#0f1625;
  --card: rgba(255,255,255,.06);
  --stroke: rgba(255,255,255,.12);
  --text:#e9eefc;
  --muted: rgba(233,238,252,.72);
  --accent:#6ee7ff;
  --accent2:#a78bfa;
  --shadow: 0 20px 60px rgba(0,0,0,.35);
  --r: 18px;
}

*{ box-sizing:border-box; }
html,body{ margin:0; padding:0; font-family:Manrope,system-ui,-apple-system,Segoe UI,Roboto,Arial; color:var(--text); background:var(--bg); }
a{ color:inherit; text-decoration:none; }
img{ max-width:100%; display:block; }

.container{ width:min(1100px, 92vw); margin:0 auto; }

.topbar{
  position:sticky; top:0; z-index:50;
  background:rgba(11,15,23,.78);
  backdrop-filter: blur(14px);
  border-bottom:1px solid rgba(255,255,255,.08);
}
.topbar__inner{ display:flex; align-items:center; justify-content:space-between; gap:14px; padding:14px 0; }

.brand{ display:flex; align-items:center; gap:10px; }
.brand__dot{
  width:10px; height:10px; border-radius:50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  box-shadow:0 0 0 6px rgba(110,231,255,.14);
}
.brand__text{ font-weight:800; letter-spacing:.2px; }

.nav{ display:flex; gap:18px; align-items:center; }
.nav a{ color:rgba(233,238,252,.86); font-weight:600; font-size:14px; opacity:.9; }
.nav a:hover{ opacity:1; }

.topbar__actions{ display:flex; align-items:center; gap:10px; }
.pill{
  padding:10px 12px; border-radius:999px;
  background: linear-gradient(135deg, rgba(110,231,255,.18), rgba(167,139,250,.18));
  border:1px solid rgba(255,255,255,.16);
  font-weight:700; font-size:13px;
}
.pill--ghost{ background:transparent; border:1px solid rgba(255,255,255,.14); }

.burger{ display:none; background:transparent; border:0; padding:10px; cursor:pointer; }
.burger span{ display:block; width:22px; height:2px; background:rgba(233,238,252,.86); margin:5px 0; border-radius:2px; }

.hero{
  position:relative;
  padding:46px 0 30px;
  overflow:hidden;
}
.hero__bg{
  position:absolute; inset:-80px;
  background:
    radial-gradient(600px 240px at 15% 15%, rgba(110,231,255,.20), transparent 60%),
    radial-gradient(620px 260px at 80% 30%, rgba(167,139,250,.18), transparent 62%),
    radial-gradient(500px 260px at 60% 85%, rgba(110,231,255,.10), transparent 60%);
  filter: blur(0px);
  pointer-events:none;
}
.hero__grid{
  position:relative;
  display:grid;
  grid-template-columns: 1.1fr .9fr;
  gap:22px;
  align-items:start;
}

.badge{
  display:inline-flex; align-items:center; gap:10px;
  padding:10px 12px;
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  border-radius:999px;
  color:rgba(233,238,252,.86);
  font-weight:700; font-size:13px;
}
.badge__dot{ width:8px; height:8px; border-radius:50%; background:var(--accent); box-shadow:0 0 0 6px rgba(110,231,255,.12); }

h1{ margin:16px 0 12px; font-size:44px; line-height:1.06; letter-spacing:-.6px; }
.grad{
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.hero__sub{ margin:0 0 18px; color:var(--muted); font-size:16px; line-height:1.5; }

.hero__cta{ display:flex; gap:10px; flex-wrap:wrap; margin:14px 0 16px; }
.btn{
  display:inline-flex; align-items:center; justify-content:center;
  gap:8px;
  padding:12px 14px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background: linear-gradient(135deg, rgba(110,231,255,.16), rgba(167,139,250,.16));
  box-shadow: 0 12px 30px rgba(0,0,0,.22);
  font-weight:800;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.btn:hover{ transform: translateY(-1px); border-color: rgba(255,255,255,.24); }
.btn--ghost{ background: transparent; box-shadow:none; }
.btn--wide{ width:100%; }

.mini-cards{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:10px;
  margin-top:18px;
}
.mini-card{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius: var(--r);
  padding:12px;
}
.mini-card__title{ font-weight:800; margin-bottom:6px; }
.mini-card__text{ color:var(--muted); font-size:13px; line-height:1.35; }

.glass{
  background: rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.14);
  border-radius: 22px;
  padding:16px;
  box-shadow: var(--shadow);
}
.glass__title{ font-weight:900; font-size:18px; }
.glass__text{ color:var(--muted); margin:8px 0 14px; }

.form{ display:flex; flex-direction:column; gap:10px; }
.field span{ display:block; font-weight:800; font-size:12px; color:rgba(233,238,252,.8); margin-bottom:6px; }
.field input, .field textarea{
  width:100%;
  padding:12px 12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background: rgba(11,15,23,.55);
  color:var(--text);
  outline:none;
}
.field input:focus, .field textarea:focus{
  border-color: rgba(110,231,255,.55);
  box-shadow: 0 0 0 6px rgba(110,231,255,.10);
}
.form__hint{ font-size:12px; color:rgba(233,238,252,.72); }
.form__hint a{ text-decoration:underline; }

.stats{
  display:grid; grid-template-columns: repeat(3,1fr);
  gap:10px; margin-top:12px;
}
.stat{
  border-radius: 18px;
  padding:12px;
  background: rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.10);
}
.stat__num{ font-size:18px; }
.stat__text{ margin-top:6px; font-weight:800; font-size:13px; color:rgba(233,238,252,.86); }

.section{ padding:56px 0; }
.section--dark{ background: linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,0)); border-top:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); }
.section__head h2{ margin:0; font-size:30px; letter-spacing:-.4px; }
.section__head p{ margin:10px 0 0; color:var(--muted); }
.section__cta{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:16px; }

.grid{
  margin-top:18px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:12px;
}
.card{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius: 22px;
  padding:16px;
  transition: transform .18s ease, border-color .18s ease;
}
.card:hover{ transform: translateY(-2px); border-color: rgba(255,255,255,.18); }
.card__icon{ font-size:22px; }
.card__title{ font-weight:900; margin-top:10px; }
.card__text{ color:var(--muted); margin-top:8px; line-height:1.45; font-size:14px; }

.gallery{
  margin-top:18px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap:12px;
}
.work{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius: 22px;
  overflow:hidden;
  cursor:pointer;
  transition: transform .18s ease, border-color .18s ease;
}
.work:hover{ transform: translateY(-2px); border-color: rgba(255,255,255,.18); }
.work__img img{ width:100%; height:190px; object-fit:cover; }
.work__body{ padding:14px; }
.work__title{ font-weight:900; }
.work__text{ color:var(--muted); margin-top:8px; font-size:14px; line-height:1.45; }

.reviews{
  margin-top:18px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:12px;
}
.tile{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius: 22px;
  padding:16px;
}
.tile__title{ font-weight:900; font-size:18px; }
.tile__text{ color:var(--muted); margin-top:8px; line-height:1.45; }
.tile__actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }
.tile__note{ margin-top:10px; color:rgba(233,238,252,.72); font-size:12px; }

.btn--small{ padding:10px 12px; border-radius:12px; font-size:13px; }

.find-grid{
  margin-top:18px;
  display:grid;
  grid-template-columns: 1fr 1.1fr;
  gap:12px;
  align-items:start;
}
.find-photos{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:10px;
}
.find-photos img{
  border-radius:18px;
  border:1px solid rgba(255,255,255,.10);
  height:190px;
  object-fit:cover;
}
.find-photos img:nth-child(3){
  grid-column: 1 / -1;
  height:220px;
}
.map-frame{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius:22px;
  overflow:hidden;
  box-shadow: 0 16px 40px rgba(0,0,0,.25);
}
.map-frame iframe{ width:100%; height:420px; border:0; display:block; }
.find-actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top:12px; }

.contacts{
  margin-top:18px;
  display:grid;
  grid-template-columns: repeat(3,1fr);
  gap:12px;
}
.contact-card{
  background: rgba(255,255,255,.05);
  border:1px solid rgba(255,255,255,.10);
  border-radius:22px;
  padding:16px;
}
.contact-card__title{ font-weight:900; color:rgba(233,238,252,.86); font-size:13px; text-transform:uppercase; letter-spacing:.6px; }
.contact-card__value{ margin-top:10px; font-weight:900; font-size:18px; display:block; }
.contact-card__note{ margin-top:6px; color:var(--muted); font-size:13px; }

.footer{
  margin-top:26px;
  padding-top:18px;
  border-top:1px solid rgba(255,255,255,.08);
  display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;
  color:rgba(233,238,252,.70);
  font-weight:700;
}
.footer a{ text-decoration:underline; }

.reveal{ opacity:0; transform: translateY(14px); transition: opacity .55s ease, transform .55s ease; }
.reveal.is-in{ opacity:1; transform:none; }

.lightbox{
  position:fixed; inset:0;
  background:rgba(0,0,0,.72);
  display:none;
  align-items:center; justify-content:center;
  z-index:99;
  padding:22px;
}
.lightbox.is-open{ display:flex; }
.lightbox__img{
  max-width:min(1000px, 92vw);
  max-height:86vh;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.18);
  box-shadow: 0 30px 90px rgba(0,0,0,.55);
}
.lightbox__close{
  position:absolute;
  top:14px; right:14px;
  width:44px; height:44px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.18);
  background:rgba(255,255,255,.10);
  color:#fff;
  font-size:18px;
  cursor:pointer;
}

/* Mobile */
@media (max-width: 980px){
  .hero__grid{ grid-template-columns: 1fr; }
  h1{ font-size:36px; }
  .mini-cards{ grid-template-columns: 1fr; }
  .stats{ grid-template-columns: 1fr; }
  .grid{ grid-template-columns: 1fr; }
  .gallery{ grid-template-columns: 1fr; }
  .reviews{ grid-template-columns: 1fr; }
  .find-grid{ grid-template-columns: 1fr; }
  .contacts{ grid-template-columns: 1fr; }

  .nav{
    position:absolute;
    left:0; right:0; top:62px;
    display:none;
    flex-direction:column;
    gap:0;
    background: rgba(11,15,23,.94);
    border-bottom:1px solid rgba(255,255,255,.10);
  }
  .nav a{ padding:14px 4vw; border-top:1px solid rgba(255,255,255,.06); }
  .nav.is-open{ display:flex; }
  .burger{ display:inline-block; }
}
