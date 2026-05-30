// NagarikSwasthya — Local DB (localStorage-based backend simulation)
const DB = {
  prefix: 'ns_',

  // Seed demo data if empty
  init() {
    if (!localStorage.getItem(this.prefix + 'seeded')) {
      this._seedData();
      localStorage.setItem(this.prefix + 'seeded', '1');
    }
  },

  _seedData() {
    const complaints = [
      { id:'GRV-2026-00289', name:'Ravi Shinde', mobile:'9876543210', type:'Doctor Negligence', district:'Pune', facility:'Pimpri-Chinchwad Municipal Hospital', description:'Doctor was absent during OPD hours without notice.', status:'resolved', filed:'2026-04-08', updated:'2026-04-18', officer:'Priya Deshmukh', timeline:[{date:'Apr 8',text:'Complaint submitted by citizen.'},{date:'Apr 10',text:'Assigned to District Health Officer, Pune.'},{date:'Apr 14',text:'On-site inspection conducted at Pimpri-Chinchwad Municipal Hospital.'},{date:'Apr 18',text:'Issue resolved. Doctor attendance policy enforced. Warning issued.'}] },
      { id:'GRV-2026-00301', name:'Sunita Patil', mobile:'9123456789', type:'Medicine Unavailability', district:'Nashik', facility:'Nashik Civil Hospital', description:'Essential hypertension medicines not available for over a month.', status:'pending', filed:'2026-04-12', updated:'2026-04-12', officer:'Pending', timeline:[{date:'Apr 12',text:'Complaint submitted by citizen.'}] },
      { id:'GRV-2026-00312', name:'Meera Joshi', mobile:'9871234560', type:'Hospital Facility', district:'Pune', facility:'Wakad PHC', description:'Blood pressure monitor not working since 3 weeks. Patients being sent to private hospitals.', status:'in-review', filed:'2026-04-14', updated:'2026-04-19', officer:'Anil Kulkarni', timeline:[{date:'Apr 14',text:'Complaint submitted by citizen.'},{date:'Apr 16',text:'Assigned to PHC Supervisor, Pimpri-Chinchwad.'},{date:'Apr 19',text:'Equipment procurement process initiated. Expected resolution by Apr 25.'}] },
      { id:'GRV-2026-00298', name:'Rahul More', mobile:'9765432100', type:'Scheme Enrollment', district:'Aurangabad', facility:'MJPJAY Office', description:'MJPJAY card not issued despite meeting eligibility criteria since 3 months.', status:'resolved', filed:'2026-04-05', updated:'2026-04-16', officer:'Sneha Bhosale', timeline:[{date:'Apr 5',text:'Complaint submitted by citizen.'},{date:'Apr 7',text:'Assigned to Scheme Coordinator, Aurangabad.'},{date:'Apr 16',text:'Card issued. Documents verified and enrollment completed.'}] },
      { id:'GRV-2026-00320', name:'Aasha Yadav', mobile:'9812345670', type:'Ambulance Service', district:'Nagpur', facility:'108 Ambulance Service', description:'Ambulance took 2 hours to arrive during emergency delivery.', status:'in-review', filed:'2026-04-20', updated:'2026-04-21', officer:'Vikram Pawar', timeline:[{date:'Apr 20',text:'Complaint submitted by citizen.'},{date:'Apr 21',text:'Assigned to District Emergency Coordinator, Nagpur.'}] },
    ];
    localStorage.setItem(this.prefix + 'complaints', JSON.stringify(complaints));

    const users = [
      { id:'USR001', name:'Ravi Shinde', mobile:'9876543210', email:'ravi@example.com', district:'Pune', password:'test123' }
    ];
    localStorage.setItem(this.prefix + 'users', JSON.stringify(users));
  },

  // COMPLAINTS
  getComplaints() {
    return JSON.parse(localStorage.getItem(this.prefix + 'complaints') || '[]');
  },
  saveComplaints(arr) {
    localStorage.setItem(this.prefix + 'complaints', JSON.stringify(arr));
  },
  getComplaintById(id) {
    return this.getComplaints().find(c => c.id === id.trim().toUpperCase());
  },
  addComplaint(data) {
    const complaints = this.getComplaints();
    const id = 'GRV-2026-' + String(400 + complaints.length + 1).padStart(5,'0');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN',{day:'numeric',month:'short'});
    const fullDate = now.toISOString().split('T')[0];
    const complaint = {
      ...data,
      id,
      status: 'pending',
      filed: fullDate,
      updated: fullDate,
      officer: 'Pending assignment',
      timeline: [{ date: dateStr, text: 'Complaint submitted by citizen via NagarikSwasthya portal.' }]
    };
    complaints.push(complaint);
    this.saveComplaints(complaints);
    return complaint;
  },
  getUserComplaints(mobile) {
    return this.getComplaints().filter(c => c.mobile === mobile);
  },

  // USERS
  getUsers() {
    return JSON.parse(localStorage.getItem(this.prefix + 'users') || '[]');
  },
  getUserByMobile(mobile) {
    return this.getUsers().find(u => u.mobile === mobile);
  },
  registerUser(data) {
    const users = this.getUsers();
    if (users.find(u => u.mobile === data.mobile)) return { error: 'Mobile already registered.' };
    const user = { id: 'USR' + String(users.length + 100), ...data };
    users.push(user);
    localStorage.setItem(this.prefix + 'users', JSON.stringify(users));
    return { user };
  },
  loginUser(mobile, password) {
    const user = this.getUserByMobile(mobile);
    if (!user) return { error: 'Mobile not registered.' };
    if (user.password !== password) return { error: 'Incorrect password.' };
    return { user };
  },

  // SESSION
  setSession(user) { sessionStorage.setItem(this.prefix + 'session', JSON.stringify(user)); },
  getSession() { const s = sessionStorage.getItem(this.prefix + 'session'); return s ? JSON.parse(s) : null; },
  clearSession() { sessionStorage.removeItem(this.prefix + 'session'); },

  // STATS
  getStats() {
    const complaints = this.getComplaints();
    return {
      total: complaints.length,
      resolved: complaints.filter(c => c.status === 'resolved').length,
      inReview: complaints.filter(c => c.status === 'in-review').length,
      pending: complaints.filter(c => c.status === 'pending').length,
    };
  }
};

