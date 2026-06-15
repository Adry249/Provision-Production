// ========== ADMIN PAGE ==========

const SUPABASE_URL = "https://gnkdiueognmmxhsuqudg.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdua2RpdWVvZ25tbXhoc3VxdWRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTUzMjU3NywiZXhwIjoyMDk3MTA4NTc3fQ.9uVC-T3NsNYI8Wjuvxw1YnlFhG-ekeCa9KcJd0odVrk";
const ADMIN_PASSWORD = "admin321";

let allData = [];
let currentFilter = "all";

// LOGIN
function doLogin() {
  const val = document.getElementById("passwordInput").value;
  if (val === ADMIN_PASSWORD) {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadData();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}
document.getElementById("passwordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") doLogin();
});

function doLogout() {
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("passwordInput").value = "";
}

// LOAD DATA
async function loadData() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/applications?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    allData = await res.json();
    updateStats();
    renderTable();
  } catch (e) {
    showToast("Ошибка загрузки данных", true);
  }
}

// STATS
function updateStats() {
  const nou = allData.filter((r) => r.status === "nou").length;
  const inCurs = allData.filter((r) => r.status === "in_curs").length;
  const inchis = allData.filter((r) => r.status === "inchis").length;
  document.getElementById("sNou").textContent = nou;
  document.getElementById("sInCurs").textContent = inCurs;
  document.getElementById("sInchis").textContent = inchis;
  document.getElementById("sTotal").textContent = allData.length;
  document.getElementById("totalCount").textContent = allData.length;
}

// FILTER
function setFilter(f, btn) {
  currentFilter = f;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderTable();
}

// SEARCH
document.getElementById("searchInput").addEventListener("input", renderTable);

// RENDER TABLE
function renderTable() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  let rows = allData;

  if (currentFilter !== "all")
    rows = rows.filter((r) => r.status === currentFilter);
  if (q)
    rows = rows.filter(
      (r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.phone || "").toLowerCase().includes(q) ||
        (r.instagram || "").toLowerCase().includes(q),
    );

  const tbody = document.getElementById("tableBody");
  if (rows.length === 0) {
    tbody.innerHTML =
      '<tr class="empty-row"><td colspan="8">Заявок не найдено</td></tr>';
    return;
  }

  tbody.innerHTML = rows
    .map(
      (r, i) => `
      <tr>
        <td style="color:var(--gray);font-size:12px;">${i + 1}</td>
        <td class="td-name">${esc(r.name)}</td>
        <td class="td-ig">${esc(r.instagram)}</td>
        <td class="td-phone">${esc(r.phone)}</td>
        <td><span class="td-pkg">${esc(r.package)}</span></td>
        <td class="td-msg" title="${esc(r.message)}">${esc(r.message)}</td>
        <td class="td-date">${formatDate(r.created_at)}</td>
        <td>
          <select class="status-select status-${r.status}" onchange="updateStatus(${r.id}, this)">
            <option value="nou"     ${r.status === "nou" ? "selected" : ""}>🔵 Новый</option>
            <option value="in_curs" ${r.status === "in_curs" ? "selected" : ""}>🟡 В процессе</option>
            <option value="inchis"  ${r.status === "inchis" ? "selected" : ""}>⚫ Закрыт</option>
          </select>
        </td>
      </tr>
    `,
    )
    .join("");
}

// UPDATE STATUS
async function updateStatus(id, selectEl) {
  const newStatus = selectEl.value;
  selectEl.className = `status-select status-${newStatus}`;
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/applications?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status: newStatus }),
    });
    // update local data
    const rec = allData.find((r) => r.id === id);
    if (rec) rec.status = newStatus;
    updateStats();
    showToast("Статус обновлён");
  } catch (e) {
    showToast("Ошибка обновления", true);
  }
}

// HELPERS
function esc(s) {
  if (!s) return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }) +
    " " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );
}
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => (t.className = "toast"), 3000);
}
