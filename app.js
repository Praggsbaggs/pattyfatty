/* ============================================================
   PATTYFATTY — App Logic
   One daily interaction. That's it.
   ============================================================ */

;(function () {
  'use strict'

  // ── DOM refs ──────────────────────────────────────────────
  const $ = (s, p = document) => p.querySelector(s)
  const $$ = (s, p = document) => [...p.querySelectorAll(s)]

  const screenMain     = $('#screen-main')
  const screenResponse = $('#screen-response')
  const responseContent= $('#response-content')
  const greetingTime   = $('#greeting-time')
  const streakCount    = $('#streak-count')
  const btnBack        = $('#btn-back')
  const btnScan        = $('#btn-scan')
  const btnHistory     = $('#btn-history')
  const scanModal      = $('#scan-modal')
  const scanOverlay    = $('#scan-overlay')
  const scanInput      = $('#scan-input')
  const scanResult     = $('#scan-result')
  const scanLoading    = $('#scan-loading')
  const historyModal   = $('#history-modal')
  const historyOverlay = $('#history-overlay')
  const historyList    = $('#history-list')
  const doctorToast    = $('#doctor-toast')
  const doctorDismiss  = $('#doctor-dismiss')
  const feelingCards   = $$('.feeling-card')

  // ── RESPONSE DATA ─────────────────────────────────────────
  const RESPONSES = {
    skipped: {
      emoji: '🍽️',
      title: 'Skipped a meal?',
      message: 'Long gaps between meals can spike hunger hormones and lead to binge eating later. Your body needs steady fuel — even something small helps.',
      eat: [
        { icon: '🍎', label: 'Fruit + handful of nuts' },
        { icon: '🥛', label: 'A bowl of curd' },
        { icon: '🥪', label: 'Light sandwich' },
        { icon: '🍌', label: 'Banana with peanut butter' }
      ],
      avoid: [
        { icon: '🍕', label: 'Heavy fast food' },
        { icon: '🍩', label: 'Sugary snacks' },
        { icon: '☕', label: 'Coffee on empty stomach' }
      ],
      tip: 'Set a gentle alarm for your next meal. Your body works best with consistent timing.',
      reminder: 'Try to eat within 30 minutes of waking up tomorrow. Even a banana counts.'
    },

    late: {
      emoji: '⏰',
      title: 'Eating late tonight?',
      message: 'Late meals make digestion sluggish and can disrupt your sleep. Keep it light — your stomach will thank you in the morning.',
      eat: [
        { icon: '🥣', label: 'Warm soup or dal' },
        { icon: '🍚', label: 'Small portion of khichdi' },
        { icon: '🥗', label: 'Light salad' },
        { icon: '🍵', label: 'Warm milk with turmeric' }
      ],
      avoid: [
        { icon: '🍔', label: 'Fried or greasy food' },
        { icon: '🍰', label: 'Heavy desserts' },
        { icon: '🥤', label: 'Cold or carbonated drinks' }
      ],
      tip: 'Try to finish eating 2–3 hours before bedtime. A 10-minute walk after dinner works wonders.',
      reminder: 'Tomorrow, set a dinner alarm for 7:30 PM. Consistency beats perfection.'
    },

    junk: {
      emoji: '🍔',
      title: 'Craving junk food?',
      message: 'Drink a full glass of water first and wait 10 minutes. Most cravings are actually thirst or boredom in disguise. Try a lighter snack instead.',
      eat: [
        { icon: '🫘', label: 'Roasted chana' },
        { icon: '🌰', label: 'Makhana (fox nuts)' },
        { icon: '🥜', label: 'Peanuts or trail mix' },
        { icon: '🍿', label: 'Plain popcorn' }
      ],
      avoid: [
        { icon: '🍟', label: 'Chips & fries' },
        { icon: '🍫', label: 'Processed chocolate' },
        { icon: '🥤', label: 'Sugary drinks' }
      ],
      tip: 'Cravings usually pass in 15 minutes. Distract yourself with a quick walk or a glass of water.',
      reminder: 'Keep healthy snacks within reach so junk food isn\'t your first option.'
    },

    overate: {
      emoji: '😫',
      title: 'Ate too much?',
      message: 'Don\'t stress — it happens to everyone. Skip the guilt. Focus on helping your body digest what you\'ve eaten.',
      eat: [
        { icon: '🍵', label: 'Warm herbal tea' },
        { icon: '🫚', label: 'Ginger water' },
        { icon: '🍋', label: 'Warm lemon water' }
      ],
      avoid: [
        { icon: '🛌', label: 'Lying down immediately' },
        { icon: '🍰', label: 'More food or dessert' },
        { icon: '🥤', label: 'Cold beverages' }
      ],
      tip: 'Take a slow 15-minute walk. It helps your stomach without overloading your body.',
      reminder: 'Next meal, try using a smaller plate. It naturally portions your food.'
    },

    bloated: {
      emoji: '🫧',
      title: 'Feeling bloated?',
      message: 'Bloating is usually caused by gas, water retention, or eating too fast. Warm fluids and gentle movement can provide relief.',
      eat: [
        { icon: '🫚', label: 'Ginger or ajwain water' },
        { icon: '🍵', label: 'Peppermint tea' },
        { icon: '🥒', label: 'Cucumber slices' },
        { icon: '🍌', label: 'Banana' }
      ],
      avoid: [
        { icon: '🥛', label: 'Dairy products' },
        { icon: '🫘', label: 'Raw beans or lentils' },
        { icon: '🥤', label: 'Carbonated drinks' },
        { icon: '🧂', label: 'Salty snacks' }
      ],
      tip: 'Eat slowly and chew your food well. It reduces the air you swallow and helps digestion.',
      reminder: 'If bloating happens often after meals, try keeping a food diary to spot triggers.'
    },

    constipated: {
      emoji: '😣',
      title: 'Constipated?',
      message: 'Increase fiber intake and warm fluids today. Your gut needs hydration and movement to get back on track.',
      eat: [
        { icon: '💧', label: 'Warm water (lots of it)' },
        { icon: '🍎', label: 'Fruits — papaya, guava, prunes' },
        { icon: '🥣', label: 'Oats or daliya' },
        { icon: '🥗', label: 'Raw salad with olive oil' }
      ],
      avoid: [
        { icon: '🍞', label: 'White bread / maida' },
        { icon: '🧀', label: 'Cheese & heavy dairy' },
        { icon: '🍫', label: 'Processed food' },
        { icon: '☕', label: 'Too much caffeine' }
      ],
      tip: 'A glass of warm water with lemon first thing in the morning can kickstart your digestion.',
      reminder: 'Try to move your body for at least 20 minutes today. Walking helps more than you think.'
    },

    'low-energy': {
      emoji: '🔋',
      title: 'Feeling low on energy?',
      message: 'Low energy often comes from skipping meals, dehydration, or poor sleep. Start with water and a balanced bite.',
      eat: [
        { icon: '🍌', label: 'Banana + handful of almonds' },
        { icon: '🥚', label: 'Boiled egg or paneer' },
        { icon: '🍫', label: 'Dark chocolate (small piece)' },
        { icon: '💧', label: 'A tall glass of water' }
      ],
      avoid: [
        { icon: '☕', label: 'Excessive caffeine' },
        { icon: '🍬', label: 'Sugar-heavy energy drinks' },
        { icon: '🍟', label: 'Fried / heavy food' }
      ],
      tip: 'Dehydration is the #1 cause of afternoon fatigue. Drink water before reaching for coffee.',
      reminder: 'Aim for 7–8 hours of sleep tonight. Energy starts the night before.'
    },

    fine: {
      emoji: '✨',
      title: 'You\'re feeling great!',
      message: 'That\'s wonderful! Keep doing what you\'re doing. Consistency in eating well and on time is what got you here.',
      eat: [
        { icon: '🥗', label: 'Keep eating balanced meals' },
        { icon: '💧', label: 'Stay hydrated' },
        { icon: '🍎', label: 'Snack on fruits if hungry' }
      ],
      avoid: [],
      tip: 'A feeling-fine day is the perfect day to prep healthy snacks for the week ahead.',
      reminder: 'Keep this streak going! Your body notices the consistency even when you don\'t.'
    }
  }

  // ── EMOJI MAP for history ─────────────────────────────────
  const FEELING_EMOJI = {
    skipped: '🍽️', late: '⏰', junk: '🍔', overate: '😫',
    bloated: '🫧', constipated: '😣', 'low-energy': '🔋', fine: '✨'
  }
  const FEELING_LABEL = {
    skipped: 'Skipped a meal', late: 'Eating late', junk: 'Craving junk',
    overate: 'Ate too much', bloated: 'Bloated', constipated: 'Constipated',
    'low-energy': 'Low energy', fine: 'Feeling fine'
  }

  // ── STORAGE HELPERS ───────────────────────────────────────
  const STORAGE_KEY = 'pattyfatty_logs'
  const STREAK_KEY  = 'pattyfatty_streak'

  function getLogs () {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
    catch { return [] }
  }

  function saveLog (feeling) {
    const logs = getLogs()
    logs.unshift({ feeling, timestamp: Date.now() })
    // Keep last 60 entries
    if (logs.length > 60) logs.length = 60
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
    updateStreak()
    checkDoctorWarning(logs)
  }

  function updateStreak () {
    const logs = getLogs()
    if (!logs.length) { streakCount.textContent = '0 day streak'; return }

    let streak = 1
    const days = [...new Set(logs.map(l => new Date(l.timestamp).toDateString()))]
    const today = new Date().toDateString()

    if (days[0] !== today) { streakCount.textContent = '0 day streak'; return }

    for (let i = 1; i < days.length; i++) {
      const d1 = new Date(days[i - 1])
      const d2 = new Date(days[i])
      const diff = (d1 - d2) / (1000 * 60 * 60 * 24)
      if (Math.round(diff) === 1) streak++
      else break
    }

    streakCount.textContent = `${streak} day streak`
  }

  // ── DOCTOR WARNING ────────────────────────────────────────
  const DOCTOR_FEELINGS = ['constipated', 'bloated']
  const DOCTOR_THRESHOLD = 3 // 3 times in 7 days

  function checkDoctorWarning (logs) {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recent = logs.filter(l => l.timestamp > weekAgo)
    const count = recent.filter(l => DOCTOR_FEELINGS.includes(l.feeling)).length

    if (count >= DOCTOR_THRESHOLD) {
      setTimeout(() => doctorToast.classList.add('doctor-toast--show'), 1200)
    }
  }

  // ── GREETING TIME ─────────────────────────────────────────
  function setGreeting () {
    const h = new Date().getHours()
    if (h < 12) greetingTime.textContent = 'Good morning ☀️'
    else if (h < 17) greetingTime.textContent = 'Good afternoon 🌤️'
    else if (h < 21) greetingTime.textContent = 'Good evening 🌇'
    else greetingTime.textContent = 'Late night 🌙'
  }

  // ── RENDER RESPONSE ───────────────────────────────────────
  function showResponse (feeling) {
    const data = RESPONSES[feeling]
    if (!data) return

    saveLog(feeling)

    let html = `
      <div class="response-card">
        <div class="response-header">
          <span class="response-header__emoji">${data.emoji}</span>
          <h2 class="response-header__title">${data.title}</h2>
        </div>
        <div class="response-message">${data.message}</div>

        <p class="response-section-title">🍽️ What to eat now</p>
        <div class="suggestion-chips">
          ${data.eat.map(s => `<span class="suggestion-chip chip--eat">${s.icon} ${s.label}</span>`).join('')}
        </div>
    `

    if (data.avoid.length) {
      html += `
        <p class="response-section-title">🚫 What to avoid</p>
        <div class="suggestion-chips">
          ${data.avoid.map(s => `<span class="suggestion-chip chip--avoid">${s.icon} ${s.label}</span>`).join('')}
        </div>
      `
    }

    html += `
        <div class="tip-card">
          <span class="tip-card__icon">💡</span>
          <p class="tip-card__text">${data.tip}</p>
        </div>

        <div class="reminder-card">
          <span class="reminder-card__icon">⏰</span>
          <p class="reminder-card__text">${data.reminder}</p>
        </div>
      </div>

      <div class="logged-badge">✅ Logged for today</div>
    `

    responseContent.innerHTML = html
    screenMain.classList.remove('screen--active')
    screenResponse.classList.add('screen--active')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function showMain () {
    screenResponse.classList.remove('screen--active')
    screenMain.classList.remove('screen--active')
    // Force reflow for animation
    void screenMain.offsetWidth
    screenMain.classList.add('screen--active')
  }

  // ── SCAN FEATURE ──────────────────────────────────────────
  // Simulated analysis (in production, this connects to Google ML Kit / Vision API)
  function analyzeFoodLabel () {
    scanResult.style.display = 'none'
    scanLoading.style.display = 'flex'

    setTimeout(() => {
      scanLoading.style.display = 'none'

      // Simulated results for demo (in production: OCR + Gemini analysis)
      const results = [
        { label: '⚠️ High Sugar', type: 'warn', detail: '22g sugar per serving' },
        { label: '⚠️ High Sodium', type: 'warn', detail: '480mg sodium' },
        { label: '🚫 Processed', type: 'danger', detail: 'Contains artificial preservatives' },
        { label: '✅ Good Fiber', type: 'ok', detail: '4g dietary fiber' }
      ]

      // Randomly pick 2-3 results for variety
      const shuffled = results.sort(() => Math.random() - 0.5)
      const picked = shuffled.slice(0, 2 + Math.floor(Math.random() * 2))

      let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">'
      picked.forEach(r => {
        html += `<span class="scan-badge scan-badge--${r.type}">${r.label}</span>`
      })
      html += '</div>'

      const hasDanger = picked.some(r => r.type === 'danger' || r.type === 'warn')
      html += `<p class="scan-verdict">${
        hasDanger
          ? '🟡 <strong>Eat occasionally.</strong> This product has some ingredients you should be mindful of. Check the label for serving size.'
          : '🟢 <strong>Looks reasonable.</strong> Moderate consumption should be fine. Stay mindful of portion sizes.'
      }</p>`

      // Details
      html += '<div style="margin-top:12px;">'
      picked.forEach(r => {
        html += `<p style="font-size:0.78rem;color:var(--text-muted);margin:4px 0;">• ${r.detail}</p>`
      })
      html += '</div>'

      scanResult.innerHTML = html
      scanResult.style.display = 'block'
    }, 1800)
  }

  // ── HISTORY ───────────────────────────────────────────────
  function renderHistory () {
    const logs = getLogs()
    if (!logs.length) {
      historyList.innerHTML = '<p class="history-empty">No check-ins yet. How are you feeling today?</p>'
      return
    }

    const html = logs.slice(0, 15).map(l => {
      const date = new Date(l.timestamp)
      const timeStr = date.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short'
      }) + ' · ' + date.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      })

      return `
        <div class="history-item">
          <span class="history-item__emoji">${FEELING_EMOJI[l.feeling] || '❓'}</span>
          <div class="history-item__info">
            <p class="history-item__feeling">${FEELING_LABEL[l.feeling] || l.feeling}</p>
            <p class="history-item__time">${timeStr}</p>
          </div>
        </div>
      `
    }).join('')

    historyList.innerHTML = html
  }

  // ── MODAL HELPERS ─────────────────────────────────────────
  function openModal (modal) { modal.classList.add('modal--open') }
  function closeModal (modal) { modal.classList.remove('modal--open') }

  // ── EVENT LISTENERS ───────────────────────────────────────

  // Feeling cards
  feelingCards.forEach(card => {
    card.addEventListener('click', () => {
      const feeling = card.dataset.feeling
      if (feeling) showResponse(feeling)
    })
  })

  // Back button
  btnBack.addEventListener('click', showMain)

  // Scan
  btnScan.addEventListener('click', () => {
    scanResult.style.display = 'none'
    scanLoading.style.display = 'none'
    openModal(scanModal)
  })
  scanOverlay.addEventListener('click', () => closeModal(scanModal))

  scanInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      analyzeFoodLabel()
    }
  })

  // History
  btnHistory.addEventListener('click', () => {
    renderHistory()
    openModal(historyModal)
  })
  historyOverlay.addEventListener('click', () => closeModal(historyModal))

  // Doctor dismiss
  doctorDismiss.addEventListener('click', () => {
    doctorToast.classList.remove('doctor-toast--show')
  })

  // Keyboard nav — Escape to close modals / go back
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (scanModal.classList.contains('modal--open')) closeModal(scanModal)
      else if (historyModal.classList.contains('modal--open')) closeModal(historyModal)
      else if (screenResponse.classList.contains('screen--active')) showMain()
    }
  })

  // ── INIT ──────────────────────────────────────────────────
  setGreeting()
  updateStreak()

  // Check doctor warning on load
  checkDoctorWarning(getLogs())

})()
