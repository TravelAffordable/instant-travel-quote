import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import heroCollage from '@/assets/brochure/travel-hero-collage.jpg';
import footerCollage from '@/assets/brochure/travel-footer-collage.jpg';

/* ----------------------- Inclusion icon mapping ----------------------- */
const ICON_RULES: Array<{ test: RegExp; icon: string; label?: (raw: string) => string }> = [
  { test: /accommodation|accomodation|stay|nights?\s|hotel|lodge|resort|guesthouse|apartment/i, icon: '🏨' },
  { test: /breakfast\s*(and|&)\s*dinner|half[\s-]?board/i, icon: '🍽️' },
  { test: /full[\s-]?board|all\s*meals/i, icon: '🍽️' },
  { test: /breakfast/i, icon: '🍳' },
  { test: /\bdinner\b/i, icon: '🍽️' },
  { test: /\blunch\b/i, icon: '🥗' },
  { test: /spa|massage|wellness/i, icon: '💆' },
  { test: /canal|cruise|boat|ferry|yacht|sail/i, icon: '🚤' },
  { test: /beach|ocean|sea\b/i, icon: '🌊' },
  { test: /marine\s*world|aquarium|ushaka/i, icon: '🐠' },
  { test: /safari/i, icon: '🦁' },
  { test: /game\s*drive|game\s*reserve/i, icon: '🚙' },
  { test: /wildlife|elephant|rhino|giraffe|monkey/i, icon: '🦒' },
  { test: /quad|atv|off[\s-]?road/i, icon: '🏍️' },
  { test: /zip[\s-]?line|zipline/i, icon: '🪂' },
  { test: /gorge\s*lift|gorge\s*swing/i, icon: '🚡' },
  { test: /hot\s*air\s*balloon|balloon/i, icon: '🎈' },
  { test: /cable\s*car|cableway/i, icon: '🚠' },
  { test: /wine\s*tast|wine\s*tour|winelands|vineyard/i, icon: '🍷' },
  { test: /city\s*tour|sightseeing|township\s*tour/i, icon: '🏙️' },
  { test: /museum|gallery|heritage/i, icon: '🏛️' },
  { test: /theme\s*park|gold\s*reef|ratanga/i, icon: '🎡' },
  { test: /water\s*park|valley\s*of\s*the\s*waves|water\s*world/i, icon: '💦' },
  { test: /shuttle|transfer\s*between|coach|bus\b/i, icon: '🚐' },
  { test: /airport\s*transfer/i, icon: '🛬' },
  { test: /flight|airfare|airline/i, icon: '✈️' },
  { test: /adventure|hiking|trail|abseil|climb/i, icon: '🌄' },
  { test: /casino|gaming/i, icon: '🎰' },
  { test: /golf/i, icon: '⛳' },
  { test: /entrance|entry|ticket|access/i, icon: '🎟️' },
];

export function iconForInclusion(raw: string): string {
  for (const r of ICON_RULES) if (r.test.test(raw)) return r.icon;
  return '⭐';
}

