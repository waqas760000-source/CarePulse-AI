/**
 * CarePulse AI™ - Global Interaction Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const currentlyOpen = document.querySelector('.faq-item.open');
        if (currentlyOpen && currentlyOpen !== item) {
          currentlyOpen.classList.remove('open');
        }
        item.classList.toggle('open');
      });
    }
  });

  // Modal Triggers
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('open');
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('open');
    });
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });

  // Pulse Heartbeat Ticker Randomizer for Live Feel
  const liveTickerContainer = document.getElementById('liveTicker');
  if (liveTickerContainer) {
    const events = [
      "Ambulance Unit 402 en route to St. Jude — Inbound Acute Stroke ETA 6m — Resus Bay 1 pre-allocated",
      "ICU Bed 14 sanitized & available — Turnaround completed in 18 minutes (System target: < 25m)",
      "Metro General ED Census: 84% Capacity — Diversion Risk: LOW — 4 Patients auto-routed to Fast Track",
      "Sepsis Early Warning Alert triggered for Bed 06 — Clinician notified, blood cultures queued",
      "CarePulse AI Triage Engine v3.8 Active — 1,420 Active Patient Monitoring Streams across 14 Regional Nodes",
      "EMS Telemetry Synced with City North Regional — SpO2: 91%, BP: 154/95 — AI Priority Acuity: ESI-2"
    ];

    let currentEventIdx = 0;
    setInterval(() => {
      const tickerPill = document.querySelector('.ticker-dynamic-event');
      if (tickerPill) {
        currentEventIdx = (currentEventIdx + 1) % events.length;
        tickerPill.style.opacity = '0';
        setTimeout(() => {
          tickerPill.textContent = events[currentEventIdx];
          tickerPill.style.opacity = '1';
        }, 300);
      }
    }, 7000);
  }
});

// Toast notification utility
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const colors = {
    info: 'border: 1px solid rgba(0, 229, 255, 0.4); background: rgba(13, 20, 36, 0.95); color: #00e5ff;',
    success: 'border: 1px solid rgba(0, 242, 169, 0.4); background: rgba(13, 20, 36, 0.95); color: #00f2a9;',
    warning: 'border: 1px solid rgba(255, 123, 0, 0.4); background: rgba(13, 20, 36, 0.95); color: #ff7b00;',
    error: 'border: 1px solid rgba(255, 42, 85, 0.4); background: rgba(13, 20, 36, 0.95); color: #ff2a55;'
  };

  toast.style.cssText = `
    padding: 14px 22px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    font-size: 0.9rem;
    font-weight: 600;
    backdrop-filter: blur(12px);
    pointer-events: auto;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(12px);
    ${colors[type] || colors.info}
  `;
  toast.innerHTML = `<span>⚡ ${message}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
