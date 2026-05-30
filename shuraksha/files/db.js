// NagarikSwasthya — MongoDB API Client
const DB = {
  prefix: 'ns_',
  
  // Base API URL
  apiUrl: '/api',

  // COMPLAINTS
  async getComplaints() {
    try {
      const res = await fetch(`${this.apiUrl}/complaints`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async getComplaintById(id) {
    try {
      const res = await fetch(`${this.apiUrl}/complaints/${id.trim().toUpperCase()}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async addComplaint(data) {
    try {
      const res = await fetch(`${this.apiUrl}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },
  async getUserComplaints(mobile) {
    try {
      const res = await fetch(`${this.apiUrl}/complaints/user/${mobile}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },
  async updateComplaint(id, updates) {
    try {
      const res = await fetch(`${this.apiUrl}/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // USERS
  async registerUser(data) {
    try {
      const res = await fetch(`${this.apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      return result;
    } catch (e) {
      console.error(e);
      return { error: 'Network error' };
    }
  },
  async loginUser(mobile, password) {
    try {
      const res = await fetch(`${this.apiUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password })
      });
      const result = await res.json();
      return result;
    } catch (e) {
      console.error(e);
      return { error: 'Network error' };
    }
  },

  // SESSION
  setSession(user) { sessionStorage.setItem(this.prefix + 'session', JSON.stringify(user)); },
  getSession() { const s = sessionStorage.getItem(this.prefix + 'session'); return s ? JSON.parse(s) : null; },
  clearSession() { sessionStorage.removeItem(this.prefix + 'session'); },

  // STATS
  async getStats() {
    try {
      const res = await fetch(`${this.apiUrl}/stats`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return { total: 0, resolved: 0, inReview: 0, pending: 0 };
    }
  }
};


// Facilities data
const FACILITIES = [
  { name: 'Pimpri-Chinchwad Municipal Hospital', type: 'Government Hospital', district: 'Pune', distance: '0.8 km', hours: '24x7 Emergency', status: 'open', beds: '240 beds', services: 'Emergency, Surgery, OPD, ICU' },
  { name: 'Wakad PHC', type: 'Primary Health Centre', district: 'Pune', distance: '1.2 km', hours: 'Mon–Sat 9am–4pm', status: 'open', beds: '20 beds', services: 'OPD, Vaccination, Maternal care' },
  { name: 'Pimpri Blood Bank', type: 'Blood Bank', district: 'Pune', distance: '2.1 km', hours: 'Mon–Sat 8am–6pm', status: 'open', beds: '-', services: 'A+, O+, B+, AB+ available' },
  { name: 'Bhosari Sub-District Hospital', type: 'Sub-District Hospital', district: 'Pune', distance: '3.4 km', hours: 'Mon–Fri 9am–5pm', status: 'closed', beds: '80 beds', services: 'OPD, Laboratory, Radiology' },
  { name: 'Nashik Civil Hospital', type: 'Government Hospital', district: 'Nashik', distance: '1.0 km', hours: '24x7', status: 'open', beds: '400 beds', services: 'Emergency, ICU, Surgery, Oncology' },
  { name: 'Igatpuri PHC', type: 'Primary Health Centre', district: 'Nashik', distance: '4.5 km', hours: 'Mon–Sat 9am–3pm', status: 'open', beds: '10 beds', services: 'OPD, Immunization, Antenatal' },
  { name: 'Nagpur Government Medical College', type: 'Medical College Hospital', district: 'Nagpur', distance: '2.3 km', hours: '24x7', status: 'open', beds: '900 beds', services: 'All specialities, Trauma, ICU' },
  { name: '108 Ambulance — Nagpur Zone', type: 'Ambulance', district: 'Nagpur', distance: 'On-call', hours: '24x7', status: 'open', beds: '-', services: 'Emergency ambulance dispatch' },
  { name: 'Aurangabad District Hospital', type: 'District Hospital', district: 'Aurangabad', distance: '1.5 km', hours: '24x7 Emergency', status: 'open', beds: '350 beds', services: 'Emergency, Surgery, Pediatrics' },
  { name: 'Jan Aushadhi Store — Pimpri', type: 'Medicine Store', district: 'Pune', distance: '0.5 km', hours: 'Mon–Sat 9am–8pm', status: 'open', beds: '-', services: 'Generic medicines at 50–90% less cost' },
];

const SCHEMES = [
  { name: 'Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)', tag: 'state', benefit: '₹1.5 lakh per year for listed medical procedures', eligibility: 'Below poverty line, farmers, journalists, construction workers', description: 'State government scheme covering 996 medical procedures at empanelled hospitals across Maharashtra.' },
  { name: 'Ayushman Bharat PM-JAY', tag: 'central', benefit: '₹5 lakh per family per year', eligibility: 'Bottom 40% of population by economic status (SECC database)', description: 'India\'s flagship health insurance scheme covering secondary and tertiary hospitalisation.' },
  { name: 'Pradhan Mantri Surakshit Matritva Abhiyan', tag: 'central', benefit: 'Free antenatal care on 9th of every month', eligibility: 'All pregnant women in 2nd or 3rd trimester', description: 'Assured, comprehensive and quality antenatal care on a fixed day every month.' },
  { name: 'Rashtriya Bal Swasthya Karyakram (RBSK)', tag: 'central', benefit: 'Free screening and treatment for 0–18 years', eligibility: 'All children from birth to 18 years', description: 'Child health screening and early intervention for 4Ds — Defects, Deficiencies, Diseases, Developmental delays.' },
  { name: 'Janani Suraksha Yojana (JSY)', tag: 'central', benefit: 'Cash assistance of ₹700–₹1400 for institutional delivery', eligibility: 'Below poverty line pregnant women, SC/ST women', description: 'Safe motherhood intervention under NHM promoting institutional delivery among poor pregnant women.' },
  { name: 'National Mental Health Programme', tag: 'central', benefit: 'Free mental health services at govt. facilities', eligibility: 'All citizens', description: 'Provides treatment for mental illness at community health centres and district hospitals at no cost.' },
];


