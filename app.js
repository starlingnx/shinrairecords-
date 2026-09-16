// app.js — client side logic to load JSONC data and render the site
const RAW_BASE = 'https://raw.githubusercontent.com/starlingnx/shinrairecords-/main/';
const PATHS = {
  artists: 'Artist.jsonc',
  releases: 'Release.jsonc',
  news: 'NewsPost.jsonc',
  demo: 'DemoSubmission.jsonc'
};

function stripComments(text){
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
}

async function fetchRaw(path){
  try{
    const res = await fetch(RAW_BASE + path);
    if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
    return await res.text();
  }catch(e){
    console.error('fetchRaw error', e);
    return null;
  }
}

function parseJsonc(text){
  if(!text) return null;
  const cleaned = stripComments(text);
  try{
    return JSON.parse(cleaned);
  }catch(e){
    // fallback: try to extract array/object by searching
    try{
      const idx = cleaned.indexOf('{');
      const sub = cleaned.slice(idx);
      return JSON.parse(sub);
    }catch(err){
      console.warn('JSON parse failed', err);
      return null;
    }
  }
}

function createArtistCard(a){
  const el = document.createElement('div');
  el.className = 'card';
  const name = a.name || a.fullName || a.title || 'Unknown';
  const bio = a.bio || a.description || a.about || '';
  el.innerHTML = `<h3>${escapeHtml(name)}</h3><p class="muted">${escapeHtml(bio)}</p>`;
  return el;
}

function createReleaseItem(r){
  const div = document.createElement('div');
  div.className = 'item';
  const title = r.title || r.name || 'Untitled';
  const date = r.date || r.releaseDate || '';
  const label = r.label || '';
  div.innerHTML = `<strong>${escapeHtml(title)}</strong> <div class="muted small">${escapeHtml(label)} ${date? '• ' + escapeHtml(date):''}</div>`;
  return div;
}

function createNewsItem(n){
  const div = document.createElement('div');
  div.className = 'item';
  const title = n.title || n.headline || 'Update';
  const body = n.content || n.body || n.excerpt || '';
  div.innerHTML = `<strong>${escapeHtml(title)}</strong><div class="muted small">${escapeHtml(truncate(body,240))}</div>`;
  return div;
}

function escapeHtml(s){
  if(!s) return '';
  return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]);
}
function truncate(s,n){return s.length>n? s.slice(0,n-1)+'…': s}

async function loadArtists(){
  const raw = await fetchRaw(PATHS.artists);
  const data = parseJsonc(raw);
  const grid = document.getElementById('artistsGrid');
  grid.innerHTML = '';
  if(!data) { grid.innerHTML = '<div class="muted">Không tìm thấy dữ liệu artists.</div>'; return }
  // data may be object or array
  const arr = Array.isArray(data)? data : (data.items || data.artists || [data]);
  for(const a of arr){
    grid.appendChild(createArtistCard(a));
  }
}

async function loadReleases(){
  const raw = await fetchRaw(PATHS.releases);
  const data = parseJsonc(raw);
  const list = document.getElementById('releasesList');
  list.innerHTML = '';
  if(!data) { list.innerHTML = '<div class="muted">No releases found.</div>'; return }
  const arr = Array.isArray(data)? data : (data.items || data.releases || [data]);
  for(const r of arr){ list.appendChild(createReleaseItem(r)); }
}

async function loadNews(){
  const raw = await fetchRaw(PATHS.news);
  const data = parseJsonc(raw);
  const list = document.getElementById('newsList');
  list.innerHTML = '';
  if(!data) { list.innerHTML = '<div class="muted">No news available.</div>'; return }
  const arr = Array.isArray(data)? data : (data.items || data.posts || [data]);
  for(const n of arr){ list.appendChild(createNewsItem(n)); }
}

function initNav(){
  const mobileToggle = document.getElementById('mobileToggle');
  mobileToggle.addEventListener('click', ()=>{
    const nav = document.querySelector('.main-nav');
    if(nav.style.display==='block') nav.style.display='none'; else nav.style.display='block';
  });
  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.startsWith('#')){
        e.preventDefault();
        const t = document.querySelector(href);
        if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
        // hide mobile nav after select
        const nav = document.querySelector('.main-nav'); if(window.innerWidth<800) nav.style.display='none';
      }
    });
  });
}

function initForms(){
  const form = document.getElementById('contactForm');
  const result = document.getElementById('formResult');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    result.textContent = 'Demo form — no backend. Thanks ' + (document.getElementById('name').value || '');
  });
  document.getElementById('subscribe').addEventListener('click', ()=>{
    result.textContent = 'Subscribed (demo) — enable a backend or Zapier to collect emails.';
  });
}

async function init(){
  initNav();
  initForms();
  await Promise.all([loadArtists(), loadReleases(), loadNews()]);
}

init();
