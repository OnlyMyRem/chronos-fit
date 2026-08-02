(() => {
  "use strict";

  const TIME_ZONE = "Asia/Shanghai";
  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let plans = {};
  let weekdayPlan = {};
  let currentDate = "";
  let currentPlan = "";
  let loaded = false;

  const $ = (id) => document.getElementById(id);

  // ---------- Beijing time helpers ----------
  function bjParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (t) => parts.find((p) => p.type === t)?.value ?? "";
    return {
      year: +get("year"),
      month: +get("month"),
      day: +get("day"),
      weekday: get("weekday"),
      hour: get("hour").padStart(2, "0"),
      minute: get("minute").padStart(2, "0"),
      second: get("second").padStart(2, "0"),
    };
  }

  const toISO = ({ year, month, day }) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  function dateWithOffset({ year, month, day }, offsetDays) {
    const base = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    base.setUTCDate(base.getUTCDate() + offsetDays);
    return bjParts(base);
  }

  // ---------- Clock ----------
  function tick() {
    const p = bjParts();
    $("time").textContent = `${p.hour}:${p.minute}:${p.second}`;
    $("date").textContent = toISO(p);
    $("weekday").textContent = p.weekday;
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Plans ----------
  function nearestPlanDate(todayParts) {
    for (let i = 0; i <= 7; i++) {
      const d = dateWithOffset(todayParts, i);
      const plan = weekdayPlan[d.weekday];
      if (plan) return { iso: toISO(d), plan };
    }
    return null;
  }

  function populateSelect() {
    const sel = $("plan-select");
    sel.innerHTML = "";
    Object.keys(plans).forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.append(opt);
    });
    sel.value = currentPlan;
  }

  function renderPlan() {
    const itemsEl = $("items");
    const title = $("plan-title");
    const names = plans[currentPlan] || [];
    title.textContent = currentPlan;
    itemsEl.innerHTML = "";

    if (!names.length) {
      itemsEl.classList.add("empty");
      itemsEl.textContent = "No items defined for this plan.";
      $("progress").textContent = "0/0";
      return;
    }

    itemsEl.classList.remove("empty");
    for (const name of names) {
      const li = document.createElement("li");
      li.className = "item";

      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.name = name;

      const span = document.createElement("span");
      span.className = "name";
      span.textContent = name;

      label.append(cb, span);
      li.append(label);
      cb.addEventListener("change", () => handleToggle(li, cb));
      itemsEl.append(li);
    }
    updateProgress();
  }

  async function loadLogs() {
    if (!loaded) return;
    const res = await fetch(`/api/logs?log_date=${encodeURIComponent(currentDate)}`);
    const logs = await res.json();
    const done = new Set(logs.filter((l) => l.is_completed === 1).map((l) => l.item_name));
    document.querySelectorAll(".item").forEach((li) => {
      const cb = li.querySelector("input");
      const checked = done.has(cb.dataset.name);
      cb.checked = checked;
      li.classList.toggle("done", checked);
    });
    updateProgress();
  }

  function updateProgress() {
    const items = document.querySelectorAll(".item");
    const total = items.length;
    const done = document.querySelectorAll(".item.done").length;
    $("progress").textContent = `${done}/${total}`;
  }

  // ---------- Toggle & save ----------
  function setStatus(msg, cls) {
    const el = $("save-status");
    el.textContent = msg;
    el.className = cls || "";
  }

  async function handleToggle(li, cb) {
    const prev = cb.checked;
    cb.disabled = true;
    setStatus("Saving…", "saving");
    try {
      const res = await fetch("/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_date: currentDate,
          schedule_type: currentPlan,
          item_name: cb.dataset.name,
          is_completed: cb.checked,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      li.classList.toggle("done", cb.checked);
      updateProgress();
      setStatus(`Saved ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      cb.checked = prev;
      li.classList.toggle("done", prev);
      setStatus("Save failed — please retry", "error");
    } finally {
      cb.disabled = false;
    }
  }

  // ---------- Fullscreen ----------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  // ---------- Init ----------
  async function init() {
    const res = await fetch("/api/plans");
    const data = await res.json();
    plans = data.plans;
    weekdayPlan = data.weekday_plan;

    const todayParts = bjParts();
    $("log-date").value = currentDate = toISO(todayParts);

    const def = weekdayPlan[todayParts.weekday]
      ? { iso: toISO(todayParts), plan: weekdayPlan[todayParts.weekday] }
      : nearestPlanDate(todayParts);
    currentPlan = def ? def.plan : Object.keys(plans)[0] || "";
    if (def) $("log-date").value = currentDate = def.iso;

    populateSelect();
    renderPlan();
    loaded = true;
    loadLogs();

    $("fullscreen-btn").addEventListener("click", toggleFullscreen);

    $("log-date").addEventListener("change", (e) => {
      currentDate = e.target.value;
      const p = bjParts(new Date(Date.UTC(
        +currentDate.slice(0, 4), +currentDate.slice(5, 7) - 1, +currentDate.slice(8, 10), 12)));
      if (weekdayPlan[p.weekday]) {
        currentPlan = weekdayPlan[p.weekday];
        $("plan-select").value = currentPlan;
        renderPlan();
      }
      loadLogs();
    });

    $("plan-select").addEventListener("change", (e) => {
      currentPlan = e.target.value;
      renderPlan();
      loadLogs();
    });

    document.addEventListener("fullscreenchange", () => {
      $("fullscreen-btn").textContent =
        document.fullscreenElement ? "⛶ Exit" : "⛶ Fullscreen";
    });
  }

  init();
})();
