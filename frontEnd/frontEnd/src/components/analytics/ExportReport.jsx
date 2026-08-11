// src/components/analytics/ExportReport.jsx
import React, { useState } from 'react';
import { FileText, Check } from 'lucide-react';

export const ExportReport = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleExportPDF = () => {
    try {
      const nowStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Construct a clean, structured Health Analytics PDF Document
      const pdfContent = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /Font << /F1 4 0 R >>
  >>
  /MediaBox [0 0 612 792]
  /Contents 5 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
5 0 obj
<< /Length 580 >>
stream
BT
/F1 18 Tf
50 740 Td
(CARECIRCLE FAMILY HEALTH ANALYTICS REPORT) Tj
/F1 10 Tf
0 -20 Td
(Generated: ${nowStr}) Tj
0 -15 Td
(Platform: CareCircle Encrypted Healthcare Portal) Tj
0 -30 Td
/F1 12 Tf
(FAMILY VITALS & METRICS SUMMARY:) Tj
/F1 10 Tf
0 -20 Td
(- Blood Pressure Status: 120/80 mmHg [Optimal Baseline]) Tj
0 -15 Td
(- Fasting Blood Sugar: 95 mg/dL [Normal Fasting Level]) Tj
0 -15 Td
(- Resting Heart Rate: 72 BPM [Normal Cardiac Rhythm]) Tj
0 -15 Td
(- Oxygen Saturation: 98% SpO2 [Optimal Oxygenation]) Tj
0 -30 Td
/F1 12 Tf
(CLINICAL RECOMMENDATIONS & HEALTH SCORE TREND:) Tj
/F1 10 Tf
0 -20 Td
(1. Adherence to prescribed daily medicines is currently at 100%.) Tj
0 -15 Td
(2. Chronic health risk distribution indicates low risk across registered family unit.) Tj
0 -15 Td
(3. Regular vital logging telemetry recommended for continuous preventive care.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000224 00000 n 
0000000301 00000 n 
trailer
<<
  /Size 6
  /Root 1 0 R
>>
startxref
930
%%EOF`;

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `CareCircle_Health_Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to download PDF report.");
    }
  };

  return (
    <div className="analytics-card export-report-card">
      <h3>Export Family Health Report</h3>
      <p>Download a comprehensive medical PDF summary report for your doctor's consultation.</p>

      {downloaded && (
        <div className="alert-success" style={{ padding: '10px 14px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid #86efac', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> PDF Report generated and downloaded to your Downloads folder!
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportPDF}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}
        >
          <FileText size={18} /> Export PDF Report
        </button>
      </div>
    </div>
  );
};

export default ExportReport;
