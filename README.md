# 🌿 EcoTrail - Nature Exploration & Tracking App

## 📱 About The Project

**EcoTrail** is a mobile application for nature enthusiasts in Sri Lanka. Users can discover hiking trails, document wildlife sightings, and track their adventures using GPS.

### 🎯 Course Information
- **Module:** ITS 2127 - Advanced Mobile Developer (AMD)
- **Institution:** IJSE
- **Year:** 2026

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Login/Register with Firebase Auth |
| 🏔️ **Trail Management** | Add, View, Edit, Delete trails |
| 🗺️ **GPS & Maps** | Live location tracking |
| 📸 **Species Log** | Document wildlife with camera |
| 👤 **Profile** | User stats and settings |

---

## 🛠️ Tech Stack

- **Frontend:** React Native + Expo
- **Backend:** Firebase (Auth, Firestore)
- **Storage:** Cloudinary
- **State Management:** React Context API
- **Navigation:** Expo Router (Stack + Tabs)

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI

### Step 1: Clone Repository

```bash
git clone https://github.com/hansani2004/EcoTrail.git
cd EcoTrail
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Firebase Setup

1. Create project on [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy config to `services/firebase.js`

### Step 4: Cloudinary Setup

1. Create account on [Cloudinary](https://cloudinary.com/)
2. Copy Cloud Name
3. Update `services/upload.js`

### Step 5: Run App

```bash
npx expo start
```

### Step 6: Build APK

```bash
eas build -p android --profile preview
```

---

## 📁 Project Structure

```
EcoTrail/
├── app/
│   ├── (auth)/          # Login/Register
│   ├── (tabs)/          # Main screens
│   └── trail/           # Trail CRUD
├── context/             # State management
├── services/            # Firebase, APIs
└── assets/              # Images
```

---

## 👨‍💻 Developer

- **Hansani** - [GitHub](https://github.com/hansani2004)

**Happy Hiking! 🌿🏔️**