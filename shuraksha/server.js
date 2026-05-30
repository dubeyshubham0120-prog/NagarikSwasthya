const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the 'files' directory
app.use(express.static(path.join(__dirname, 'files')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/shuraksha')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  mobile: String,
  email: String,
  district: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

const ComplaintSchema = new mongoose.Schema({
  id: String,
  name: String,
  mobile: String,
  email: String,
  district: String,
  type: String,
  facility: String,
  description: String,
  status: String,
  filed: String,
  updated: String,
  officer: String,
  timeline: Array
});
const Complaint = mongoose.model('Complaint', ComplaintSchema);

// API Routes
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const count = await Complaint.countDocuments();
    const id = 'GRV-' + new Date().getFullYear() + '-' + String(400 + count + 1).padStart(5, '0');
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const fullDate = now.toISOString().split('T')[0];
    
    const complaint = new Complaint({
      ...req.body,
      id,
      status: 'pending',
      filed: fullDate,
      updated: fullDate,
      officer: 'Pending assignment',
      timeline: [{ date: dateStr, text: 'Complaint submitted by citizen via NagarikSwasthya portal.' }]
    });
    
    await complaint.save();
    res.json(complaint);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/complaints/user/:mobile', async (req, res) => {
  try {
    const complaints = await Complaint.find({ mobile: req.params.mobile });
    res.json(complaints);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    res.json(complaint);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    res.json(complaint);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const existing = await User.findOne({ mobile: req.body.mobile });
    if (existing) return res.status(400).json({ error: 'Mobile already registered.' });
    
    const count = await User.countDocuments();
    const user = new User({ id: 'USR' + String(count + 100), ...req.body });
    await user.save();
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ mobile: req.body.mobile });
    if (!user) return res.status(400).json({ error: 'Mobile not registered.' });
    if (user.password !== req.body.password) return res.status(400).json({ error: 'Incorrect password.' });
    res.json({ user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    const inReview = await Complaint.countDocuments({ status: 'in-review' });
    const pending = await Complaint.countDocuments({ status: 'pending' });
    res.json({ total, resolved, inReview, pending });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Seed demo data if database is empty
async function seedDatabase() {
  const cCount = await Complaint.countDocuments();
  if (cCount === 0) {
    console.log('Seeding demo data...');
    await Complaint.insertMany([
      { id: 'GRV-2026-00289', name: 'Ravi Shinde', mobile: '9876543210', type: 'Doctor Negligence', district: 'Pune', facility: 'Pimpri-Chinchwad Municipal Hospital', description: 'Doctor was absent during OPD hours without notice.', status: 'resolved', filed: '2026-04-08', updated: '2026-04-18', officer: 'Priya Deshmukh', timeline: [{ date: 'Apr 8', text: 'Complaint submitted by citizen.' }, { date: 'Apr 10', text: 'Assigned to District Health Officer, Pune.' }, { date: 'Apr 14', text: 'On-site inspection conducted at Pimpri-Chinchwad Municipal Hospital.' }, { date: 'Apr 18', text: 'Issue resolved. Doctor attendance policy enforced. Warning issued.' }] },
      { id: 'GRV-2026-00301', name: 'Sunita Patil', mobile: '9123456789', type: 'Medicine Unavailability', district: 'Nashik', facility: 'Nashik Civil Hospital', description: 'Essential hypertension medicines not available for over a month.', status: 'pending', filed: '2026-04-12', updated: '2026-04-12', officer: 'Pending', timeline: [{ date: 'Apr 12', text: 'Complaint submitted by citizen.' }] },
      { id: 'GRV-2026-00312', name: 'Meera Joshi', mobile: '9871234560', type: 'Hospital Facility', district: 'Pune', facility: 'Wakad PHC', description: 'Blood pressure monitor not working since 3 weeks. Patients being sent to private hospitals.', status: 'in-review', filed: '2026-04-14', updated: '2026-04-19', officer: 'Anil Kulkarni', timeline: [{ date: 'Apr 14', text: 'Complaint submitted by citizen.' }, { date: 'Apr 16', text: 'Assigned to PHC Supervisor, Pimpri-Chinchwad.' }, { date: 'Apr 19', text: 'Equipment procurement process initiated. Expected resolution by Apr 25.' }] },
      { id: 'GRV-2026-00298', name: 'Rahul More', mobile: '9765432100', type: 'Scheme Enrollment', district: 'Aurangabad', facility: 'MJPJAY Office', description: 'MJPJAY card not issued despite meeting eligibility criteria since 3 months.', status: 'resolved', filed: '2026-04-05', updated: '2026-04-16', officer: 'Sneha Bhosale', timeline: [{ date: 'Apr 5', text: 'Complaint submitted by citizen.' }, { date: 'Apr 7', text: 'Assigned to Scheme Coordinator, Aurangabad.' }, { date: 'Apr 16', text: 'Card issued. Documents verified and enrollment completed.' }] },
      { id: 'GRV-2026-00320', name: 'Aasha Yadav', mobile: '9812345670', type: 'Ambulance Service', district: 'Nagpur', facility: '108 Ambulance Service', description: 'Ambulance took 2 hours to arrive during emergency delivery.', status: 'in-review', filed: '2026-04-20', updated: '2026-04-21', officer: 'Vikram Pawar', timeline: [{ date: 'Apr 20', text: 'Complaint submitted by citizen.' }, { date: 'Apr 21', text: 'Assigned to District Emergency Coordinator, Nagpur.' }] }
    ]);
  }
  const uCount = await User.countDocuments();
  if (uCount === 0) {
    await User.insertMany([
      { id: 'USR001', name: 'Ravi Shinde', mobile: '9876543210', email: 'ravi@example.com', district: 'Pune', password: 'test123' }
    ]);
  }
}
mongoose.connection.once('open', seedDatabase);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
