(function () {
  const STORAGE_KEY = 'rsvp_admin_key';
  const loginSection = document.getElementById('login-section');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const adminKeyInput = document.getElementById('admin-key');
  const refreshBtn = document.getElementById('refresh-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loadingEl = document.getElementById('loading');
  const tableWrap = document.getElementById('table-wrap');
  const tableError = document.getElementById('table-error');
  const tableErrorText = document.getElementById('table-error-text');
  const tbody = document.getElementById('rsvp-tbody');
  const emptyState = document.getElementById('empty-state');

  const statTotal = document.getElementById('stat-total');
  const statYes = document.getElementById('stat-yes');
  const statNo = document.getElementById('stat-no');
  const statGuests = document.getElementById('stat-guests');

  if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.includes('YOUR_GOOGLE')) {
    loginError.textContent = 'Set SCRIPT_URL in js/config.js first.';
    loginError.hidden = false;
    loginForm.querySelector('button').disabled = true;
  }

  const savedKey = sessionStorage.getItem(STORAGE_KEY);
  if (savedKey) {
    showDashboard(savedKey);
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const key = adminKeyInput.value.trim();
    const ok = await fetchData(key);
    if (ok) {
      sessionStorage.setItem(STORAGE_KEY, key);
      showDashboard(key);
    } else {
      loginError.hidden = false;
    }
  });

  refreshBtn.addEventListener('click', () => {
    const key = sessionStorage.getItem(STORAGE_KEY);
    if (key) fetchData(key);
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEY);
    dashboard.hidden = true;
    loginSection.hidden = false;
    adminKeyInput.value = '';
  });

  function showDashboard(key) {
    loginSection.hidden = true;
    dashboard.hidden = false;
    fetchData(key);
  }

  async function fetchData(adminKey) {
    setLoading(true);
    hideTableError();

    const url = `${CONFIG.SCRIPT_URL}?action=list&key=${encodeURIComponent(adminKey)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Unauthorized');
      }

      renderStats(data.stats);
      renderTable(data.rows);
      return true;
    } catch (err) {
      tableErrorText.textContent = err.message || 'Failed to load data.';
      tableError.hidden = false;
      tableWrap.hidden = true;
      emptyState.hidden = true;
      return false;
    } finally {
      setLoading(false);
    }
  }

  function renderStats(stats) {
    statTotal.textContent = stats.total;
    statYes.textContent = stats.attending;
    statNo.textContent = stats.notAttending;
    statGuests.textContent = stats.totalGuests;
  }

  function renderTable(rows) {
    tbody.innerHTML = '';

    if (!rows.length) {
      tableWrap.hidden = true;
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    tableWrap.hidden = false;

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      const attending = row.attending === 'yes';
      tr.innerHTML = `
        <td>${formatPHTime(row.timestamp)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.email)}</td>
        <td><span class="badge ${attending ? 'badge-yes' : 'badge-no'}">${attending ? 'Yes' : 'No'}</span></td>
        <td>${escapeHtml(String(row.guests))}</td>
        <td>${escapeHtml(row.message) || '—'}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function setLoading(loading) {
    loadingEl.hidden = !loading;
    refreshBtn.disabled = loading;
  }

  function hideTableError() {
    tableError.hidden = true;
  }

  function formatPHTime(ts) {
    if (!ts) return '—';
    var d = new Date(ts);
    if (isNaN(d.getTime())) return escapeHtml(ts);
    var options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'Asia/Manila'
    };
    return d.toLocaleDateString('en-PH', options);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
