// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger menu
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// Animated counters
function animateCounter(el, target, suffix='') {
  let start = 0;
  const duration = 1600;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString('en-IN') + suffix;
  }, 16);
}

window.addEventListener('DOMContentLoaded', async () => {
  const stats = await DB.getStats();
  setTimeout(() => {
    animateCounter(document.getElementById('counter1'), stats.resolved + 12847);
    animateCounter(document.getElementById('counter2'), 2400);
    animateCounter(document.getElementById('counter3'), 24);
  }, 600);

  // Recent complaints feed
  const allComplaints = await DB.getComplaints();
  const recent = allComplaints.slice(-5).reverse();
  const list = document.getElementById('recentList');
  if (recent.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>No complaints yet.</p></div>';
    return;
  }
  list.innerHTML = recent.map(c => `
    <div class="recent-item">
      <div class="ri-left">
        <div class="ri-id">${c.id}</div>
        <div class="ri-type">${c.type}</div>
        <div class="ri-loc">${c.facility} · ${c.district}</div>
      </div>
      <span class="status-badge ${c.status === 'resolved' ? 'sb-resolved' : c.status === 'in-review' ? 'sb-review' : 'sb-pending'}">
        ${c.status === 'resolved' ? 'Resolved' : c.status === 'in-review' ? 'In Review' : 'Pending'}
      </span>
    </div>
  `).join('');
});

// Quick track
async function quickTrack() {
  const id = document.getElementById('quickTrackId').value.trim();
  const resultEl = document.getElementById('quickTrackResult');
  if (!id) { resultEl.style.display='block'; resultEl.innerHTML='<span style="color:var(--red)">Please enter a grievance ID.</span>'; return; }
  const c = await DB.getComplaintById(id);
  if (!c) {
    resultEl.style.display='block';
    resultEl.innerHTML=`<div class="alert alert-error">No complaint found with ID <strong>${id}</strong>. Please check and try again.</div>`;
    return;
  }
  const statusLabel = c.status === 'resolved' ? 'Resolved' : c.status === 'in-review' ? 'In Review' : 'Pending';
  const statusClass = c.status === 'resolved' ? 'sb-resolved' : c.status === 'in-review' ? 'sb-review' : 'sb-pending';
  resultEl.style.display='block';
  resultEl.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <strong style="font-family:'Syne',sans-serif;color:var(--blue)">${c.id}</strong>
      <span class="status-badge ${statusClass}">${statusLabel}</span>
    </div>
    <div style="font-size:13px;color:var(--text3)">${c.type} · ${c.facility}</div>
    <div style="font-size:12px;color:var(--text4);margin-top:4px">Filed: ${c.filed} · Last update: ${c.updated}</div>
    <a href="pages/track.html?id=${c.id}" style="display:inline-block;margin-top:10px;font-size:13px;font-weight:600;color:var(--blue)">View full details →</a>
  `;
}

document.getElementById('quickTrackId').addEventListener('keypress', e => { if (e.key === 'Enter') quickTrack(); });
