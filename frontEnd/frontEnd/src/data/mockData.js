export const mockData = {
  familyMembers: [
    { id: 1, name: 'John Doe', relationship: 'Self', age: 42, bloodGroup: 'A+', healthScore: 92, photo: '👨‍💼', chronic: 'None', allergies: 'Penicillin' },
    { id: 2, name: 'Jane Doe', relationship: 'Spouse', age: 38, bloodGroup: 'O+', healthScore: 88, photo: '👩‍💼', chronic: 'Asthma', allergies: 'Peanuts' },
    { id: 3, name: 'Billy Doe', relationship: 'Son', age: 10, bloodGroup: 'A+', healthScore: 95, photo: '👦', chronic: 'None', allergies: 'Dust' }
  ],
  appointments: [
    { id: 1, doctor: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', date: '2026-06-15', time: '10:00 AM', status: 'Confirmed', member: 'John Doe' },
    { id: 2, doctor: 'Dr. Alex Rivera', specialty: 'Pediatrician', date: '2026-06-18', time: '02:30 PM', status: 'Pending', member: 'Billy Doe' }
  ],
  medicines: [
    { id: 1, name: 'Paracetamol Extra', dosage: '500mg', frequency: 'As needed for fever/pain', stock: 24, member: 'General Family', compliance: 98 },
    { id: 2, name: 'Family Multivitamin & Minerals', dosage: '1 tablet', frequency: 'Once daily', stock: 45, member: 'General Family', compliance: 90 },
    { id: 3, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', stock: 14, member: 'John Doe', compliance: 85 },
    { id: 4, name: 'Metformin SR', dosage: '500mg', frequency: 'Twice daily', stock: 20, member: 'John Doe', compliance: 92 },
    { id: 5, name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', stock: 1, member: 'Jane Doe', compliance: 95 },
    { id: 6, name: 'Vitamin D3 Supplement', dosage: '60,000 IU', frequency: 'Once weekly', stock: 8, member: 'Jane Doe', compliance: 100 },
    { id: 7, name: 'Pediatric Multivitamin Syrup', dosage: '5ml', frequency: 'Once daily', stock: 12, member: 'Billy Doe', compliance: 96 }
  ],
  vitals: {
    bloodPressure: [
      { date: '06-01', value: '120/80' },
      { date: '06-03', value: '122/81' },
      { date: '06-07', value: '118/79' }
    ],
    bloodSugar: [
      { date: '06-01', value: '95 mg/dL' },
      { date: '06-05', value: '102 mg/dL' }
    ]
  },
  records: [
    { id: 1, name: 'Annual Blood Panel Report.pdf', type: 'Lab Reports', date: '2026-05-10', doctor: 'Dr. Sarah Jenkins', hospital: 'City General Hospital', member: 'John Doe', notes: 'Complete CBC, Lipid Profile & Fasting Blood Sugar results normal.' },
    { id: 2, name: 'Cardiology Consultation Summary.pdf', type: 'Doctor Visits', date: '2026-04-12', doctor: 'Dr. Sarah Jenkins', hospital: 'Trauma & Heart Institute', member: 'John Doe', notes: 'BP stable at 122/81. Recommended continuing 10mg Lisinopril.' },
    { id: 3, name: 'Chest X-Ray Diagnostic Scan.png', type: 'Medical Documents', date: '2026-02-14', doctor: 'Dr. Robert Vance', hospital: 'St. Jude Radiology Center', member: 'Jane Doe', notes: 'No acute pulmonary infiltrates or consolidation noted.' },
    { id: 4, name: 'Covid-19 Booster Vaccine Certificate.pdf', type: 'Vaccination Records', date: '2025-11-20', doctor: 'City Health Clinic', hospital: 'Metro Vaccine Hub', member: 'Jane Doe', notes: 'Annual booster dose administered successfully.' },
    { id: 5, name: 'Pediatric Immunization Record.pdf', type: 'Vaccination Records', date: '2026-01-15', doctor: 'Dr. Alex Rivera', hospital: 'Children Care Hospital', member: 'Billy Doe', notes: 'Up to date on MMR and DTaP vaccinations.' },
    { id: 6, name: 'Family Health Insurance Policy 2026.pdf', type: 'Insurance Documents', date: '2026-01-01', doctor: 'Star Health Insurance', hospital: 'Primary Coverage', member: 'John Doe', notes: 'Comprehensive family floater policy covering up to $500,000.' },
    { id: 7, name: 'Emergency Contacts & Allergy Sheet.pdf', type: 'Medical Records', date: '2026-03-01', doctor: 'Family Administrator', hospital: 'Home Record', member: 'Jane Doe', notes: 'Quick access reference sheet for family emergency contacts.' }
  ]
};