// Facilities data
const FACILITIES = [
  { name:'Pimpri-Chinchwad Municipal Hospital', type:'Government Hospital', district:'Pune', distance:'0.8 km', hours:'24x7 Emergency', status:'open', beds:'240 beds', services:'Emergency, Surgery, OPD, ICU' },
  { name:'Wakad PHC', type:'Primary Health Centre', district:'Pune', distance:'1.2 km', hours:'Mon–Sat 9am–4pm', status:'open', beds:'20 beds', services:'OPD, Vaccination, Maternal care' },
  { name:'Pimpri Blood Bank', type:'Blood Bank', district:'Pune', distance:'2.1 km', hours:'Mon–Sat 8am–6pm', status:'open', beds:'-', services:'A+, O+, B+, AB+ available' },
  { name:'Bhosari Sub-District Hospital', type:'Sub-District Hospital', district:'Pune', distance:'3.4 km', hours:'Mon–Fri 9am–5pm', status:'closed', beds:'80 beds', services:'OPD, Laboratory, Radiology' },
  { name:'Nashik Civil Hospital', type:'Government Hospital', district:'Nashik', distance:'1.0 km', hours:'24x7', status:'open', beds:'400 beds', services:'Emergency, ICU, Surgery, Oncology' },
  { name:'Igatpuri PHC', type:'Primary Health Centre', district:'Nashik', distance:'4.5 km', hours:'Mon–Sat 9am–3pm', status:'open', beds:'10 beds', services:'OPD, Immunization, Antenatal' },
  { name:'Nagpur Government Medical College', type:'Medical College Hospital', district:'Nagpur', distance:'2.3 km', hours:'24x7', status:'open', beds:'900 beds', services:'All specialities, Trauma, ICU' },
  { name:'108 Ambulance — Nagpur Zone', type:'Ambulance', district:'Nagpur', distance:'On-call', hours:'24x7', status:'open', beds:'-', services:'Emergency ambulance dispatch' },
  { name:'Aurangabad District Hospital', type:'District Hospital', district:'Aurangabad', distance:'1.5 km', hours:'24x7 Emergency', status:'open', beds:'350 beds', services:'Emergency, Surgery, Pediatrics' },
  { name:'Jan Aushadhi Store — Pimpri', type:'Medicine Store', district:'Pune', distance:'0.5 km', hours:'Mon–Sat 9am–8pm', status:'open', beds:'-', services:'Generic medicines at 50–90% less cost' },
];

const SCHEMES = [
  { name:'Mahatma Jyotiba Phule Jan Arogya Yojana (MJPJAY)', tag:'state', benefit:'₹1.5 lakh per year for listed medical procedures', eligibility:'Below poverty line, farmers, journalists, construction workers', description:'State government scheme covering 996 medical procedures at empanelled hospitals across Maharashtra.' },
  { name:'Ayushman Bharat PM-JAY', tag:'central', benefit:'₹5 lakh per family per year', eligibility:'Bottom 40% of population by economic status (SECC database)', description:'India\'s flagship health insurance scheme covering secondary and tertiary hospitalisation.' },
  { name:'Pradhan Mantri Surakshit Matritva Abhiyan', tag:'central', benefit:'Free antenatal care on 9th of every month', eligibility:'All pregnant women in 2nd or 3rd trimester', description:'Assured, comprehensive and quality antenatal care on a fixed day every month.' },
  { name:'Rashtriya Bal Swasthya Karyakram (RBSK)', tag:'central', benefit:'Free screening and treatment for 0–18 years', eligibility:'All children from birth to 18 years', description:'Child health screening and early intervention for 4Ds — Defects, Deficiencies, Diseases, Developmental delays.' },
  { name:'Janani Suraksha Yojana (JSY)', tag:'central', benefit:'Cash assistance of ₹700–₹1400 for institutional delivery', eligibility:'Below poverty line pregnant women, SC/ST women', description:'Safe motherhood intervention under NHM promoting institutional delivery among poor pregnant women.' },
  { name:'National Mental Health Programme', tag:'central', benefit:'Free mental health services at govt. facilities', eligibility:'All citizens', description:'Provides treatment for mental illness at community health centres and district hospitals at no cost.' },
];

DB.init();
