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
    document.querySelectorAll("#items .item").forEach((li) => {
      const cb = li.querySelector("input");
      const checked = done.has(cb.dataset.name);
      cb.checked = checked;
      li.classList.toggle("done", checked);
    });
    updateProgress();
  }

  function updateProgress() {
    const items = document.querySelectorAll("#items .item");
    const total = items.length;
    const done = document.querySelectorAll("#items .item.done").length;
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

  // ---------- Custom items ----------
  async function loadCustom() {
    if (!loaded) return;
    const res = await fetch(`/api/custom/logs?log_date=${encodeURIComponent(currentDate)}`);
    const logs = await res.json();
    const box = $("custom-items");
    box.innerHTML = "";
    logs.forEach((log) => box.append(makeCustomLi(log.item_name, log.is_completed === 1)));
    box.append(makeAddRow());
  }

  function makeCustomLi(name, done) {
    const li = document.createElement("li");
    li.className = "item custom" + (done ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = done;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "ctext";
    inp.value = name;
    inp.maxLength = 120;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.title = "删除";
    del.textContent = "\u2715";

    li.append(cb, inp, del);

    cb.addEventListener("change", async () => {
      cb.disabled = true;
      try {
        const res = await fetch("/api/custom/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            log_date: currentDate,
            item_name: name,
            is_completed: cb.checked,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        li.classList.toggle("done", cb.checked);
        setStatus(`Saved ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        cb.checked = !cb.checked;
        setStatus("Save failed — please retry", "error");
      } finally {
        cb.disabled = false;
      }
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inp.blur();
      }
    });
    inp.addEventListener("change", () => renameCustomItem(name, li));

    del.addEventListener("click", async () => {
      await fetch(
        `/api/custom?log_date=${encodeURIComponent(currentDate)}&item_name=${encodeURIComponent(name)}`,
        { method: "DELETE" }
      );
      loadCustom();
    });

    return li;
  }

  async function renameCustomItem(oldName, li) {
    const inp = li.querySelector(".ctext");
    const name = inp.value.trim();
    const done = li.classList.contains("done");
    if (!name) {
      inp.value = oldName;
      return;
    }
    if (name === oldName) return;
    const headers = { "Content-Type": "application/json" };
    await fetch("/api/custom/add", {
      method: "POST", headers,
      body: JSON.stringify({ log_date: currentDate, item_name: name }),
    });
    if (done) {
      await fetch("/api/custom/toggle", {
        method: "POST", headers,
        body: JSON.stringify({ log_date: currentDate, item_name: name, is_completed: true }),
      });
    }
    await fetch(
      `/api/custom?log_date=${encodeURIComponent(currentDate)}&item_name=${encodeURIComponent(oldName)}`,
      { method: "DELETE" }
    );
    loadCustom();
  }

  function makeAddRow() {
    const li = document.createElement("li");
    li.className = "item add-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.disabled = true;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "ctext";
    inp.id = "custom-input";
    inp.placeholder = "点此添加自定义项目，回车保存…";
    inp.maxLength = 120;

    li.append(cb, inp);

    inp.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const name = inp.value.trim();
        if (!name) return;
        const res = await fetch("/api/custom/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ log_date: currentDate, item_name: name }),
        });
        if (!res.ok) return;
        loadCustom();
      } else if (e.key === "Escape") {
        inp.value = "";
      }
    });

    return li;
  }

  // ---------- Today ----------
  function goToday() {
    const todayParts = bjParts();
    const def = weekdayPlan[todayParts.weekday]
      ? { iso: toISO(todayParts), plan: weekdayPlan[todayParts.weekday] }
      : nearestPlanDate(todayParts);
    currentPlan = def ? def.plan : Object.keys(plans)[0] || "";
    currentDate = def ? def.iso : toISO(todayParts);
    $("log-date").value = currentDate;
    $("plan-select").value = currentPlan;
    renderPlan();
    loadLogs();
    loadCustom();
  }

  // ---------- Metronome ----------
  let actx = null;

  function ensureAudio() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function chime(freq, when, dur, vol, type) {
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    o.type = type || "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    const t = ctx.currentTime + when;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function beep() {
    ensureAudio();
    try {
      chime(698.46, 0, 0.5, 0.9, "sine");
      chime(880.0, 0.30, 0.5, 0.9, "sine");
      chime(1174.66, 0.60, 0.7, 0.9, "sine");
    } catch (err) {
      /* ignore */
    }
  }

  const metro = { interval: 120000, running: false, nextAt: 0, timer: null };

  function formatMs(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function metroRender(reason) {
    const count = $("metro-count");
    const status = $("metro-status");
    if (metro.running) {
      count.textContent = formatMs(metro.nextAt - Date.now());
      status.textContent = reason === "finish" ? "到点！" : "运行中";
    } else {
      count.textContent = formatMs(metro.interval);
      status.textContent = "已停止";
    }
  }

  function metroTick() {
    const rem = metro.nextAt - Date.now();
    if (rem <= 0) {
      beep();
      metro.nextAt = Date.now() + metro.interval;
      metroRender(true);
      setTimeout(() => metroRender(false), 2000);
    } else {
      metroRender(false);
    }
  }

  function metroStart() {
    metro.nextAt = Date.now() + metro.interval;
    metro.running = true;
    $("metro-toggle").textContent = "■ 停止";
    $("metro-toggle").classList.add("active");
    metro.timer = setInterval(metroTick, 250);
    metroRender(false);
    updatePresetActive();
  }

  function metroStop() {
    metro.running = false;
    if (metro.timer) clearInterval(metro.timer);
    metro.timer = null;
    $("metro-toggle").textContent = "▶ 开始";
    $("metro-toggle").classList.remove("active");
    metroRender(false);
  }

  function metroSetSeconds(sec) {
    metro.interval = Math.max(1, Math.round(sec) || 60) * 1000;
    $("metro-min").value = Math.floor(metro.interval / 60000);
    $("metro-sec").value = Math.round((metro.interval % 60000) / 1000);
    updatePresetActive();
    if (metro.running) {
      metro.nextAt = Date.now() + metro.interval;
      metroRender(false);
    } else {
      metroRender(false);
    }
  }

  function applyMetroDuration() {
    const m = parseInt($("metro-min").value, 10) || 0;
    const s = parseInt($("metro-sec").value, 10) || 0;
    if (m === 0 && s === 0) return;
    metroSetSeconds(m * 60 + s);
    if (!metro.running) metroStart();
  }

  function updatePresetActive() {
    const activeSec = metro.interval / 1000;
    document.querySelectorAll("#metro-presets button").forEach((btn) => {
      btn.classList.toggle("active", +btn.dataset.sec === activeSec);
    });
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
    loadCustom();

    $("fullscreen-btn").addEventListener("click", toggleFullscreen);
    $("today-btn").addEventListener("click", goToday);

    $("metro-toggle").addEventListener("click", () => {
      if (metro.running) metroStop();
      else metroStart();
    });

    $("metro-apply").addEventListener("click", applyMetroDuration);
    $("metro-min").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyMetroDuration();
      }
    });
    $("metro-sec").addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyMetroDuration();
      }
    });
    document.querySelectorAll("#metro-presets button").forEach((btn) => {
      btn.addEventListener("click", () => {
        metroSetSeconds(+btn.dataset.sec);
        metroStart();
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && metro.running) metroRender(false);
    });

    updatePresetActive();

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
      loadCustom();
    });

    $("plan-select").addEventListener("change", (e) => {
      currentPlan = e.target.value;
      renderPlan();
      loadLogs();
      loadCustom();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    });

    const hint = $("fullscreen-hint");
    document.addEventListener("fullscreenchange", () => {
      $("fullscreen-btn").textContent =
        document.fullscreenElement ? "⛶ Exit" : "⛶ Fullscreen";
      hint.classList.toggle("show", !!document.fullscreenElement);
    });
  }

  init();
})();