/* ----------------------- Helpers ----------------------- */
function esc(s: string | undefined | null): string {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmtR(n: number): string {
  return 'R' + Math.round(n).toLocaleString('en-ZA');
}

function fmtDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ----------------------- Data shape ----------------------- */
export interface BrochureAgent {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyLogo?: string; // data URL or url
}

export interface BrochureHotelOption {
  name: string;
  optionLabel?: string; // "Option 1"
  description?: string;
  starRating?: number; // 1-5; if omitted/0, no stars are shown
}

export interface BrochurePageData {
  quoteNumber: string;
  quoteDate: string;       // ISO or display
  validUntil: string;      // ISO or display
  checkIn: string;         // ISO
  checkOut: string;        // ISO
  nights: number;
  adults: number;
  children: number;
  destinationName: string;
  destinationRegion?: string;
  hotel: BrochureHotelOption;
  inclusions: string[];    // raw labels
  totalGroupCost: number;
  totalGuests: number;
  agent: BrochureAgent;
}

/* ----------------------- HTML template ----------------------- */
const NAVY = '#143b5c';
const NAVY_DARK = '#0e2c47';
const GOLD = '#d8a23a';
const TEXT = '#1f2937';
const MUTED = '#5b6b7a';
const LIGHT = '#f4f1ec';

function inclusionCardsHTML(inclusions: string[], nights: number): string {
  // Dedupe accommodation entries — keep first, drop the rest
  const isAccom = (s: string) => /accommodation|accomodation|hotel|lodge|stay|nights?/i.test(s);
  const seenAccom = { v: false };
  let list = (inclusions || []).filter(item => {
    if (isAccom(item)) {
      if (seenAccom.v) return false;
      seenAccom.v = true;
    }
    return true;
  });
  if (!seenAccom.v) {
    list = [`Accommodation ${nights} Night${nights !== 1 ? 's' : ''}`, ...list];
  }
  const cards = list.slice(0, 12).map(item => {
    const icon = iconForInclusion(item);
    let title = item.trim();
    let sub = '';
    if (isAccom(title)) {
      title = 'Accommodation';
      sub = `${nights} Night${nights !== 1 ? 's' : ''}`;
    } else if (/^breakfast$/i.test(title)) {
      title = 'Breakfast Included';
    }
    return `
      <div class="inc-card">
        <div class="inc-icon">${icon}</div>
        <div class="inc-title">${esc(title)}</div>
        ${sub ? `<div class="inc-sub">${esc(sub)}</div>` : ''}
      </div>
    `;
  }).join('');
  return cards;
}

export function buildBrochureHTML(d: BrochurePageData): string {
  const { agent } = d;
  const travellersLine = `${d.adults} Adult${d.adults !== 1 ? 's' : ''}${d.children > 0 ? `<br/>${d.children} Child${d.children !== 1 ? 'ren' : ''}` : ''}<br/>(${d.totalGuests} Total)`;

  return `
  <div id="brochure-root" style="
    width:794px; box-sizing:border-box; background:#ffffff; color:${TEXT};
    font-family: 'Helvetica Neue', Helvetica, Arial, 'Segoe UI', 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif;
    padding:0; margin:0;">

    <style>
      #brochure-root *{ box-sizing:border-box; }
      #brochure-root .hero{ position:relative; width:100%; height:220px; overflow:hidden; }
      #brochure-root .hero img{ width:100%; height:100%; object-fit:cover; display:block; }
      #brochure-root .title-row{ display:flex; padding:24px 32px 18px; align-items:flex-end; gap:16px; }
      #brochure-root .title-left{ flex:1; }
      #brochure-root .script{ font-family: 'Brush Script MT', 'Snell Roundhand', cursive; color:${NAVY}; font-size:34px; line-height:1; }
      #brochure-root .display{ font-family: Georgia, 'Times New Roman', serif; color:${NAVY_DARK}; font-size:62px; font-weight:800; letter-spacing:1px; line-height:1; margin-top:6px; }
      #brochure-root .display .awaits{ font-family:'Brush Script MT','Snell Roundhand',cursive; color:${NAVY}; font-weight:400; font-size:42px; margin-left:8px; }
      #brochure-root .tag{ color:${GOLD}; font-style:italic; font-size:14px; margin-top:10px; letter-spacing:.3px; }
      #brochure-root .quote-meta{ background:${NAVY}; color:#fff; border-radius:6px; padding:14px 18px; min-width:260px; font-size:11px; }
      #brochure-root .quote-meta .row{ display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,.18); }
      #brochure-root .quote-meta .row:last-child{ border-bottom:none; }
      #brochure-root .quote-meta .k{ opacity:.8; letter-spacing:1px; }
      #brochure-root .quote-meta .v{ font-weight:700; }

      #brochure-root .chips{ display:grid; grid-template-columns:repeat(4,1fr); gap:0; background:${LIGHT}; margin:0 32px; border-radius:6px; padding:14px 8px; }
      #brochure-root .chip{ text-align:center; padding:6px 8px; border-right:1px solid #e2dcd1; font-size:11px; color:${TEXT}; }
      #brochure-root .chip:last-child{ border-right:none; }
      #brochure-root .chip .ico{ font-size:20px; color:${NAVY}; }
      #brochure-root .chip .lbl{ font-weight:800; letter-spacing:1.2px; font-size:10px; color:${NAVY_DARK}; margin:6px 0 4px; }

      #brochure-root .section-title{ text-align:center; font-weight:800; letter-spacing:2px; color:${NAVY_DARK}; font-size:13px; margin:22px 0 14px; position:relative; }
      #brochure-root .section-title:before, #brochure-root .section-title:after{ content:""; display:inline-block; width:60px; height:1px; background:#cfc8bb; vertical-align:middle; margin:0 12px; }

      #brochure-root .inc-grid{ display:grid; grid-template-columns:repeat(6, 1fr); gap:10px; padding:0 32px; }
      #brochure-root .inc-card{ background:#ffffff; border:1px solid #e9e4d9; border-radius:10px; padding:14px 8px; text-align:center; box-shadow:0 2px 6px rgba(20,59,92,.06); min-height:120px; display:flex; flex-direction:column; justify-content:flex-start; }
      #brochure-root .inc-icon{ font-size:30px; line-height:1; margin:2px 0 8px; }
      #brochure-root .inc-title{ font-weight:800; font-size:10.5px; letter-spacing:.4px; color:${NAVY_DARK}; text-transform:uppercase; line-height:1.25; }
      #brochure-root .inc-sub{ font-size:10px; color:${MUTED}; margin-top:4px; }

      #brochure-root .two-col{ display:grid; grid-template-columns:1.05fr 1fr; gap:16px; padding:0 32px; margin-top:22px; }
      #brochure-root .panel{ background:#fff; border:1px solid #e9e4d9; border-radius:8px; overflow:hidden; }
      #brochure-root .panel-head{ background:${NAVY}; color:#fff; font-weight:800; letter-spacing:1.5px; font-size:11px; padding:8px 14px; }
      #brochure-root .panel-head.gold{ background:${GOLD}; color:${NAVY_DARK}; }
      #brochure-root .acc-body{ padding:14px; display:flex; flex-direction:column; gap:8px; }
      #brochure-root .acc-name{ font-family:Georgia, serif; font-weight:800; color:${NAVY_DARK}; font-size:18px; }
      #brochure-root .stars{ color:${GOLD}; letter-spacing:2px; font-size:14px; }
      #brochure-root .acc-row{ font-size:11px; color:${TEXT}; }
      #brochure-root .acc-row b{ color:${NAVY_DARK}; }
      #brochure-root .acc-desc{ font-size:11px; color:${MUTED}; margin-top:6px; }

      #brochure-root .inv-body{ padding:14px; }
      #brochure-root .inv-row{ display:flex; justify-content:space-between; font-size:12px; padding:8px 0; border-bottom:1px dashed #e0d9c8; }
      #brochure-root .inv-total{ margin-top:12px; background:${NAVY}; color:#fff; padding:18px; text-align:center; border-radius:6px; }
      #brochure-root .inv-total .lbl{ font-size:11px; letter-spacing:2px; opacity:.85; }
      #brochure-root .inv-total .amt{ font-size:34px; font-weight:800; margin-top:4px; }
      #brochure-root .inv-total .sub{ font-size:11px; opacity:.85; margin-top:2px; }
      #brochure-root .inv-note{ text-align:center; font-size:9.5px; color:${MUTED}; margin-top:8px; }

      #brochure-root .bottom{ display:grid; grid-template-columns:1.05fr 1fr; gap:16px; padding:0 32px; margin-top:22px; }
      #brochure-root .booking{ background:${LIGHT}; border-radius:8px; padding:16px; }
      #brochure-root .booking-title{ text-align:center; font-weight:800; letter-spacing:2px; font-size:11px; color:${NAVY_DARK}; margin-bottom:14px; }
      #brochure-root .steps{ display:flex; align-items:flex-start; justify-content:space-between; gap:4px; }
      #brochure-root .step{ flex:1; text-align:center; }
      #brochure-root .step .num{ width:34px; height:34px; border-radius:50%; border:1.5px solid ${NAVY}; color:${NAVY}; font-weight:800; line-height:31px; display:inline-block; font-size:13px; }
      #brochure-root .step .ico{ font-size:14px; color:${NAVY}; margin-top:6px; display:block; }
      #brochure-root .step .num-lbl{ font-weight:800; font-size:11px; color:${NAVY_DARK}; margin-top:6px; }
      #brochure-root .step .lbl{ font-size:9px; color:${MUTED}; letter-spacing:.6px; margin-top:2px; line-height:1.25; }
      #brochure-root .step .arrow{ display:inline-block; color:${NAVY}; opacity:.4; }

      #brochure-root .agent{ background:${NAVY}; color:#fff; border-radius:8px; padding:18px; }
      #brochure-root .agent .ready{ font-family:'Brush Script MT','Snell Roundhand',cursive; font-size:28px; }
      #brochure-root .agent .ready-sub{ font-size:11px; opacity:.85; margin-bottom:12px; }
      #brochure-root .agent .a-row{ display:flex; align-items:center; gap:8px; font-size:11px; padding:4px 0; }
      #brochure-root .agent .a-row .ai{ width:18px; text-align:center; }

      #brochure-root .footer-strip{ width:100%; height:140px; overflow:hidden; margin-top:22px; }
      #brochure-root .footer-strip img{ width:100%; height:100%; object-fit:cover; display:block; }
      #brochure-root .tagline{ background:${NAVY_DARK}; color:#fff; text-align:center; padding:10px; font-family:Georgia, serif; font-style:italic; font-size:12px; letter-spacing:.4px; }
      #brochure-root .tagline .heart{ color:${GOLD}; margin:0 12px; }

      #brochure-root .logo-wrap{ display:flex; align-items:center; gap:10px; margin-bottom:10px; }
      #brochure-root .logo-wrap img{ max-height:42px; max-width:120px; object-fit:contain; background:#fff; border-radius:6px; padding:4px; }
    </style>

    <!-- HERO -->
    <div class="hero"><img src="${heroCollage}" crossorigin="anonymous" /></div>

    <!-- TITLE ROW -->
    <div class="title-row">
      <div class="title-left">
        ${agent.companyLogo ? `<div class="logo-wrap"><img src="${esc(agent.companyLogo)}" crossorigin="anonymous" /><div style="font-weight:800;color:${NAVY_DARK};font-size:14px;">${esc(agent.companyName || '')}</div></div>` : (agent.companyName ? `<div style="font-weight:800;color:${NAVY_DARK};font-size:14px;letter-spacing:1px;margin-bottom:6px;">${esc(agent.companyName)}</div>` : '')}
        <div class="script">Your Next</div>
        <div class="display">ADVENTURE<span class="awaits">Awaits</span></div>
        <div class="tag">Memories that last a lifetime</div>
      </div>
      <div class="quote-meta">
        <div class="row"><span class="k">QUOTE NO:</span><span class="v">${esc(d.quoteNumber)}</span></div>
        <div class="row"><span class="k">DATE:</span><span class="v">${esc(fmtDate(d.quoteDate))}</span></div>
        <div class="row"><span class="k">VALID UNTIL:</span><span class="v">${esc(fmtDate(d.validUntil))}</span></div>
      </div>
    </div>

    <!-- CHIPS -->
    <div class="chips">
      <div class="chip">
        <div class="ico">📅</div>
        <div class="lbl">TRAVEL DATES</div>
        <div>${esc(fmtDate(d.checkIn))}<br/>to<br/>${esc(fmtDate(d.checkOut))}<br/>(${d.nights} Night${d.nights !== 1 ? 's' : ''})</div>
      </div>
      <div class="chip">
        <div class="ico">👥</div>
        <div class="lbl">TRAVELLERS</div>
        <div>${travellersLine}</div>
      </div>
      <div class="chip">
        <div class="ico">📍</div>
        <div class="lbl">DESTINATION</div>
        <div>${esc(d.destinationName)}${d.destinationRegion ? `<br/>${esc(d.destinationRegion)}` : ''}</div>
      </div>
      <div class="chip">
        <div class="ico">🧳</div>
        <div class="lbl">ACCOMMODATION OPTION</div>
        <div>${esc(d.hotel.optionLabel || 'Option 1')}<br/>${esc(d.hotel.name)}</div>
      </div>
    </div>

    <!-- INCLUSIONS -->
    <div class="section-title">YOUR GETAWAY INCLUDES</div>
    <div class="inc-grid">${inclusionCardsHTML(d.inclusions, d.nights)}</div>

    <!-- TWO COLUMN: ACCOMMODATION / INVESTMENT -->
    <div class="two-col">
      <div class="panel">
        <div class="panel-head">YOUR ACCOMMODATION</div>
        <div class="acc-body">
          <div class="acc-name">${esc(d.hotel.name)}</div>
          ${d.hotel.starRating && d.hotel.starRating > 0 ? `<div class="stars">${'★ '.repeat(Math.min(5, Math.max(1, Math.round(d.hotel.starRating)))).trim()}</div>` : ''}
          <div class="acc-row">📅 <b>Check-in</b> &nbsp; ${esc(fmtDate(d.checkIn))}</div>
          <div class="acc-row">📅 <b>Check-out</b> &nbsp; ${esc(fmtDate(d.checkOut))}</div>
          <div class="acc-row">🌙 <b>Duration</b> &nbsp; ${d.nights} Night${d.nights !== 1 ? 's' : ''}</div>
          <div class="acc-desc">${esc(d.hotel.description || 'Relax in comfortable surroundings chosen for your perfect stay.')}</div>
        </div>
      </div>
      <div class="panel">
        <div class="panel-head gold">INVESTMENT SUMMARY</div>
        <div class="inv-body">
          <div class="inv-row"><span>Accommodation &amp; Package</span><b>${fmtR(d.totalGroupCost)}</b></div>
          <div class="inv-row"><span>VAT</span><b>Included</b></div>
          <div class="inv-total">
            <div class="lbl">TOTAL GROUP COST</div>
            <div class="amt">${fmtR(d.totalGroupCost)}</div>
            <div class="sub">For ${d.totalGuests} ${d.totalGuests === 1 ? 'Person' : 'People'}</div>
          </div>
          <div class="inv-note">* All prices include VAT where applicable</div>
        </div>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom">
      <div class="booking">
        <div class="booking-title">SIMPLE BOOKING PROCESS</div>
        <div class="steps">
          <div class="step"><div class="num">1</div><div class="ico">✉️</div><div class="num-lbl">REQUEST</div><div class="lbl">INVOICE</div></div>
          <div class="step" style="flex:0 0 14px;"><div class="arrow">›</div></div>
          <div class="step"><div class="num">2</div><div class="ico">💳</div><div class="num-lbl">PAY 50%</div><div class="lbl">DEPOSIT</div></div>
          <div class="step" style="flex:0 0 14px;"><div class="arrow">›</div></div>
          <div class="step"><div class="num">3</div><div class="ico">📄</div><div class="num-lbl">RECEIVE BOOKING</div><div class="lbl">CONFIRMATION</div></div>
          <div class="step" style="flex:0 0 14px;"><div class="arrow">›</div></div>
          <div class="step"><div class="num">4</div><div class="ico">🧳</div><div class="num-lbl">RECEIVE TRAVEL</div><div class="lbl">DOCUMENTS</div></div>
          <div class="step" style="flex:0 0 14px;"><div class="arrow">›</div></div>
          <div class="step"><div class="num">5</div><div class="ico">📸</div><div class="num-lbl">ENJOY YOUR</div><div class="lbl">GETAWAY!</div></div>
        </div>
      </div>
      <div class="agent">
        <div class="ready">Ready to Book?</div>
        <div class="ready-sub">Your unforgettable experience starts here.</div>
        <div class="a-row"><span class="ai">👤</span><span>${esc(agent.companyName || 'YOUR TRAVEL AGENT')}</span></div>
        ${agent.companyPhone ? `<div class="a-row"><span class="ai">📞</span><span>${esc(agent.companyPhone)}</span></div>` : ''}
        ${agent.companyEmail ? `<div class="a-row"><span class="ai">✉️</span><span>${esc(agent.companyEmail)}</span></div>` : ''}
        ${agent.companyWebsite ? `<div class="a-row"><span class="ai">🌐</span><span>${esc(agent.companyWebsite)}</span></div>` : ''}
        ${agent.companyAddress ? `<div class="a-row"><span class="ai">📍</span><span>${esc(agent.companyAddress)}</span></div>` : ''}
      </div>
    </div>

    <!-- FOOTER COLLAGE + TAGLINE -->
    <div class="footer-strip"><img src="${footerCollage}" crossorigin="anonymous" /></div>
    <div class="tagline">Collect moments, not things. <span class="heart">♥</span> Travel more, worry less. <span class="heart">♥</span> We take care of the details.</div>
  </div>
  `;
}

/* ----------------------- Renderer ----------------------- */
async function renderPageToCanvas(html: string): Promise<HTMLCanvasElement> {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.width = '794px';
  wrapper.style.background = '#ffffff';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
  // Wait for images
  const imgs = Array.from(wrapper.querySelectorAll('img'));
  await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => {
    img.onload = () => res(null);
    img.onerror = () => res(null);
  })));
  // small extra delay for emoji font shaping
  await new Promise(r => setTimeout(r, 50));
  try {
    const canvas = await html2canvas(wrapper.firstElementChild as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    return canvas;
  } finally {
    document.body.removeChild(wrapper);
  }
}

export async function generateBrochurePDF(pages: BrochurePageData[]): Promise<jsPDF> {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageW = 210;
  const pageH = 297;
  for (let i = 0; i < pages.length; i++) {
    const html = buildBrochureHTML(pages[i]);
    const canvas = await renderPageToCanvas(html);
    const ratio = canvas.height / canvas.width;
    const imgW = pageW;
    const imgH = imgW * ratio;
    const data = canvas.toDataURL('image/jpeg', 0.92);
    if (i > 0) pdf.addPage();
    if (imgH <= pageH) {
      pdf.addImage(data, 'JPEG', 0, 0, imgW, imgH, undefined, 'FAST');
    } else {
      // Scale down to fit one page
      const fitH = pageH;
      const fitW = fitH / ratio;
      const xOff = (pageW - fitW) / 2;
      pdf.addImage(data, 'JPEG', xOff, 0, fitW, fitH, undefined, 'FAST');
    }
  }
  return pdf;
}
