/* ============================================================
   TechPrep OS — Personal Habit & Career Tracker Engine
   Strict Rule: Preloaded content ONLY. Zero fake progress.
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "techprep-os-v2";

  /* ============================================================
     1. PRELOADED CONTENT STRUCTURES (IMMUTABLE TEMPLATES)
     ============================================================ */

  const PRELOADED_HABITS = [
    { id: "h_dsa", name: "DSA", category: "Coding", icon: "🧩" },
    { id: "h_dev", name: "Development", category: "Coding", icon: "💻" },
    { id: "h_aiml", name: "AI / ML", category: "Learning", icon: "🤖" },
    { id: "h_eng", name: "English Speaking", category: "Communication", icon: "🗣" },
    { id: "h_read", name: "Reading", category: "Learning", icon: "📚" },
    { id: "h_tech_int", name: "Technical Interview Practice", category: "Career", icon: "🎯" },
    { id: "h_gd", name: "GD Practice", category: "Communication", icon: "💬" },
    { id: "h_gym", name: "Workout", category: "Fitness", icon: "🏋️‍♂️" },
    { id: "h_med", name: "Meditation", category: "Mindfulness", icon: "🧘" },
    { id: "h_deep", name: "Deep Work", category: "Coding", icon: "⚡" },
    { id: "h_rev", name: "Daily Revision", category: "Learning", icon: "🔄" },
    { id: "h_sleep", name: "Sleep 7–8 Hours", category: "Personal", icon: "😴" },
    { id: "h_plan", name: "Daily Planning", category: "Personal", icon: "📝" }
  ];

  const DSA_TOPICS = [
    "Arrays", "Strings", "Hashing", "Two Pointers", "Sliding Window",
    "Binary Search", "Linked List", "Stack", "Queue", "Recursion",
    "Backtracking", "Trees", "BST", "Heap", "Graphs",
    "Greedy", "Dynamic Programming", "Tries", "Intervals", "Bit Manipulation", "Math"
  ];

  const DEV_ROADMAP = [
    { category: "PROGRAMMING", topics: ["Java", "Python", "OOP"] },
    { category: "FRONTEND", topics: ["HTML", "CSS", "JavaScript", "TypeScript", "React"] },
    { category: "BACKEND", topics: ["Spring Boot", "REST APIs", "Spring Security", "JPA / Hibernate", "Microservices"] },
    { category: "DATABASE", topics: ["SQL", "PostgreSQL", "Database Design", "Redis"] },
    { category: "TOOLS", topics: ["Git", "GitHub", "Docker"] },
    { category: "CLOUD", topics: ["AWS / Cloud Fundamentals"] },
    { category: "SYSTEM DESIGN", topics: ["Low Level Design", "High Level Design"] }
  ];

  const AI_ML_TOPICS = [
    "Python", "NumPy", "Pandas", "Matplotlib", "Statistics", "Probability", "Linear Algebra",
    "Machine Learning", "Regression", "Classification", "Clustering", "Decision Trees",
    "Random Forest", "XGBoost", "Feature Engineering", "Model Evaluation", "Scikit-learn",
    "Deep Learning", "Neural Networks", "CNN", "RNN", "Transformers", "NLP", "Computer Vision",
    "LLMs", "Generative AI", "Prompt Engineering", "Embeddings", "Vector Databases", "RAG",
    "Fine-tuning", "AI Agents", "LLM APIs", "MLOps"
  ];

  const CS_FUNDAMENTALS = [
    "OOP", "DBMS", "Operating Systems", "Computer Networks",
    "Computer Architecture", "Software Engineering", "SQL", "System Design"
  ];

  const CS_TASKS = ["Learn", "Make Notes", "Practice", "Revise", "Interview Questions"];

  const COMM_ACTIVITIES = [
    "English Speaking", "Reading", "Vocabulary", "Grammar", "Pronunciation",
    "Technical Explanation", "GD Practice", "HR Practice", "Mock Interview"
  ];

  const GYM_CATEGORIES = [
    "Push", "Pull", "Legs", "Chest", "Back", "Shoulders", "Arms", "Core", "Cardio"
  ];

  const GYM_DAILY_HABITS = ["Workout", "Steps", "Water", "Stretching"];

  const DEFAULT_PROJECT_TEMPLATES = [
    { id: "p1", title: "Full Stack Web Application", tech: "React, Node.js, PostgreSQL", status: "IDEA", progress: 0, isTemplate: true },
    { id: "p2", title: "Spring Boot Backend Application", tech: "Java, Spring Boot, REST APIs, JPA", status: "IDEA", progress: 0, isTemplate: true },
    { id: "p3", title: "Machine Learning Project", tech: "Python, Scikit-learn, Pandas", status: "IDEA", progress: 0, isTemplate: true },
    { id: "p4", title: "GenAI / RAG Application", tech: "LangChain, OpenAI, Vector DB", status: "IDEA", progress: 0, isTemplate: true },
    { id: "p5", title: "AI Agent Application", tech: "Python, LLM APIs, AutoGen", status: "IDEA", progress: 0, isTemplate: true }
  ];

  const DEFAULT_GOAL_TEMPLATES = [
    { id: "g1", title: "Solve DSA Problems", target: 100, current: 0 },
    { id: "g2", title: "Build Projects", target: 5, current: 0 },
    { id: "g3", title: "Learn Spring Boot", target: 1, current: 0 },
    { id: "g4", title: "Learn React", target: 1, current: 0 },
    { id: "g5", title: "Learn AI/ML", target: 1, current: 0 },
    { id: "g6", title: "Build GenAI Project", target: 1, current: 0 },
    { id: "g7", title: "Improve English", target: 1, current: 0 },
    { id: "g8", title: "Practice GD", target: 10, current: 0 },
    { id: "g9", title: "Practice Interviews", target: 5, current: 0 },
    { id: "g10", title: "Maintain Gym Consistency", target: 30, current: 0 }
  ];

  /* ============================================================
     2. INITIAL ZERO-PROGRESS STATE GENERATOR
     ============================================================ */

  function createInitialEmptyState() {
    return {
      darkMode: true,
      customHabits: [],
      dailyCheckins: {},  // dateStr -> { habitId: true/false }
      studyHours: {},     // dateStr -> totalHours
      dsaLogs: [],        // array of { id, topic, title, difficulty, date, notes }
      devProgress: {},    // topicName -> "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
      aiProgress: {},     // topicName -> "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
      csProgress: {},     // "subjectName_taskName" -> true/false
      commProgress: {},   // activityName -> true/false
      gymDailyHabits: {}, // dateStr -> { habitName: true/false }
      workoutLogs: [],    // array of { id, date, category, exercise, sets, reps, weight, duration, notes }
      projects: JSON.parse(JSON.stringify(DEFAULT_PROJECT_TEMPLATES)),
      internships: [],    // array of { id, company, role, appliedDate, deadline, status, notes }
      goals: JSON.parse(JSON.stringify(DEFAULT_GOAL_TEMPLATES))
    };
  }

  /* ============================================================
     3. LOCALSTORAGE MANAGEMENT & STATE
     ============================================================ */

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Ensure structure completeness
        if (!parsed.projects) parsed.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECT_TEMPLATES));
        if (!parsed.goals) parsed.goals = JSON.parse(JSON.stringify(DEFAULT_GOAL_TEMPLATES));
        return parsed;
      }
    } catch (e) {
      console.warn("Error reading localStorage:", e);
    }
    const fresh = createInitialEmptyState();
    saveState(fresh);
    return fresh;
  }

  function saveState(s) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {
      console.warn("Error writing localStorage:", e);
    }
  }

  let state = loadState();

  /* ============================================================
     4. DATE & TIME HELPER UTILITIES
     ============================================================ */

  let activeDate = new Date();
  let activeMatrixDate = new Date();
  let activeCalDate = new Date();

  function pad(n) { return String(n).padStart(2, "0"); }
  function toDateKey(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function formatNiceDate(d) {
    const today = new Date();
    if (toDateKey(d) === toDateKey(today)) return `Today, ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
    return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function getAllHabits() {
    return [...PRELOADED_HABITS, ...(state.customHabits || [])];
  }

  /* ============================================================
     5. STREAKS & METRICS CALCULATIONS (REAL DATA ONLY)
     ============================================================ */

  function calculateStreak() {
    const allHabits = getAllHabits();
    if (!allHabits.length) return { current: 0, longest: 0 };

    let curStreak = 0;
    let maxStreak = 0;

    let checkDate = new Date();
    let key = toDateKey(checkDate);

    // Check if at least 1 habit completed on checkDate
    let hasDoneToday = allHabits.some(h => state.dailyCheckins[key] && state.dailyCheckins[key][h.id]);

    if (!hasDoneToday) {
      // Check yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      key = toDateKey(checkDate);
      let hasDoneYesterday = allHabits.some(h => state.dailyCheckins[key] && state.dailyCheckins[key][h.id]);
      if (!hasDoneYesterday) return { current: 0, longest: 0 };
    }

    // Count backwards continuous days with at least 1 habit checked
    while (true) {
      const dKey = toDateKey(checkDate);
      const done = allHabits.some(h => state.dailyCheckins[dKey] && state.dailyCheckins[dKey][h.id]);
      if (done) {
        curStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Compute longest streak across all recorded history
    const recordedDates = Object.keys(state.dailyCheckins).sort();
    let temp = 0;
    for (let i = 0; i < recordedDates.length; i++) {
      const dKey = recordedDates[i];
      const hasAny = allHabits.some(h => state.dailyCheckins[dKey] && state.dailyCheckins[dKey][h.id]);
      if (hasAny) {
        temp++;
        maxStreak = Math.max(maxStreak, temp);
      } else {
        temp = 0;
      }
    }

    return { current: curStreak, longest: Math.max(curStreak, maxStreak) };
  }

  function getTodayStats() {
    const key = toDateKey(activeDate);
    const habits = getAllHabits();
    const total = habits.length;
    let done = 0;

    if (state.dailyCheckins[key]) {
      habits.forEach(h => {
        if (state.dailyCheckins[key][h.id]) done++;
      });
    }

    const pct = total ? Math.round((done / total) * 100) : 0;
    const hours = state.studyHours[key] || 0.0;
    const streak = calculateStreak();

    return { done, total, pct, hours, streak };
  }

  /* ============================================================
     6. UI RENDER CONTROLLERS
     ============================================================ */

  // Toast Notification
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast-el");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2500);
  }

  // Header quick stats
  function renderHeaderStats() {
    document.getElementById("active-date-display").textContent = formatNiceDate(activeDate);
    const { hours, streak } = getTodayStats();
    const dsaSolved = state.dsaLogs.length;

    document.getElementById("head-streak-val").textContent = `${streak.current} Days`;
    document.getElementById("head-dsa-val").textContent = `${dsaSolved} Solved`;
    document.getElementById("head-study-val").textContent = `${hours.toFixed(1)} hrs`;
  }

  // 1. TODAY VIEW RENDER
  let selectedCategoryFilter = "ALL";

  function renderTodayView() {
    const { done, total, pct, hours, streak } = getTodayStats();

    document.getElementById("today-habits-ratio").textContent = `${done} / ${total}`;
    document.getElementById("today-habits-fill").style.width = `${pct}%`;
    document.getElementById("today-habits-pct").textContent = `${pct}%`;
    document.getElementById("today-hours-val").textContent = `${hours.toFixed(1)} hrs`;
    document.getElementById("today-streak-val").textContent = `${streak.current} Days`;
    document.getElementById("today-streak-sub").textContent = `Longest: ${streak.longest} Days`;

    // Monthly average
    const now = new Date();
    const totalDays = now.getDate();
    let monthTotalPct = 0;
    const allHabits = getAllHabits();

    for (let d = 1; d <= totalDays; d++) {
      const dk = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(d)}`;
      if (state.dailyCheckins[dk]) {
        let dDone = 0;
        allHabits.forEach(h => { if (state.dailyCheckins[dk][h.id]) dDone++; });
        if (allHabits.length) monthTotalPct += (dDone / allHabits.length);
      }
    }
    const monthAvg = totalDays ? Math.round((monthTotalPct / totalDays) * 100) : 0;
    document.getElementById("today-month-avg").textContent = `${monthAvg}%`;

    // Habit List Rendering
    const listEl = document.getElementById("today-habit-list");
    listEl.innerHTML = "";

    const activeKey = toDateKey(activeDate);
    const activeCheckins = state.dailyCheckins[activeKey] || {};

    const filtered = allHabits.filter(h => {
      if (selectedCategoryFilter === "ALL") return true;
      return h.category === selectedCategoryFilter;
    });

    if (!filtered.length) {
      listEl.innerHTML = `<div class="empty-state"><p>No habits found for category "${selectedCategoryFilter}".</p></div>`;
      return;
    }

    filtered.forEach(h => {
      const isChecked = !!activeCheckins[h.id];
      const row = document.createElement("div");
      row.className = "habit-row-item";
      row.innerHTML = `
        <div class="habit-row-left">
          <button class="habit-check-box ${isChecked ? 'is-checked' : ''}" data-habit-id="${h.id}">
            ${isChecked ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </button>
          <span class="habit-icon">${h.icon}</span>
          <span class="habit-name">${h.name}</span>
          <span class="habit-meta-cat">${h.category}</span>
        </div>
        <div class="habit-row-right">
          <span class="text-sub font-mono" style="font-size:12px;">${isChecked ? 'Completed' : 'Pending'}</span>
        </div>
      `;

      row.querySelector(".habit-check-box").addEventListener("click", () => {
        toggleHabitCheck(h.id);
      });

      listEl.appendChild(row);
    });

    // Update pending badge
    const pendingCount = total - done;
    document.getElementById("badge-today-pending").textContent = pendingCount;
  }

  function toggleHabitCheck(habitId) {
    const key = toDateKey(activeDate);
    if (!state.dailyCheckins[key]) state.dailyCheckins[key] = {};
    state.dailyCheckins[key][habitId] = !state.dailyCheckins[key][habitId];
    saveState(state);
    renderAll();
    showToast(state.dailyCheckins[key][habitId] ? "Habit checked off! ✅" : "Habit unchecked.");
  }


  // 2. MONTHLY SPREADSHEET MATRIX RENDER
  function renderMatrixView() {
    const tableEl = document.getElementById("matrix-table");
    const year = activeMatrixDate.getFullYear();
    const month = activeMatrixDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const allHabits = getAllHabits();
    const now = new Date();

    document.getElementById("matrix-month-label").textContent = `${MONTH_NAMES[month]} ${year}`;

    let html = `<thead><tr><th class="col-habit-header">Habit / Category</th>`;
    for (let d = 1; d <= totalDays; d++) {
      html += `<th style="width:30px;">${d}</th>`;
    }
    html += `</tr></thead><tbody>`;

    allHabits.forEach(h => {
      html += `<tr><td class="col-habit-name"><span>${h.icon}</span> <span>${h.name}</span></td>`;
      for (let d = 1; d <= totalDays; d++) {
        const dKey = `${year}-${pad(month + 1)}-${pad(d)}`;
        const isDone = !!(state.dailyCheckins[dKey] && state.dailyCheckins[dKey][h.id]);
        const isFuture = new Date(year, month, d) > now;

        html += `<td>
          <div class="cell-toggle ${isDone ? 'is-done' : ''} ${isFuture ? 'is-future' : ''}" 
               data-matrix-key="${dKey}" data-matrix-habit="${h.id}">
            ${isDone ? '✓' : ''}
          </div>
        </td>`;
      }
      html += `</tr>`;
    });

    html += `</tbody>`;
    tableEl.innerHTML = html;

    // Cell click handler
    tableEl.querySelectorAll(".cell-toggle").forEach(cell => {
      cell.addEventListener("click", () => {
        if (cell.classList.contains("is-future")) return;
        const dKey = cell.dataset.matrixKey;
        const hId = cell.dataset.matrixHabit;

        if (!state.dailyCheckins[dKey]) state.dailyCheckins[dKey] = {};
        state.dailyCheckins[dKey][hId] = !state.dailyCheckins[dKey][hId];
        saveState(state);
        renderAll();
      });
    });

    // Weekly Summary Breakdown
    const weeklySummaryEl = document.getElementById("matrix-weekly-summary");
    let weekHtml = "";
    const weeks = [
      { name: "Week 1", start: 1, end: 7 },
      { name: "Week 2", start: 8, end: 14 },
      { name: "Week 3", start: 15, end: 21 },
      { name: "Week 4", start: 22, end: totalDays }
    ];

    weeks.forEach(w => {
      let wDone = 0;
      let wTotal = (w.end - w.start + 1) * allHabits.length;

      for (let d = w.start; d <= w.end; d++) {
        const dKey = `${year}-${pad(month + 1)}-${pad(d)}`;
        if (state.dailyCheckins[dKey]) {
          allHabits.forEach(h => {
            if (state.dailyCheckins[dKey][h.id]) wDone++;
          });
        }
      }

      const pct = wTotal ? Math.round((wDone / wTotal) * 100) : 0;

      weekHtml += `
        <div class="metric-card">
          <div class="mc-data">
            <span class="mc-title">${w.name} (${w.start}–${w.end})</span>
            <div class="mc-value">${wDone} Completed</div>
            <div class="mc-progress-bar"><div class="mc-fill" style="width:${pct}%"></div></div>
            <span class="mc-subtext mt-1">${pct}% Completion</span>
          </div>
        </div>
      `;
    });

    weeklySummaryEl.innerHTML = weekHtml;
  }


  // 3. DSA TRACKER RENDER
  function renderDSAView() {
    const logs = state.dsaLogs || [];
    document.getElementById("dsa-total-solved").textContent = `${logs.length} Problems`;

    const easy = logs.filter(l => l.difficulty === "Easy").length;
    const med = logs.filter(l => l.difficulty === "Medium").length;
    const hard = logs.filter(l => l.difficulty === "Hard").length;

    document.getElementById("dsa-easy-solved").textContent = easy;
    document.getElementById("dsa-medium-solved").textContent = med;
    document.getElementById("dsa-hard-solved").textContent = hard;

    // Preloaded Topic List
    const topicsListEl = document.getElementById("dsa-topics-list");
    topicsListEl.innerHTML = "";

    DSA_TOPICS.forEach(topic => {
      const count = logs.filter(l => l.topic === topic).length;
      const item = document.createElement("div");
      item.className = "dsa-topic-item";
      item.innerHTML = `
        <span class="dsa-topic-name">🧩 ${topic}</span>
        <span class="dsa-topic-count">${count} Solved</span>
      `;
      topicsListEl.appendChild(item);
    });

    // Populate DSA Topic Select dropdown in modal
    const topicSelect = document.getElementById("dsa-topic-select");
    if (topicSelect && topicSelect.children.length === 0) {
      DSA_TOPICS.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        topicSelect.appendChild(opt);
      });
    }

    // Problem Logs List
    const logsListEl = document.getElementById("dsa-logs-list");
    document.getElementById("dsa-logs-count").textContent = `${logs.length} logs`;

    if (!logs.length) {
      logsListEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No DSA problems logged yet.</p>
          <span class="empty-sub">Click "+ Log Solved Problem" to record your progress.</span>
        </div>
      `;
    } else {
      logsListEl.innerHTML = "";
      logs.slice().reverse().forEach(log => {
        const card = document.createElement("div");
        card.className = "dsa-log-card";
        card.innerHTML = `
          <div>
            <strong style="font-size:14px;">${log.title}</strong>
            <p class="text-sub" style="font-size:12px; margin-top:2px;">Topic: <strong>${log.topic}</strong> | ${log.date}</p>
            ${log.notes ? `<p class="text-muted" style="font-size:11.5px; margin-top:4px;">"${log.notes}"</p>` : ''}
          </div>
          <span class="diff-tag diff-${log.difficulty}">${log.difficulty}</span>
        `;
        logsListEl.appendChild(card);
      });
    }
  }


  // 4. DEVELOPMENT ROADMAP RENDER
  let selectedDevFilter = "ALL";

  function renderDevView() {
    const container = document.getElementById("dev-roadmap-container");
    container.innerHTML = "";

    DEV_ROADMAP.forEach(cat => {
      const catCard = document.createElement("div");
      catCard.className = "dev-cat-card";

      let topicsHtml = "";
      cat.topics.forEach(t => {
        const currentStatus = state.devProgress[t] || "NOT_STARTED";

        if (selectedDevFilter !== "ALL" && currentStatus !== selectedDevFilter) return;

        topicsHtml += `
          <div class="dev-topic-row">
            <span style="font-weight:600;">${t}</span>
            <select class="status-select" data-dev-topic="${t}">
              <option value="NOT_STARTED" ${currentStatus === "NOT_STARTED" ? "selected" : ""}>NOT STARTED</option>
              <option value="IN_PROGRESS" ${currentStatus === "IN_PROGRESS" ? "selected" : ""}>IN PROGRESS</option>
              <option value="COMPLETED" ${currentStatus === "COMPLETED" ? "selected" : ""}>COMPLETED</option>
            </select>
          </div>
        `;
      });

      if (topicsHtml) {
        catCard.innerHTML = `
          <div class="dev-cat-title">
            <span>${cat.category}</span>
          </div>
          <div>${topicsHtml}</div>
        `;
        container.appendChild(catCard);
      }
    });

    if (!container.children.length) {
      container.innerHTML = `<div class="empty-state"><p>No topics matching status "${selectedDevFilter}".</p></div>`;
    }

    container.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const topic = e.target.dataset.devTopic;
        state.devProgress[topic] = e.target.value;
        saveState(state);
        renderDevView();
        showToast(`Updated "${topic}" to ${e.target.value}`);
      });
    });
  }


  // 5. AI / ML TRACKER RENDER
  function renderAIMLView() {
    const grid = document.getElementById("aiml-topics-grid");
    grid.innerHTML = "";

    let completedCount = 0;

    AI_ML_TOPICS.forEach(topic => {
      const status = state.aiProgress[topic] || "NOT_STARTED";
      if (status === "COMPLETED") completedCount++;

      const card = document.createElement("div");
      card.className = "aiml-item-card";
      card.innerHTML = `
        <span class="aiml-item-title">${topic}</span>
        <select class="status-select" data-aiml-topic="${topic}">
          <option value="NOT_STARTED" ${status === "NOT_STARTED" ? "selected" : ""}>NOT STARTED (0%)</option>
          <option value="IN_PROGRESS" ${status === "IN_PROGRESS" ? "selected" : ""}>IN PROGRESS (50%)</option>
          <option value="COMPLETED" ${status === "COMPLETED" ? "selected" : ""}>COMPLETED (100%)</option>
        </select>
      `;
      grid.appendChild(card);
    });

    const overallPct = Math.round((completedCount / AI_ML_TOPICS.length) * 100);
    document.getElementById("aiml-overall-pct").textContent = `${overallPct}% (${completedCount} / ${AI_ML_TOPICS.length})`;

    grid.querySelectorAll(".status-select").forEach(select => {
      select.addEventListener("change", (e) => {
        const topic = e.target.dataset.aimlTopic;
        state.aiProgress[topic] = e.target.value;
        saveState(state);
        renderAIMLView();
        showToast(`Updated "${topic}" status.`);
      });
    });
  }


  // 6. CS FUNDAMENTALS RENDER
  function renderCSView() {
    const container = document.getElementById("cs-subjects-container");
    container.innerHTML = "";

    CS_FUNDAMENTALS.forEach(sub => {
      const card = document.createElement("div");
      card.className = "cs-subject-card";

      let tasksHtml = "";
      CS_TASKS.forEach(task => {
        const key = `${sub}_${task}`;
        const isChecked = !!state.csProgress[key];

        tasksHtml += `
          <label class="cs-task-row">
            <input type="checkbox" class="cs-checkbox" data-cs-key="${key}" ${isChecked ? "checked" : ""}>
            <span>${task}</span>
          </label>
        `;
      });

      card.innerHTML = `
        <h3 class="panel-title text-accent">📚 ${sub}</h3>
        <div class="cs-tasks-list">${tasksHtml}</div>
      `;

      container.appendChild(card);
    });

    container.querySelectorAll(".cs-checkbox").forEach(cb => {
      cb.addEventListener("change", (e) => {
        const key = e.target.dataset.csKey;
        state.csProgress[key] = e.target.checked;
        saveState(state);
        showToast("CS task updated.");
      });
    });
  }


  // 7. COMMUNICATION TRACKER RENDER
  function renderCommView() {
    const container = document.getElementById("comm-checklist-container");
    container.innerHTML = "";

    let doneCount = 0;

    COMM_ACTIVITIES.forEach(act => {
      const isChecked = !!state.commProgress[act];
      if (isChecked) doneCount++;

      const card = document.createElement("div");
      card.className = "comm-item-card";
      card.innerHTML = `
        <button class="habit-check-box ${isChecked ? 'is-checked' : ''}" data-comm-act="${act}">
          ${isChecked ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>
        <span style="font-weight:600;">${act}</span>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
          state.commProgress[act] = !state.commProgress[act];
          saveState(state);
          renderCommView();
        }
      });

      card.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        state.commProgress[act] = !state.commProgress[act];
        saveState(state);
        renderCommView();
      });

      container.appendChild(card);
    });

    document.getElementById("comm-completed-count").textContent = `${doneCount} / ${COMM_ACTIVITIES.length}`;
  }


  // 8. GYM & WORKOUT RENDER
  function renderGymView() {
    // Daily Health Checklist
    const habitsRow = document.getElementById("gym-daily-habits");
    habitsRow.innerHTML = "";
    const activeKey = toDateKey(activeDate);
    const dailyData = state.gymDailyHabits[activeKey] || {};

    GYM_DAILY_HABITS.forEach(gh => {
      const isChecked = !!dailyData[gh];
      const card = document.createElement("div");
      card.className = "gym-habit-card";
      card.innerHTML = `
        <button class="habit-check-box ${isChecked ? 'is-checked' : ''}">
          ${isChecked ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </button>
        <span style="font-weight:600;">${gh}</span>
      `;

      card.addEventListener("click", () => {
        if (!state.gymDailyHabits[activeKey]) state.gymDailyHabits[activeKey] = {};
        state.gymDailyHabits[activeKey][gh] = !state.gymDailyHabits[activeKey][gh];
        saveState(state);
        renderGymView();
      });

      habitsRow.appendChild(card);
    });

    // Categories
    const catList = document.getElementById("gym-categories-list");
    catList.innerHTML = "";
    GYM_CATEGORIES.forEach(c => {
      const b = document.createElement("div");
      b.className = "gym-cat-badge";
      b.textContent = c;
      catList.appendChild(b);
    });

    // Workout Logs
    const logsList = document.getElementById("gym-workout-logs");
    const logs = state.workoutLogs || [];
    document.getElementById("gym-session-count").textContent = `${logs.length} Sessions`;

    if (!logs.length) {
      logsList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🏋️‍♂️</div>
          <p>No workout sessions logged yet.</p>
          <span class="empty-sub">Click "+ Log Workout Session" to enter your exercises, sets, and weights.</span>
        </div>
      `;
    } else {
      logsList.innerHTML = "";
      logs.slice().reverse().forEach(log => {
        const card = document.createElement("div");
        card.className = "dsa-log-card";
        card.innerHTML = `
          <div>
            <strong style="font-size:14.5px;">${log.exercise}</strong>
            <p class="text-sub" style="font-size:12px; margin-top:2px;">Category: <strong>${log.category}</strong> | ${log.sets} sets × ${log.reps} reps ${log.weight ? '@ ' + log.weight + 'kg' : ''}</p>
            ${log.notes ? `<p class="text-muted" style="font-size:11.5px; margin-top:4px;">"${log.notes}"</p>` : ''}
          </div>
          <span class="badge-sub font-mono">${log.date}</span>
        `;
        logsList.appendChild(card);
      });
    }
  }


  // 9. PROJECT TRACKER RENDER
  function renderProjectsView() {
    const container = document.getElementById("projects-container");
    container.innerHTML = "";

    const projects = state.projects || [];

    projects.forEach(p => {
      const card = document.createElement("div");
      card.className = "project-card";

      card.innerHTML = `
        <div>
          <div class="project-head">
            <h3 class="project-title">${p.title}</h3>
            <span class="status-badge status-${p.status}">${p.status.replace('_', ' ')}</span>
          </div>
          <p class="text-sub" style="font-size:12.5px; margin-bottom:12px;">Stack: <strong>${p.tech}</strong></p>
        </div>
        <div>
          <div class="mc-progress-bar" style="margin-bottom:8px;">
            <div class="mc-fill" style="width: ${p.progress}%"></div>
          </div>
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <span class="font-mono text-muted" style="font-size:12px;">Progress: ${p.progress}%</span>
            <select class="status-select" data-proj-id="${p.id}">
              <option value="IDEA" ${p.status === "IDEA" ? "selected" : ""}>IDEA (0%)</option>
              <option value="IN_PROGRESS" ${p.status === "IN_PROGRESS" ? "selected" : ""}>IN PROGRESS</option>
              <option value="COMPLETED" ${p.status === "COMPLETED" ? "selected" : ""}>COMPLETED (100%)</option>
            </select>
          </div>
        </div>
      `;

      card.querySelector(".status-select").addEventListener("change", (e) => {
        p.status = e.target.value;
        if (p.status === "COMPLETED") p.progress = 100;
        else if (p.status === "IDEA") p.progress = 0;
        else if (p.progress === 0 || p.progress === 100) p.progress = 50;

        saveState(state);
        renderProjectsView();
        showToast(`Updated "${p.title}" status.`);
      });

      container.appendChild(card);
    });
  }


  // 10. INTERNSHIP TRACKER RENDER
  function renderInternshipsView() {
    const tbody = document.getElementById("internships-tbody");
    const apps = state.internships || [];

    if (!apps.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center" style="padding:40px;">
            <div class="empty-state">
              <div class="empty-icon">💼</div>
              <p>NO APPLICATIONS</p>
              <span class="empty-sub">Click "+ Add Application" to track your job hunt pipeline.</span>
            </div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = "";
      apps.forEach(app => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><strong>${app.company}</strong></td>
          <td>${app.role}</td>
          <td>${app.appliedDate}</td>
          <td>${app.deadline || "—"}</td>
          <td><span class="status-badge status-IN_PROGRESS">${app.status}</span></td>
          <td>${app.notes || "—"}</td>
          <td>
            <button class="btn btn-sm btn-ghost text-red delete-app-btn" data-app-id="${app.id}">Delete</button>
          </td>
        `;

        tr.querySelector(".delete-app-btn").addEventListener("click", () => {
          state.internships = state.internships.filter(x => x.id !== app.id);
          saveState(state);
          renderInternshipsView();
          showToast("Application deleted.");
        });

        tbody.appendChild(tr);
      });
    }
  }


  // 11. GOALS VIEW RENDER
  function renderGoalsView() {
    const container = document.getElementById("goals-container");
    container.innerHTML = "";

    const goals = state.goals || [];

    goals.forEach(g => {
      const pct = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;

      const card = document.createElement("div");
      card.className = "goal-card";
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h3 class="goal-title">${g.title}</h3>
          <span class="font-mono text-accent" style="font-size:13px; font-weight:700;">${pct}%</span>
        </div>
        <div class="mc-progress-bar">
          <div class="mc-fill" style="width: ${pct}%"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="text-sub font-mono" style="font-size:12px;">${g.current} / ${g.target} Completed</span>
          <button class="btn btn-sm btn-secondary inc-goal-btn" data-goal-id="${g.id}">+ Log 1 Progress</button>
        </div>
      `;

      card.querySelector(".inc-goal-btn").addEventListener("click", () => {
        g.current = Math.min(g.target, g.current + 1);
        saveState(state);
        renderGoalsView();
        showToast(`Progress updated for "${g.title}"`);
      });

      container.appendChild(card);
    });
  }


  // 12. CALENDAR VIEW RENDER
  function renderCalendarView() {
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";

    const year = activeCalDate.getFullYear();
    const month = activeCalDate.getMonth();
    document.getElementById("cal-month-label").textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Mon start
    const totalDays = daysInMonth(year, month);
    const allHabits = getAllHabits();

    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement("div");
      blank.className = "cal-day-cell";
      blank.style.opacity = "0.2";
      grid.appendChild(blank);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dKey = `${year}-${pad(month + 1)}-${pad(d)}`;
      let doneCount = 0;
      if (state.dailyCheckins[dKey]) {
        allHabits.forEach(h => {
          if (state.dailyCheckins[dKey][h.id]) doneCount++;
        });
      }

      const pct = allHabits.length ? Math.round((doneCount / allHabits.length) * 100) : 0;

      const cell = document.createElement("div");
      cell.className = "cal-day-cell";
      if (pct > 0) cell.style.borderColor = "var(--color-green)";

      cell.innerHTML = `
        <span class="cal-day-num">${d}</span>
        <span class="cal-day-pct">${pct}%</span>
      `;

      grid.appendChild(cell);
    }
  }


  // 13. STATISTICS VIEW RENDER
  function renderStatisticsView() {
    const dsaCount = state.dsaLogs.length;
    let totalHours = 0;
    Object.values(state.studyHours).forEach(h => totalHours += (parseFloat(h) || 0));

    const gymSessions = state.workoutLogs.length;
    const completedProjects = state.projects.filter(p => p.status === "COMPLETED").length;
    const appliedApps = state.internships.length;

    document.getElementById("stat-dsa-val").textContent = dsaCount;
    document.getElementById("stat-hours-val").textContent = totalHours.toFixed(1);
    document.getElementById("stat-gym-val").textContent = gymSessions;
    document.getElementById("stat-projects-val").textContent = completedProjects;
    document.getElementById("stat-internships-val").textContent = appliedApps;

    const streak = calculateStreak();
    document.getElementById("stat-habit-pct").textContent = `${streak.current} Days`;

    // Category Breakdown
    const catContainer = document.getElementById("stat-category-breakdown");
    catContainer.innerHTML = "";

    const cats = ["Coding", "Learning", "Communication", "Fitness", "Career", "Mindfulness"];
    const allHabits = getAllHabits();

    cats.forEach(c => {
      const cHabits = allHabits.filter(h => h.category === c);
      let cDone = 0;
      Object.values(state.dailyCheckins).forEach(dayObj => {
        cHabits.forEach(h => {
          if (dayObj[h.id]) cDone++;
        });
      });

      const row = document.createElement("div");
      row.className = "dev-topic-row";
      row.innerHTML = `
        <span>${c}</span>
        <span class="font-mono text-accent" style="font-weight:700;">${cDone} Total Checks</span>
      `;
      catContainer.appendChild(row);
    });

    // Insights List
    const insightsEl = document.getElementById("stat-insights-list");
    if (dsaCount === 0 && totalHours === 0 && gymSessions === 0) {
      insightsEl.innerHTML = `<div class="empty-state"><p>No data yet.</p><span class="empty-sub">Start completing your daily habits to generate personalized analytics.</span></div>`;
    } else {
      insightsEl.innerHTML = `
        <div class="panel-card" style="padding:12px;">
          <p>🔥 <strong>Current Streak:</strong> ${streak.current} consecutive active days.</p>
          <p class="mt-2">🧩 <strong>DSA Progress:</strong> ${dsaCount} algorithms solved to date.</p>
          <p class="mt-2">⏱️ <strong>Study Time:</strong> ${totalHours.toFixed(1)} total focused hours logged.</p>
        </div>
      `;
    }
  }


  // MASTER RENDER TRIGGER
  function renderAll() {
    renderHeaderStats();

    const activeView = document.querySelector(".view-panel.is-active");
    if (!activeView) return;

    const id = activeView.id;
    if (id === "view-today") renderTodayView();
    else if (id === "view-matrix") renderMatrixView();
    else if (id === "view-dsa") renderDSAView();
    else if (id === "view-dev") renderDevView();
    else if (id === "view-aiml") renderAIMLView();
    else if (id === "view-cs") renderCSView();
    else if (id === "view-comm") renderCommView();
    else if (id === "view-gym") renderGymView();
    else if (id === "view-projects") renderProjectsView();
    else if (id === "view-internships") renderInternshipsView();
    else if (id === "view-goals") renderGoalsView();
    else if (id === "view-calendar") renderCalendarView();
    else if (id === "view-statistics") renderStatisticsView();
  }


  /* ============================================================
     7. EVENT LISTENERS & NAVIGATION
     ============================================================ */

  // Navigation items
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("is-active"));
      document.querySelectorAll(".view-panel").forEach(vp => vp.classList.remove("is-active"));

      btn.classList.add("is-active");
      const targetId = `view-${btn.dataset.view}`;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("is-active");

      // On mobile, close sidebar
      document.querySelector(".sidebar").classList.remove("is-open");

      renderAll();
    });
  });

  // Mobile drawer toggle
  document.getElementById("mobile-menu-btn").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("is-open");
  });

  // Date Navigation Bar
  document.getElementById("prev-day-btn").addEventListener("click", () => {
    activeDate.setDate(activeDate.getDate() - 1);
    renderAll();
  });

  document.getElementById("next-day-btn").addEventListener("click", () => {
    activeDate.setDate(activeDate.getDate() + 1);
    renderAll();
  });

  document.getElementById("today-jump-head").addEventListener("click", () => {
    activeDate = new Date();
    renderAll();
  });

  // Category filters in Today View
  document.querySelectorAll("#habit-category-filters .pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#habit-category-filters .pill-btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedCategoryFilter = btn.dataset.cat;
      renderTodayView();
    });
  });

  // Dev filters
  document.querySelectorAll("#dev-filter-status .pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#dev-filter-status .pill-btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedDevFilter = btn.dataset.status;
      renderDevView();
    });
  });

  // Month navigation for Spreadsheet
  document.getElementById("matrix-prev-month").addEventListener("click", () => {
    activeMatrixDate.setMonth(activeMatrixDate.getMonth() - 1);
    renderMatrixView();
  });
  document.getElementById("matrix-next-month").addEventListener("click", () => {
    activeMatrixDate.setMonth(activeMatrixDate.getMonth() + 1);
    renderMatrixView();
  });

  // Month navigation for Calendar
  document.getElementById("cal-prev-month").addEventListener("click", () => {
    activeCalDate.setMonth(activeCalDate.getMonth() - 1);
    renderCalendarView();
  });
  document.getElementById("cal-next-month").addEventListener("click", () => {
    activeCalDate.setMonth(activeCalDate.getMonth() + 1);
    renderCalendarView();
  });

  // Theme Toggle
  const themeBtn = document.getElementById("theme-toggle");
  const darkSwitch = document.getElementById("settings-dark-toggle");

  function setTheme(isDark) {
    state.darkMode = isDark;
    if (isDark) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      document.getElementById("theme-text").textContent = "Dark Mode";
      if (darkSwitch) darkSwitch.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      document.getElementById("theme-text").textContent = "Light Mode";
      if (darkSwitch) darkSwitch.checked = false;
    }
    saveState(state);
  }

  themeBtn.addEventListener("click", () => setTheme(!state.darkMode));
  if (darkSwitch) darkSwitch.addEventListener("change", (e) => setTheme(e.target.checked));


  /* ============================================================
     8. MODAL FORMS & RESET CONTROLLER
     ============================================================ */

  // Modal Open/Close System
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.close;
      document.getElementById(modalId).classList.add("hidden");
    });
  });

  // 1. Log Study Hours Modal
  document.getElementById("open-study-modal").addEventListener("click", () => {
    document.getElementById("study-date-input").value = toDateKey(activeDate);
    document.getElementById("modal-study").classList.remove("hidden");
  });

  document.getElementById("form-study").addEventListener("submit", (e) => {
    e.preventDefault();
    const dKey = document.getElementById("study-date-input").value;
    const hours = parseFloat(document.getElementById("study-hours-input").value) || 0;

    state.studyHours[dKey] = (state.studyHours[dKey] || 0) + hours;
    saveState(state);
    document.getElementById("modal-study").classList.add("hidden");
    renderAll();
    showToast(`Logged ${hours} hrs of study! ⏱️`);
  });

  // 2. Add Custom Habit Modal
  document.getElementById("today-add-habit-btn").addEventListener("click", () => {
    document.getElementById("modal-habit").classList.remove("hidden");
  });

  document.getElementById("form-habit").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("habit-name-input").value.trim();
    const cat = document.getElementById("habit-category-input").value;
    const icon = document.getElementById("habit-icon-input").value.trim() || "⚡";

    const newHabit = { id: "custom_" + Date.now(), name, category: cat, icon };
    state.customHabits.push(newHabit);
    saveState(state);
    document.getElementById("modal-habit").classList.add("hidden");
    document.getElementById("form-habit").reset();
    renderAll();
    showToast(`Added custom habit "${name}"!`);
  });

  // 3. Log DSA Problem Modal
  document.getElementById("open-dsa-modal").addEventListener("click", () => {
    document.getElementById("dsa-date-input").value = toDateKey(activeDate);
    document.getElementById("modal-dsa").classList.remove("hidden");
  });

  document.getElementById("form-dsa").addEventListener("submit", (e) => {
    e.preventDefault();
    const topic = document.getElementById("dsa-topic-select").value;
    const title = document.getElementById("dsa-title-input").value.trim();
    const diff = document.getElementById("dsa-diff-select").value;
    const date = document.getElementById("dsa-date-input").value;
    const notes = document.getElementById("dsa-notes-input").value.trim();

    state.dsaLogs.push({ id: "dsa_" + Date.now(), topic, title, difficulty: diff, date, notes });
    saveState(state);
    document.getElementById("modal-dsa").classList.add("hidden");
    document.getElementById("form-dsa").reset();
    renderAll();
    showToast(`Recorded DSA problem "${title}"! 🧩`);
  });

  // 4. Log Workout Modal
  document.getElementById("open-workout-modal").addEventListener("click", () => {
    document.getElementById("modal-workout").classList.remove("hidden");
  });

  document.getElementById("form-workout").addEventListener("submit", (e) => {
    e.preventDefault();
    const cat = document.getElementById("workout-cat-select").value;
    const ex = document.getElementById("workout-ex-input").value.trim();
    const sets = parseInt(document.getElementById("workout-sets-input").value) || 1;
    const reps = parseInt(document.getElementById("workout-reps-input").value) || 1;
    const weight = parseFloat(document.getElementById("workout-weight-input").value) || 0;
    const notes = document.getElementById("workout-notes-input").value.trim();

    state.workoutLogs.push({
      id: "gym_" + Date.now(),
      date: toDateKey(activeDate),
      category: cat,
      exercise: ex,
      sets, reps, weight, notes
    });

    saveState(state);
    document.getElementById("modal-workout").classList.add("hidden");
    document.getElementById("form-workout").reset();
    renderAll();
    showToast(`Logged workout "${ex}"! 🏋️‍♂️`);
  });

  // 5. Add Internship Modal
  document.getElementById("open-internship-modal").addEventListener("click", () => {
    document.getElementById("app-date-input").value = toDateKey(activeDate);
    document.getElementById("modal-internship").classList.remove("hidden");
  });

  document.getElementById("form-internship").addEventListener("submit", (e) => {
    e.preventDefault();
    const company = document.getElementById("app-company-input").value.trim();
    const role = document.getElementById("app-role-input").value.trim();
    const appliedDate = document.getElementById("app-date-input").value;
    const deadline = document.getElementById("app-deadline-input").value;
    const status = document.getElementById("app-status-select").value;
    const notes = document.getElementById("app-notes-input").value.trim();

    state.internships.push({
      id: "app_" + Date.now(),
      company, role, appliedDate, deadline, status, notes
    });

    saveState(state);
    document.getElementById("modal-internship").classList.add("hidden");
    document.getElementById("form-internship").reset();
    renderAll();
    showToast(`Added application for ${company}! 💼`);
  });

  // 6. Add Goal Modal
  document.getElementById("open-goal-modal").addEventListener("click", () => {
    document.getElementById("modal-goal").classList.remove("hidden");
  });

  document.getElementById("form-goal").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("goal-title-input").value.trim();
    const target = parseInt(document.getElementById("goal-target-input").value) || 10;
    const current = parseInt(document.getElementById("goal-current-input").value) || 0;

    state.goals.push({ id: "goal_" + Date.now(), title, target, current });
    saveState(state);
    document.getElementById("modal-goal").classList.add("hidden");
    document.getElementById("form-goal").reset();
    renderAll();
    showToast(`Created custom goal "${title}"! 🎯`);
  });

  // 7. Add Project Modal
  document.getElementById("open-project-modal").addEventListener("click", () => {
    document.getElementById("modal-project").classList.remove("hidden");
  });

  document.getElementById("form-project").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("proj-title-input").value.trim();
    const tech = document.getElementById("proj-tech-input").value.trim();
    const status = document.getElementById("proj-status-select").value;
    const progress = parseInt(document.getElementById("proj-pct-input").value) || 0;

    state.projects.push({ id: "proj_" + Date.now(), title, tech, status, progress, isTemplate: false });
    saveState(state);
    document.getElementById("modal-project").classList.add("hidden");
    document.getElementById("form-project").reset();
    renderAll();
    showToast(`Created project "${title}"! 🚀`);
  });

  // 8. STRICT RESET SYSTEM ("RESET MY PROGRESS")
  document.getElementById("reset-progress-btn").addEventListener("click", () => {
    document.getElementById("modal-reset-confirm").classList.remove("hidden");
  });

  document.getElementById("confirm-reset-btn").addEventListener("click", () => {
    state = createInitialEmptyState();
    saveState(state);
    document.getElementById("modal-reset-confirm").classList.add("hidden");
    renderAll();
    showToast("System Reset Complete! All user data wiped to 0. Templates preserved. 🔄");
  });


  /* ============================================================
     9. INITIALIZATION
     ============================================================ */

  setTheme(state.darkMode);
  renderAll();

})();
