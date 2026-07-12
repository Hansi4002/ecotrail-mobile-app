# 🌿 EcoTrail - Nature Exploration & Tracking App

[![Expo](https://img.shields.io/badge/Expo-54.0.34-black?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.81.5-blue?style=flat&logo=react)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.16.0-orange?style=flat&logo=firebase)](https://firebase.google.com/)

---

## 📱 About The Project

**EcoTrail** is a cross-platform mobile application developed for nature enthusiasts in Sri Lanka. It helps users discover hiking trails, document wildlife sightings, and track their adventures using GPS technology.

### 🎯 Course Information
- **Course:** Graduate Diploma in Software Engineering
- **Module:** ITS 2127 - Advanced Mobile Developer (AMD)
- **Institution:** IJSE (Institute of Java and Software Engineering)
- **Year:** 2026

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure login/register with Firebase Auth |
| 🏔️ **Trail Management** | Full CRUD operations for hiking trails |
| 🗺️ **GPS & Maps** | Live location tracking with React Native Maps |
| 📸 **Species Log** | Document wildlife with camera and location |
| 👑 **Admin Panel** | Admin-only trail management |
| 📱 **Cross-Platform** | Works on Android & iOS |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React Native 0.81.5
- **Platform:** Expo 54.0.34
- **Navigation:** Expo Router (Stack + Tabs)
- **State Management:** React Context API
- **Language:** JavaScript (ES6+)

### Backend
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Storage:** Cloudinary (Image Upload)

### APIs & Services
- **Maps:** React Native Maps
- **Location:** Expo Location
- **Camera:** Expo Camera / Image Picker
- **HTTP:** Axios

---

## 📁 Project Structure

```
EcoTrail/
├── app/
│   ├── (auth)/
│   │   ├── login.jsx          # Login Screen
│   │   ├── register.jsx       # Register Screen
│   │   └── _layout.jsx        # Auth Layout
│   ├── (tabs)/
│   │   ├── index.jsx          # Home - Trails List
│   │   ├── explore.jsx        # Map View
│   │   ├── log.jsx            # Species Log
│   │   ├── profile.jsx        # User Profile
│   │   └── _layout.jsx        # Tab Layout
│   ├── trail/
│   │   ├── add.jsx            # Add Trail
│   │   ├── [id].jsx           # Trail Details
│   │   └── edit/[id].jsx      # Edit Trail
│   ├── _layout.jsx            # Root Layout
│   └── index.jsx              # Entry Point
├── components/
│   └── TrailCard.jsx          # Reusable Components
├── context/
│   ├── AuthContext.jsx        # Auth State
│   ├── TrailContext.jsx       # Trail State
│   └── SpeciesContext.jsx     # Species State
├── services/
│   ├── firebase.js            # Firebase Config
│   ├── trails.js              # Trail CRUD
│   ├── species.js             # Species CRUD
│   ├── location.js            # GPS Service
│   └── upload.js              # Cloudinary Upload
├── assets/
│   └── images/                # App Images
├── app.json                   # Expo Config
├── package.json               # Dependencies
└── README.md                  # Documentation
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**
- **Android Studio** (for Android build)

### Step 1: Clone Repository

```bash
git clone https://github.com/Hansi4002/ecotrail-mobile-app
cd EcoTrail
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Setup

1. Create a project on [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password)
3. Enable **Firestore Database** (Start in test mode)
4. Enable **Storage** (Start in test mode)
5. Copy Firebase Config and update `services/firebase.js`

```javascript
// services/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Cloudinary Setup (For Image Upload)

1. Create account on [Cloudinary](https://cloudinary.com/)
2. Copy your **Cloud Name**
3. Create **Upload Preset** (Unsigned)
4. Update `services/upload.js`

```javascript
// services/upload.js
const CLOUDINARY_CLOUD_NAME = 'YOUR_CLOUD_NAME';
const UPLOAD_PRESET = 'YOUR_UPLOAD_PRESET';
```

### Step 5: Admin Setup

1. Register with email: `admin@gmail.com`
2. Update `context/AuthContext.jsx`:

```javascript
const ADMIN_EMAIL = 'admin@gmail.com';
```

### Step 6: Run Application

```bash
# Start the development server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

---

## 📱 Download App

### Method 1: Download APK (Android)

**Direct Download:** [Download APK](https://expo.dev/artifacts/eas/AN9z6l6PnV4b6-inaX9ugFrEVjxurt-LEbJMZ0VcvwM.apk)

**Or from Expo Builds:**
1. Go to [Expo Builds](https://expo.dev/accounts/hansani2004/projects/ecotrail/builds)
2. Click on the latest build
3. Click **Download APK**

### Method 2: Run from Source

```bash
git clone https://github.com/Hansi4002/ecotrail-mobile-app
cd EcoTrail
npm install
npx expo start
```

### Method 3: QR Code (Development)

1. Install **Expo Go** app from Play Store
2. Run `npx expo start`
3. Scan QR code with Expo Go

---

## 🎯 Features Breakdown

### 1. Authentication 🔐
- User Registration with Email/Password
- User Login
- Admin Login
- Logout with Confirmation

### 2. Trail Management 🏔️
- **Create:** Add new trails (Admin only)
- **Read:** View all trails with details
- **Update:** Edit trail information (Admin only)
- **Delete:** Remove trails (Admin only)

### 3. GPS & Maps 🗺️
- Current Location Detection
- Live Location Tracking
- Trail Markers on Map
- Navigate to Trail
- Open in Google Maps

### 4. Species Log 📸
- Take Photos with Camera
- Select from Gallery
- Auto-capture Location
- Upload to Cloudinary
- View Species Log List

### 5. User Profile 👤
- User Avatar (Auto-generated)
- User Statistics
- Settings Menu
- Admin Panel (Admin only)

---

## 📊 Database Schema

### Firestore Collections

#### `trails`
```javascript
{
  id: string,
  name: string,
  location: string,
  description: string,
  distance: number,
  duration: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  latitude: number,
  longitude: number,
  imageUrl: string,
  createdAt: string,
  updatedAt: string
}
```

#### `species`
```javascript
{
  id: string,
  speciesName: string,
  speciesType: string,
  description: string,
  photoUrl: string,
  location: string,
  userId: string,
  userEmail: string,
  createdAt: string
}
```

---

## 🔒 Security Rules

### Firestore Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    request.auth.token.email == 'admin@gmail.com';
    }
  }
}
```

### Storage Rules
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🧪 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@gmail.com | admin123456 |
| **User** | user@gmail.com | user123456 |

---

## 👨‍💻 Developer

- **Hansani** - *Developer* - [GitHub](https://github.com/Hansi4002)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **IJSE** - Institute of Java and Software Engineering
- **Course Coordinator:** Shamodha Sahan
- **Firebase** - Backend Services
- **React Native** - Mobile Framework
- **Expo** - Development Platform

---

**Happy Hiking! 🌿🏔️**