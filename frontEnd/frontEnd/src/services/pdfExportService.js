// src/services/pdfExportService.js

/**
 * Generates and triggers download of a formatted PDF/Printable Health Dossier for a specific member.
 * 
 * @param {Object} memberData - Member details, vitals, notes, and medicines
 */
export const generateMemberHealthPDF = (memberData) => {
  const { member, latestMetric, medicines, reportDate } = memberData;

  const memberName = member?.name || "Family Member";
  const mobileNumber = member?.mobileNumber || member?.phone || "N/A";
  const familyId = member?.familyId || "N/A";
  const role = member?.role || "MEMBER";

  // Vitals
  const bp = latestMetric?.systolicBp && latestMetric?.diastolicBp 
    ? `${latestMetric.systolicBp}/${latestMetric.diastolicBp} mmHg` 
    : "120/80 mmHg (Default)";

  const sugar = latestMetric?.bloodSugar 
    ? `${latestMetric.bloodSugar} mg/dL` 
    : "95 mg/dL (Default)";

  const heartRate = latestMetric?.heartRate 
    ? `${latestMetric.heartRate} BPM` 
    : "72 BPM (Default)";

  const oxygen = latestMetric?.oxygenSaturation 
    ? `${latestMetric.oxygenSaturation}%` 
    : "98% (Default)";

  const temp = latestMetric?.temperature 
    ? `${latestMetric.temperature} °F` 
    : "98.6 °F (Default)";

  const weight = latestMetric?.weight 
    ? `${latestMetric.weight} kg` 
    : "70 kg (Default)";

  const height = latestMetric?.height 
    ? `${latestMetric.height} cm` 
    : "170 cm (Default)";

  const notes = latestMetric?.notes || "No additional clinical notes recorded.";

  // Medicines List HTML
  let medRowsHtml = "";
  if (Array.isArray(medicines) && medicines.length > 0) {
    medRowsHtml = medicines.map((med, idx) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${idx + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0f172a;">${med.medicineName || med.name || 'Prescription Medicine'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${med.strength || med.dosage || 'Standard'} • ${med.dosageForm || 'Tablet'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${med.frequency || 'Daily'} (${med.instructions || 'As advised'})</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">ACTIVE</span></td>
      </tr>
    `).join("");
  } else {
    medRowsHtml = `
      <tr>
        <td colspan="5" style="padding: 16px; text-align: center; color: #64748b; font-style: italic;">
          No active medication schedules recorded for this member.
        </td>
      </tr>
    `;
  }

  // Complete HTML document template formatted for PDF export
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>CareCircle Health Report - ${memberName}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; margin: 0; padding: 20px; background: #ffffff; }
        .header-bar { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
        .brand-title { font-size: 24px; font-weight: 800; color: #2563eb; margin: 0; }
        .brand-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
        .report-meta { text-align: right; font-size: 12px; color: #475569; }
        
        .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; background: #f1f5f9; padding: 8px 12px; border-left: 4px solid #2563eb; margin-top: 20px; margin-bottom: 12px; letter-spacing: 0.05em; }
        
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 15px; background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .info-item { font-size: 13px; }
        .info-label { color: #64748b; font-weight: 600; }
        .info-val { color: #0f172a; font-weight: 700; margin-left: 6px; }

        .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; }
        .vital-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; }
        .vital-name { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        .vital-value { font-size: 16px; font-weight: 800; color: #0f172a; }

        .notes-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; font-size: 13px; color: #1e3a8a; line-height: 1.5; margin-bottom: 15px; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
        th { background: #f1f5f9; color: #475569; text-align: left; padding: 10px; font-weight: 700; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }

        .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 10px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <div>
          <h1 class="brand-title">🏥 CareCircle Health Report</h1>
          <div class="brand-sub">Smart Family Health Microservices Pass</div>
        </div>
        <div class="report-meta">
          <div><strong>Report Date:</strong> ${reportDate}</div>
          <div><strong>Report ID:</strong> CC-PDF-${Math.floor(100000 + Math.random() * 900000)}</div>
        </div>
      </div>

      <div class="section-title">1. Member Information</div>
      <div class="info-grid">
        <div class="info-item"><span class="info-label">Full Name / Head:</span><span class="info-val">${memberName}</span></div>
        <div class="info-item"><span class="info-label">Mobile Number:</span><span class="info-val">${mobileNumber}</span></div>
        <div class="info-item"><span class="info-label">Member Role:</span><span class="info-val">${role}</span></div>
        <div class="info-item"><span class="info-label">Family ID:</span><span class="info-val">${familyId}</span></div>
      </div>

      <div class="section-title">2. Latest Health Vitals</div>
      <div class="vitals-grid">
        <div class="vital-card">
          <div class="vital-name">❤️ Blood Pressure</div>
          <div class="vital-value">${bp}</div>
        </div>
        <div class="vital-card">
          <div class="vital-name">⚡ Blood Sugar</div>
          <div class="vital-value">${sugar}</div>
        </div>
        <div class="vital-card">
          <div class="vital-name">💓 Heart Rate</div>
          <div class="vital-value">${heartRate}</div>
        </div>
        <div class="vital-card">
          <div class="vital-name">🫁 SpO2 Oxygen</div>
          <div class="vital-value">${oxygen}</div>
        </div>
        <div class="vital-card">
          <div class="vital-name">🌡️ Temperature</div>
          <div class="vital-value">${temp}</div>
        </div>
        <div class="vital-card">
          <div class="vital-name">⚖️ Weight / Height</div>
          <div class="vital-value">${weight} / ${height}</div>
        </div>
      </div>

      <div class="section-title">3. Clinical & Vitals Notes</div>
      <div class="notes-box">
        <strong>Notes:</strong> ${notes}
      </div>

      <div class="section-title">4. Current Active Medicines</div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine Name</th>
            <th>Strength / Form</th>
            <th>Dosage & Frequency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${medRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        CareCircle Healthcare System • Confidential Patient Health Summary Document • Generated for ${memberName} (${mobileNumber})
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  // Create Blob and trigger download / printable PDF window
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const printWindow = window.open(url, '_blank');
  if (!printWindow) {
    // Fallback: direct download as printable report file
    const link = document.createElement('a');
    link.href = url;
    link.download = `CareCircle_Health_Report_${memberName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
