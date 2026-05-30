# NagarikSwasthya (Shuraksha) — Citizens Health Portal 🏥

**NagarikSwasthya** (commonly referred to as **Shuraksha**) is a comprehensive web portal designed for the **Maharashtra Health Department** to make healthcare accessible, accountable, and transparent for every citizen. The system integrates a dynamic grievance reporting platform, live hospital mapping with OSM navigation, a health scheme eligibility checker, and a powerful administration panel.

---

## 🌟 Key Features

### 📋 1. Healthcare Grievance System
*   **Simple Grievance Filing**: Citizens can report issues with doctors, hospital facilities, medicines, scheme enrollment, or ambulance services.
*   **No Mandatory Registration**: Basic filing is open to all citizens without requiring account creation.
*   **Live Tracking**: A unique tracking ID (`GRV-YYYY-XXXXX`) is generated for each complaint, allowing citizens to check the status instantly.
*   **Real-time Timeline Updates**: View status updates (Pending ➔ Assigned ➔ In Review ➔ Resolved) and see assigned officers and progress notes.

### 🗺️ 2. Live Interactive Hospital Map
*   **OpenStreetMap (OSM) Integration**: High-performance rendering of nearby healthcare facilities (Primary Health Centers, Civil Hospitals, Blood Banks, Ambulance hubs).
*   **Intelligent Routing**: Select a facility and get optimized navigation routing directly from the user's current GPS location via Google Maps.
*   **Facility Search**: Filter and lookup hospital capacities, available beds, contact numbers, and list of doctors.

### 🛡️ 3. Health Scheme Discovery
*   **Eligibility Checker**: Automatically check eligibility for government health benefit programs like *Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)* and others.
*   **Detailed Documentation**: Access details on required documentation, coverage limits, and enrollment procedures.

### 🏢 4. Admin Dashboard
*   **Complaint Management**: Secure admin view (`/pages/admin.html`) to manage incoming citizen complaints.
*   **Workflow Assignment**: Officers can be assigned to grievances, update resolution progress, and log timeline events.
*   **Real-Time Analytics**: Visual dashboard showing resolved, pending, and in-review statistics.

### 🌐 5. Multilingual & Translation Support
*   **Built-in Translation Framework**: Interactive, localized support in Marathi (मराठी), Hindi (हिंदी), and English via dynamic javascript translation.

---

## 🛠️ Technology Stack

*   **Frontend**: 
    *   Semantic HTML5 & Vanilla CSS3 (vibrant dark modes, responsive cards, elegant transitions).
    *   Vanilla JavaScript (ES6) for DOM interactions, routing, and dynamic data fetching.
    *   OpenStreetMap (Leaflet.js) for live interactive maps.
*   **Backend**: 
    *   Node.js & Express framework for API routing and static file serving.
    *   CORS enabled for flexible cross-origin requests.
*   **Database**: 
    *   MongoDB with Mongoose ODM for structured, high-performance data modeling.
    *   Auto-seeding functionality for demo data (complaints, registered users) when running the database for the first time.

---

## 📂 Project Structure

```bash
shuraksha/
├── files/                       # Frontend Static Web Application
│   ├── css/
│   │   └── main.css             # Premium custom UI stylesheet (Glassmorphism & animations)
│   ├── images/                  # Graphical assets & logos
│   ├── js/
│   │   ├── db.js                # Frontend local database adapter / fallback handlers
│   │   ├── main.js              # General client-side interactions and dashboard counters
│   │   └── translate.js         # Multilingual translation engine
│   ├── pages/
│   │   ├── admin.html           # Internal portal for health officers & admins
│   │   ├── facilities.html      # Directory lookup for hospitals & PHCs
│   │   ├── file.html            # Citizen grievance submission form
│   │   ├── login.html           # Secure citizen and admin login interface
│   │   ├── schemes.html         # Health benefits & eligibility portal
│   │   └── track.html           # Full status page with a detailed visual timeline
│   ├── index.html               # Main citizen landing page (Home)
│   └── map.html                 # Interactive OpenStreetMap interface
├── server.js                    # Express Server & MongoDB API backend
├── package.json                 # Node dependencies and npm scripts
└── .gitignore                   # Excludes node_modules and logs from git
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/) (v14 or higher recommended)
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) (running locally on standard port `27017`)

### 2. Installation
Clone the repository and install dependencies:
```bash
# Navigate to the project root directory
cd shuraksha

# Install required node modules
npm install
```

### 3. Running the Server
Start the backend Express server:
```bash
npm start
```
Upon successful start, you will see:
```text
Server running on port 5000
MongoDB connected
Seeding demo data... # (Only on first startup)
```

### 4. Viewing the Application
Open your browser and navigate to:
```text
http://localhost:5000
```

---

## 🔒 Security & Best Practices
*   **Private Environments**: Sensitive database configurations and credentials can be stored in `.env` (already added to `.gitignore`).
*   **Clean Database Seed**: In production, remove the `seedDatabase()` hook from `server.js` or configure environment-based conditions.
*   **Client Fallbacks**: The frontend `js/db.js` provides local fallbacks to ensure the UI continues to function cleanly even if the MongoDB service is temporarily offline.

---

*Developed under the initiative of NIC Maharashtra & Health Department.* 🇮🇳
