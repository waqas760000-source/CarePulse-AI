/**
 * CarePulse AI™ - Interactive Clinical Prototype Engine
 * Powers real-time AI Triage, ED Bed Management, Ambient Documentation & Surge Analytics
 */

// Preset clinical scenarios for rapid testing
const clinicalPresets = {
  stemi: {
    name: "Acute Coronary Syndrome (STEMI)",
    age: 58,
    gender: "Male",
    complaint: "Crushing retrosternal chest pain radiating to left jaw and shoulder, sudden onset 45 min ago.",
    pain: 9,
    hr: 104,
    bpSys: 165,
    bpDia: 98,
    spo2: 92,
    rr: 24,
    temp: 37.1,
    symptoms: ["chest_pain", "diaphoresis", "dyspnea"]
  },
  sepsis: {
    name: "Severe Sepsis Alert (UTI Origin)",
    age: 72,
    gender: "Female",
    complaint: "Severe confusion, high fever, chills, rigors, weakness, oliguria over past 24 hours.",
    pain: 6,
    hr: 122,
    bpSys: 88,
    bpDia: 54,
    spo2: 89,
    rr: 28,
    temp: 39.4,
    symptoms: ["altered_mental", "fever", "hypotension", "dyspnea"]
  },
  asthma: {
    name: "Pediatric Acute Asthma Exacerbation",
    age: 8,
    gender: "Male",
    complaint: "Severe wheezing, breathlessness, unable to speak in full sentences, inhaler ineffective.",
    pain: 5,
    hr: 135,
    bpSys: 108,
    bpDia: 68,
    spo2: 91,
    rr: 36,
    temp: 37.0,
    symptoms: ["dyspnea", "stridor"]
  },
  ankle: {
    name: "Lateral Ankle Sprain (Fast Track)",
    age: 26,
    gender: "Female",
    complaint: "Twisted right ankle playing recreational basketball, moderate lateral swelling, able to bear minimal weight.",
    pain: 4,
    hr: 74,
    bpSys: 118,
    bpDia: 76,
    spo2: 99,
    rr: 14,
    temp: 36.6,
    symptoms: ["localized_trauma"]
  }
};

// Initial ED Beds State
let edBeds = [
  { id: "RESUS-01", type: "Resuscitation", patient: "James Kowalski, 64M", condition: "STEMI in Cath Lab prep", esi: 1, hr: 112, bp: "158/96", spo2: 93, status: "critical" },
  { id: "RESUS-02", type: "Resuscitation", patient: "Elena Rostova, 71F", condition: "Septic Shock / Pressors", esi: 1, hr: 126, bp: "86/52", spo2: 90, status: "critical" },
  { id: "ACUTE-03", type: "Acute Care", patient: "Marcus Bennett, 49M", condition: "Substernal Chest Pain", esi: 2, hr: 94, bp: "142/88", spo2: 96, status: "occupied" },
  { id: "ACUTE-04", type: "Acute Care", patient: "Priya Sharma, 33F", condition: "Acute Cholecystitis", esi: 3, hr: 88, bp: "124/80", spo2: 98, status: "occupied" },
  { id: "ACUTE-05", type: "Acute Care", patient: "Unoccupied", condition: "Bed Sanitized & Ready", esi: 0, hr: "--", bp: "--", spo2: "--", status: "available" },
  { id: "TRAUMA-06", type: "Trauma Bay", patient: "David Miller, 29M", condition: "Motor Vehicle Collision", esi: 2, hr: 108, bp: "132/84", spo2: 97, status: "occupied" },
  { id: "FAST-07", type: "Fast Track", patient: "Chloe Zhang, 19F", condition: "Distal Radius Fracture", esi: 4, hr: 78, bp: "116/74", spo2: 99, status: "occupied" },
  { id: "FAST-08", type: "Fast Track", patient: "Unoccupied", condition: "Bed Sanitized & Ready", esi: 0, hr: "--", bp: "--", spo2: "--", status: "available" }
];

