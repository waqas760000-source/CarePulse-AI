/**
 * CarePulse AI™ - Marketing & ROI Calculator Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const bedsInput = document.getElementById('calcBeds');
  const visitsInput = document.getElementById('calcVisits');
  const waitInput = document.getElementById('calcWait');

  const bedsVal = document.getElementById('calcBedsVal');
  const visitsVal = document.getElementById('calcVisitsVal');
  const waitVal = document.getElementById('calcWaitVal');

  function calculateROI() {
    if (!bedsInput || !visitsInput || !waitInput) return;

    const beds = parseInt(bedsInput.value);
    const visits = parseInt(visitsInput.value);
    const wait = parseInt(waitInput.value);

    bedsVal.innerText = `${beds} Beds`;
    visitsVal.innerText = `${visits.toLocaleString()} Patients / yr`;
    waitVal.innerText = `${wait} Minutes`;

    // Calculation formulas based on healthcare benchmarks
    // Average LWBS rate is ~3.5% when wait > 60m. CarePulse AI reduces LWBS by 68%.
    const baselineLWBS = visits * 0.038;
    const preventedLWBS = Math.round(baselineLWBS * 0.65);
    const revenueRecoveredLWBS = preventedLWBS * 1350; // $1,350 avg emergency facility fee

    // Clinician overtime saved: approx 0.08 hours saved per patient visit
    const nursingHoursSaved = Math.round(visits * 0.075);
    const laborSavings = nursingHoursSaved * 68; // $68 blended nurse/MD hourly rate

    // Length of stay bed turnaround savings: $220 saved per bed turnover reduction
    const bedTurnoverSavings = Math.round(visits * 0.45 * 85);

    const totalAnnualImpact = revenueRecoveredLWBS + laborSavings + bedTurnoverSavings;

    // Estimated software enterprise license for this tier
    const licenseCost = Math.round(75000 + (beds * 1200));
    const netReturn = totalAnnualImpact - licenseCost;
    const roiPercentage = Math.round((netReturn / licenseCost) * 100);
    const paybackMonths = ((licenseCost / totalAnnualImpact) * 12).toFixed(1);

    document.getElementById('resLwbs').innerText = preventedLWBS.toLocaleString();
    document.getElementById('resRevenue').innerText = `$${(revenueRecoveredLWBS / 1000000).toFixed(2)}M`;
    document.getElementById('resHours').innerText = `${nursingHoursSaved.toLocaleString()} hrs`;
    document.getElementById('resTotal').innerText = `$${(totalAnnualImpact / 1000000).toFixed(2)}M`;
    document.getElementById('resRoi').innerText = `${roiPercentage}%`;
    document.getElementById('resPayback').innerText = `${paybackMonths} Months`;
  }

  if (bedsInput && visitsInput && waitInput) {
    bedsInput.addEventListener('input', calculateROI);
    visitsInput.addEventListener('input', calculateROI);
    waitInput.addEventListener('input', calculateROI);
    calculateROI();
  }

  // Pricing Billing Toggle (Monthly / Annual)
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      const isAnnual = e.target.checked;
      const prices = {
        clinic: isAnnual ? '$3,200' : '$3,900',
        hospital: isAnnual ? '$7,900' : '$9,500',
        enterprise: isAnnual ? '$15,800' : '$18,900'
      };

      document.getElementById('priceClinic').innerHTML = `${prices.clinic} <span>/ month</span>`;
      document.getElementById('priceHospital').innerHTML = `${prices.hospital} <span>/ month</span>`;
      document.getElementById('priceEnterprise').innerHTML = `${prices.enterprise} <span>/ month</span>`;

      const discountLabel = document.getElementById('discountBadge');
      if (discountLabel) {
        discountLabel.style.opacity = isAnnual ? '1' : '0.4';
      }
    });
  }
});