document.addEventListener('DOMContentLoaded', () => {
  // Prototype sub-tab switcher
  const tabBtns = document.querySelectorAll('.proto-tab-btn');
  const tabContents = document.querySelectorAll('.proto-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });

  // Preset loading
  const presetSelector = document.getElementById('presetSelect');
  if (presetSelector) {
    presetSelector.addEventListener('change', (e) => {
      const presetKey = e.target.value;
      if (clinicalPresets[presetKey]) {
        loadPreset(clinicalPresets[presetKey]);
      }
    });
  }

  // Triage Run Action
  const runTriageBtn = document.getElementById('runTriageBtn');
  if (runTriageBtn) {
    runTriageBtn.addEventListener('click', (e) => {
      e.preventDefault();
      runAITriageEngine();
    });
  }

  // Initial render of ED Bed dashboard
  renderEDBeds('all');

  // ED Bed filter buttons
  const bedFilters = document.querySelectorAll('.bed-filter-btn');
  bedFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      bedFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEDBeds(btn.getAttribute('data-filter'));
    });
  });

  // Ambient Voice Simulation
  const startAmbientBtn = document.getElementById('startAmbientBtn');
  if (startAmbientBtn) {
    startAmbientBtn.addEventListener('click', simulateAmbientVoice);
  }

  // Copy Note button
  const copyNoteBtn = document.getElementById('copyNoteBtn');
  if (copyNoteBtn) {
    copyNoteBtn.addEventListener('click', () => {
      const noteText = document.getElementById('sbarNoteContent').innerText;
      navigator.clipboard.writeText(noteText).then(() => {
        showToast("Clinical SBAR Note copied to clipboard!", "success");
      });
    });
  }

  // Surge Simulator Slider
  const surgeSlider = document.getElementById('surgeSlider');
  if (surgeSlider) {
    surgeSlider.addEventListener('input', updateSurgeForecast);
  }
});

function loadPreset(preset) {
  document.getElementById('patientAge').value = preset.age;
  document.getElementById('patientGender').value = preset.gender;
  document.getElementById('chiefComplaint').value = preset.complaint;
  document.getElementById('painScore').value = preset.pain;
  document.getElementById('painValueDisplay').innerText = preset.pain;

  document.getElementById('vitalHR').value = preset.hr;
  document.getElementById('vitalBPSys').value = preset.bpSys;
  document.getElementById('vitalBPDia').value = preset.bpDia;
  document.getElementById('vitalSpO2').value = preset.spo2;
  document.getElementById('vitalRR').value = preset.rr;
  document.getElementById('vitalTemp').value = preset.temp;

  // Uncheck all symptoms first
  document.querySelectorAll('.symptom-chk').forEach(c => c.checked = false);
  preset.symptoms.forEach(sym => {
    const el = document.getElementById('sym_' + sym);
    if (el) el.checked = true;
  });

  showToast(`Loaded preset case: ${preset.name}`, "info");
}

function runAITriageEngine() {
  const age = parseInt(document.getElementById('patientAge').value) || 40;
  const gender = document.getElementById('patientGender').value;
  const complaint = document.getElementById('chiefComplaint').value.toLowerCase();
  const pain = parseInt(document.getElementById('painScore').value) || 0;

  const hr = parseInt(document.getElementById('vitalHR').value) || 80;
  const bpSys = parseInt(document.getElementById('vitalBPSys').value) || 120;
  const bpDia = parseInt(document.getElementById('vitalBPDia').value) || 80;
  const spo2 = parseInt(document.getElementById('vitalSpO2').value) || 98;
  const rr = parseInt(document.getElementById('vitalRR').value) || 16;
  const temp = parseFloat(document.getElementById('vitalTemp').value) || 37.0;

  // Algorithmic Acuity Scoring
  const shockIndex = hr / bpSys;
  let esiScore = 3;
  let acuityLabel = "Urgent (Moderate Risk)";
  let targetWait = "30 - 45 Minutes";
  let recommendedBay = "Acute Care Bay 04";
  let diffDiagnoses = [];
  let immediateProtocols = [];

  // Check Level 1: Immediate resuscitation
  if (spo2 < 86 || bpSys < 70 || hr > 150 || hr < 40 || complaint.includes("unresponsive") || complaint.includes("cardiac arrest")) {
    esiScore = 1;
    acuityLabel = "LEVEL 1: RESUSCITATION (IMMEDIATE LIFE THREAT)";
    targetWait = "0 Minutes (Immediate Bedside Attendance)";
    recommendedBay = "Resuscitation Bay 01 (STAT Code Team)";
    immediateProtocols = [
      "Immediate airway / intubation readiness",
      "Continuous 12-lead telemetry & capnography",
      "Two large-bore 16G IV lines with warm crystalloid infusion",
      "STAT bedside echocardiogram & Arterial Blood Gas (ABG)"
    ];
    diffDiagnoses = [
      { name: "Cardiogenic / Septic Shock", prob: "94%" },
      { name: "Acute Massive Pulmonary Embolism", prob: "78%" },
      { name: "Severe Respiratory Failure", prob: "72%" }
    ];
  }
  // Check Level 2: High risk / emergent
  else if (spo2 <= 91 || bpSys < 90 || hr > 120 || rr > 26 || pain >= 8 || complaint.includes("chest pain") || complaint.includes("stroke") || complaint.includes("sepsis") || shockIndex > 0.9) {
    esiScore = 2;
    acuityLabel = "LEVEL 2: EMERGENT (HIGH RISK / SEVERE INSTABILITY)";
    targetWait = "< 10 Minutes";
    recommendedBay = "Resuscitation / Acute Cardiac Bay 02";
    immediateProtocols = [
      "STAT 12-Lead Electrocardiogram (Target < 8 minutes)",
      "Cardiac biomarker panel (High-Sensitivity Troponin I, CK-MB)",
      "High-flow nasal cannula supplemental O2 titrated to 94%",
      "Targeted IV access with blood cultures x2 prior to antibiotics"
    ];
    diffDiagnoses = [
      { name: "Acute Coronary Syndrome / NSTEMI-STEMI", prob: "89%" },
      { name: "Sepsis with Hemodynamic Hypoperfusion", prob: "84%" },
      { name: "Acute Aortic Dissection / PE", prob: "45%" }
    ];
  }
  // Check Level 4 or 5: Semi-urgent or minor
  else if (pain <= 4 && spo2 >= 97 && hr >= 60 && hr <= 95 && bpSys >= 105 && bpSys <= 135 && (complaint.includes("sprain") || complaint.includes("suture") || complaint.includes("rash") || complaint.includes("prescription"))) {
    if (complaint.includes("prescription") || complaint.includes("refill") || complaint.includes("simple rash")) {
      esiScore = 5;
      acuityLabel = "LEVEL 5: NON-URGENT (EXAMINATION ONLY)";
      targetWait = "60 - 90 Minutes (FastTrack Clinic)";
      recommendedBay = "Outpatient Triage Consultation Booth 3";
      immediateProtocols = [
        "Focused nursing assessment",
        "Medication reconciliation via EHR gateway",
        "Discharge instructions and primary care follow-up appointment"
      ];
      diffDiagnoses = [
        { name: "Routine prescription renewal / minor ailment", prob: "96%" }
      ];
    } else {
      esiScore = 4;
      acuityLabel = "LEVEL 4: SEMI-URGENT (SINGLE RESOURCE)";
      targetWait = "45 - 60 Minutes (FastTrack Care)";
      recommendedBay = "Fast Track Bay 07";
      immediateProtocols = [
        "Targeted joint / extremity 3-view digital X-Ray",
        "Ice pack & compressive elastic splinting",
        "Oral analgesia (Ibuprofen 400mg / Acetaminophen 1000mg)"
      ];
      diffDiagnoses = [
        { name: "Grade II Lateral Ankle Ligament Sprain", prob: "91%" },
        { name: "Avulsion Fracture Lateral Malleolus", prob: "28%" }
      ];
    }
  }
  // Default Level 3
  else {
    esiScore = 3;
    acuityLabel = "LEVEL 3: URGENT (MULTIPLE DIAGNOSTIC RESOURCES)";
    targetWait = "20 - 35 Minutes";
    recommendedBay = "Acute Care Bay 04";
    immediateProtocols = [
      "Complete Metabolic Panel (CMP) & Complete Blood Count (CBC)",
      "Intravenous catheter placement with baseline labs",
      "Abdominal / Pelvic Ultrasound or Non-contrast CT scan",
      "Symptom-directed anti-emetics and analgesia"
    ];
    diffDiagnoses = [
      { name: "Acute Abdominal Colic / Appendicitis", prob: "76%" },
      { name: "Complicated Pyelonephritis / Nephrolithiasis", prob: "64%" },
      { name: "Dehydrated Gastroenteritis", prob: "52%" }
    ];
  }

  // Update UI Result Card
  const resultContainer = document.getElementById('triageResultContainer');
  if (resultContainer) {
    const badgeClass = `esi-${esiScore}`;
    resultContainer.innerHTML = `
      <div class="acuity-result-card" style="border-top: 4px solid var(--${badgeClass});">
        <span class="status-badge" style="background: rgba(0, 229, 255, 0.15); color: var(--accent-cyan);">
          AI CLINICAL DECISION SUPPORT VERDICT
        </span>
        <div class="acuity-badge-huge ${badgeClass}">
          ESI LEVEL ${esiScore}
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 8px;">${acuityLabel}</h3>
        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px;">
          Calculated Shock Index: <strong style="color: #fff; font-family: var(--font-mono);">${shockIndex.toFixed(2)}</strong> | 
          Oxygenation: <strong style="color: #fff; font-family: var(--font-mono);">${spo2}%</strong> | 
          Target Bedside Wait: <strong style="color: var(--accent-teal); font-family: var(--font-mono);">${targetWait}</strong>
        </p>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 18px; text-align: left; margin-bottom: 20px;">
          <h4 style="font-size: 0.88rem; color: var(--accent-cyan); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
            AI Suggested Differential Diagnoses:
          </h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
            ${diffDiagnoses.map(d => `
              <li style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span>• ${d.name}</span>
                <span style="font-family: var(--font-mono); color: var(--accent-teal); font-weight: 700;">${d.prob} confidence</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 18px; text-align: left; margin-bottom: 24px;">
          <h4 style="font-size: 0.88rem; color: var(--accent-teal); text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px;">
            Recommended Immediate Action Protocol:
          </h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
            ${immediateProtocols.map(p => `
              <li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;">
                <span style="color: var(--accent-cyan); font-weight: bold;">✔</span> ${p}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="autoAssignPatientToBed('${escapeString(complaint)}', ${esiScore}, ${hr}, '${bpSys}/${bpDia}', ${spo2})">
            🏥 Assign to Recommended Bed (${recommendedBay})
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Electronic Medical Record (FHIR) packet transmitted to Attending Physician', 'success')">
            📡 Transmit to EHR Gateway
          </button>
        </div>
      </div>
    `;

    showToast(`AI Triage evaluated: ESI Level ${esiScore}`, "success");
  }
}

function escapeString(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function autoAssignPatientToBed(complaint, esi, hr, bp, spo2) {
  // Find an available bed or displace
  let targetBed = edBeds.find(b => b.status === "available");
  if (!targetBed) {
    targetBed = edBeds[edBeds.length - 1];
  }

  targetBed.patient = "Incoming Patient (" + (complaint.length > 25 ? complaint.substring(0, 25) + '...' : complaint) + ")";
  targetBed.condition = complaint;
  targetBed.esi = esi;
  targetBed.hr = hr;
  targetBed.bp = bp;
  targetBed.spo2 = spo2;
  targetBed.status = esi <= 2 ? "critical" : "occupied";

  renderEDBeds('all');
  showToast(`Patient admitted and synchronized to Bed ${targetBed.id}`, "success");

  // Switch tab to Bed dashboard
  const bedTabBtn = document.querySelector('[data-tab="tab-beds"]');
  if (bedTabBtn) bedTabBtn.click();
}

function renderEDBeds(filter = 'all') {
  const grid = document.getElementById('edBedsGrid');
  if (!grid) return;

  const filtered = edBeds.filter(bed => {
    if (filter === 'all') return true;
    if (filter === 'critical') return bed.status === 'critical';
    if (filter === 'occupied') return bed.status === 'occupied' || bed.status === 'critical';
    if (filter === 'available') return bed.status === 'available';
    return true;
  });

  const esiColors = {
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'green',
    5: 'blue',
    0: 'gray'
  };

  grid.innerHTML = filtered.map(bed => `
    <div class="ed-bed-card ${bed.status}">
      <div class="bed-header">
        <span class="bed-number">${bed.id}</span>
        <span class="bed-status-pill ${esiColors[bed.esi]}">
          ${bed.esi > 0 ? `ESI-${bed.esi}` : 'VACANT'}
        </span>
      </div>
      <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">
        ${bed.type}
      </div>
      <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
        ${bed.patient}
      </div>
      <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 12px; height: 36px; overflow: hidden;">
        ${bed.condition}
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; text-align: center; margin-bottom: 14px; font-family: var(--font-mono); font-size: 0.78rem;">
        <div>
          <span style="display:block; color: var(--text-muted); font-size: 0.68rem;">HR</span>
          <span style="color: ${bed.hr > 110 ? 'var(--esi-1)' : '#fff'}; font-weight: bold;">${bed.hr}</span>
        </div>
        <div>
          <span style="display:block; color: var(--text-muted); font-size: 0.68rem;">BP</span>
          <span style="color: #fff; font-weight: bold;">${bed.bp}</span>
        </div>
        <div>
          <span style="display:block; color: var(--text-muted); font-size: 0.68rem;">SpO2</span>
          <span style="color: ${bed.spo2 !== '--' && bed.spo2 < 93 ? 'var(--esi-1)' : 'var(--accent-teal)'}; font-weight: bold;">${bed.spo2 !== '--' ? bed.spo2 + '%' : '--'}</span>
        </div>
      </div>

      <div style="display: flex; gap: 6px;">
        ${bed.status !== 'available' ? `
          <button class="btn btn-secondary btn-sm" style="flex: 1; padding: 6px; font-size: 0.72rem;" onclick="dischargeBed('${bed.id}')">
            Discharge
          </button>
          <button class="btn btn-secondary btn-sm" style="flex: 1; padding: 6px; font-size: 0.72rem;" onclick="transferBed('${bed.id}')">
            ICU Transfer
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" style="width: 100%; padding: 6px; font-size: 0.75rem;" onclick="assignVacantBed('${bed.id}')">
            + Quick Assign
          </button>
        `}
      </div>
    </div>
  `).join('');
}

function dischargeBed(bedId) {
  const bed = edBeds.find(b => b.id === bedId);
  if (bed) {
    bed.patient = "Unoccupied";
    bed.condition = "Bed Sanitized & Ready";
    bed.esi = 0;
    bed.hr = "--";
    bed.bp = "--";
    bed.spo2 = "--";
    bed.status = "available";
    renderEDBeds('all');
    showToast(`Bed ${bedId} discharged and marked sanitized.`, "info");
  }
}

function transferBed(bedId) {
  showToast(`Bed ${bedId} patient pre-registered for Step-Down ICU telemetry ward.`, "success");
}

function assignVacantBed(bedId) {
  const bed = edBeds.find(b => b.id === bedId);
  if (bed) {
    bed.patient = "Walk-in Walk-Through Patient";
    bed.condition = "Severe Migraine & Light Sensitivity";
    bed.esi = 3;
    bed.hr = 84;
    bed.bp = "128/82";
    bed.spo2 = 98;
    bed.status = "occupied";
    renderEDBeds('all');
    showToast(`Assigned new patient to Bed ${bedId}.`, "success");
  }
}

// Ambient Clinical Audio SBAR Simulator
function simulateAmbientVoice() {
  const btn = document.getElementById('startAmbientBtn');
  const wave = document.getElementById('voiceWaveform');
  const transcript = document.getElementById('ambientTranscript');
  const sbarBox = document.getElementById('sbarNoteContainer');

  btn.disabled = true;
  btn.innerHTML = `<span>🎙️ AI Listening & Transcribing...</span>`;
  wave.style.display = 'flex';
  transcript.innerHTML = `<em>Capturing ambient doctor-patient acoustic stream...</em>`;

  const conversationSteps = [
    "<strong>Dr. Vance:</strong> Good morning Mrs. Henderson. Can you tell me what brought you into the ER today?",
    "<strong>Patient:</strong> Doctor, about two hours ago I had sudden pain in my upper right belly. It feels sharp and moves around into my back, and I threw up twice.",
    "<strong>Dr. Vance:</strong> Any fevers or yellowing in your eyes? Have you eaten anything fatty recently?",
    "<strong>Patient:</strong> Yes, we had fried fish for dinner last night, and I had mild fever and chills this morning.",
    "<strong>Dr. Vance:</strong> Okay, let's feel your abdomen. Take a deep breath in... (Patient groans in pain at right upper quadrant). Positive Murphy sign noted."
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    if (stepIdx < conversationSteps.length) {
      transcript.innerHTML += `<p style="margin-top: 6px; font-size: 0.88rem; color: #cbd5e1;">${conversationSteps[stepIdx]}</p>`;
      stepIdx++;
    } else {
      clearInterval(interval);
      wave.style.display = 'none';
      btn.disabled = false;
      btn.innerHTML = `<span>🎙️ Simulate Ambient Physician-Patient Audio</span>`;

      // Render SBAR
      sbarBox.style.display = 'block';
      document.getElementById('sbarNoteContent').innerHTML = `
<strong>S - SITUATION:</strong>
62-year-old female presenting to Emergency Department with acute postprandial right upper quadrant abdominal pain radiating to infrascapular back, associated with nausea and emesis x2.

<strong>B - BACKGROUND:</strong>
Onset 2 hours post-fatty meal. Medical history significant for hyperlipidemia and mild hypertension. No prior cholecystectomy.

<strong>A - ASSESSMENT:</strong>
Acuity: ESI Level 3. Physical exam remarkable for focal tenderness in RUQ with inspiration arrest on palpation (Positive Murphy's Sign). Elevated suspicion for Acute Calculous Cholecystitis vs. Choledocholithiasis. Vital signs stable, afebrile at bedside.

<strong>R - RECOMMENDATION:</strong>
1. STAT Right Upper Quadrant Abdominal Ultrasound.
2. Complete Blood Count (CBC) with differential, Comprehensive Metabolic Panel (CMP) including LFTs, Amylase, Lipase.
3. Keep patient NPO (nothing by mouth).
4. IV access: 1000mL Normal Saline at 125 mL/hr, IV Ketorolac 15mg for analgesia, Ondansetron 4mg IV PRN.
5. Surgical consult on standby pending ultrasound imaging.
      `;
      showToast("Ambient dialogue converted into standardized SBAR documentation!", "success");
    }
  }, 900);
}

// Surge Capacity Simulator
function updateSurgeForecast() {
  const surgeVal = parseInt(document.getElementById('surgeSlider').value);
  document.getElementById('surgeDisplayVal').innerText = `+${surgeVal}% Community Influx`;

  const baseBedsOccupied = 65;
  const newOccupancy = Math.min(100, Math.round(baseBedsOccupied + (surgeVal * 0.35)));
  const waitMinutes = Math.round(18 + (surgeVal * 0.45));
  const diversionRisk = surgeVal > 70 ? "HIGH (Ambulance Mutual Aid Active)" : (surgeVal > 35 ? "MODERATE (FastTrack Expanded)" : "NORMAL");

  document.getElementById('metricOccupancy').innerText = `${newOccupancy}%`;
  document.getElementById('metricWait').innerText = `${waitMinutes}m`;
  document.getElementById('metricDiversion').innerText = diversionRisk;

  const bar = document.getElementById('occupancyBar');
  if (bar) {
    bar.style.width = `${newOccupancy}%`;
    bar.style.backgroundColor = newOccupancy > 90 ? 'var(--esi-1)' : (newOccupancy > 75 ? 'var(--esi-2)' : 'var(--accent-teal)');
  }
}
