Berikut adalah template lengkap **`README.md`** untuk dokumentasi proyekmu. Sudah disesuaikan dengan struktur proyek, dependensi, API, dan tujuan aplikasi **"Monitoring Rumah Hatch & Carry PTPN IV Regional 1 Medan"**.

---

## 🏡 Hatch & Carry Monitoring Dashboard

Aplikasi dashboard berbasis React + Leaflet untuk memonitor lokasi rumah Hatch & Carry di kebun-kebun milik **PTPN IV Regional 1 Medan**. Dibangun dengan autentikasi, manajemen user berbasis role, tampilan interaktif peta, dan admin panel.

🎯 **Live App:**  
🔗 [https://hatch-carry-n4r1.web.app/](https://hatch-carry-n4r1.web.app/)

> Dibangun oleh [Afif Hamzah](https://linkedin.com/in/afifhamzah17)

---

## 🚀 Fitur Utama

* 🔐 Login, Register, dan manajemen profil pengguna
* 🗺️ Peta interaktif menggunakan Leaflet.js
* 🧭 Fitur `flyTo` untuk fokus ke titik rumah tertentu
* 📂 Sidebar daftar distrik, kebun, dan rumah
* 🧑‍💼 Panel admin untuk manajemen pengguna
* 🖼️ Halaman galeri untuk dokumentasi visual
* 🎨 Animasi halaman dengan Framer Motion
* ☁️ Terhubung dengan backend API (Firebase Cloud Run)

---

## 📁 Struktur Folder

```
src/
│   App.jsx
│   main.jsx
│   styles.css
│
├───assets
│       react.svg
│
├───components
│       CustomImageList.jsx
│       DashboardChart.jsx
│
├───data
│       kebun.json
│
├───pages
│       AdminPanel.jsx
│       AdminRoute.jsx
│       DashboardLayout.jsx
│       DashboardMenu.jsx
│       GaleryPage.jsx
│       Header.jsx
│       LoginPage.jsx
│       MapView.jsx
│       Navbar.jsx
│       ProfilePage.jsx
│       RegisterPage.jsx
│       Sidebar.jsx
│       sidebars.jsx
│       UserManagement.jsx
│
└───utils
        api.js
        jwt.js
```
---

## 🔧 Teknologi & Library

| Teknologi      | Keterangan                   |
| -------------- | ---------------------------- |
| React          | UI Library utama             |
| React Router   | Routing dan proteksi halaman |
| Leaflet.js     | Peta interaktif              |
| Tailwind CSS   | Styling responsif & cepat    |
| Framer Motion  | Animasi antar halaman        |
| React Toastify | Notifikasi                   |
| Vite           | Build tool super cepat       |

---

## 🔐 API Endpoint (Firebase Cloud Run)

Base URL:

```
https://hatch-carry-api-307703218179.us-central1.run.app/api
```

### 🔑 Auth

| Endpoint         | Method | Description   |
| ---------------- | ------ | ------------- |
| `/auth/register` | POST   | Register user |
| `/auth/login`    | POST   | Login user    |

### 👤 Profile

| Endpoint          | Method | Description      |
| ----------------- | ------ | ---------------- |
| `/profile`        | GET    | Get user profile |
| `/profile/avatar` | POST   | Upload avatar    |

### 🧑‍💼 Admin

| Endpoint        | Method | Description      |
| --------------- | ------ | ---------------- |
| `/admin`        | GET    | Get admin info   |
| `/users`        | GET    | List semua user  |
| `/users/:email` | PUT    | Update user info |
| `/users/:email` | DELETE | Hapus user       |

---

## 📌 MapView Logic

* Data dibaca dari `src/data/kebun.json`.
* Dikelompokkan per distrik → kebun → rumah.
* Rumah hanya ditampilkan jika memiliki `coords` valid.
* Sidebar tetap menampilkan `kebun` meskipun jumlah rumah = 0.
* Marker Leaflet hanya muncul jika `coords` valid.

Contoh data:

```json
{
  "distrik": "DISTRIK MERANTI , TUJUH",
  "singkatan_distrik": "1DMT",
  "kode": "1KSM",
  "unit": "A",
  "nama_kebun": "KEBUN SEI MERANTI",
  "luas_ha": 7152.63,
  "inventaris": 981886,
  "rumah": 1,
  "coords": [1.6214, 100.3244]
}
```

---

## 🧪 Cara Menjalankan di Local

1. **Clone project**

   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Jalankan development server**

   ```bash
   npm run dev
   ```

4. **Buka di browser**

   ```
   http://localhost:5173
   ```

---

## 🧱 Build untuk Production

```bash
npm run build
```

File hasil akan ada di folder `dist/`.

Jika ingin deploy ke Firebase Hosting:

```bash
npm run build
firebase deploy
```

---

## 🗺️ Peta Marker Tidak Muncul?

Pastikan:

* `coords` adalah array `[lat, lng]`
* Nilainya bertipe number, bukan string
* Tidak ada nilai `null`, `undefined`, atau `[]`

---

## 🔐 Fitur Admin

* Hanya user dengan role `admin` yang dapat mengakses:

  * `/app/admin`
  * `/app/admin/users`
* Proteksi dilakukan melalui komponen `AdminRoute.jsx`

---

## 📸 Fitur Galeri (GalleryPage)

* Menampilkan gambar atau dokumentasi proyek
* Lokasi: `/app/gallery`
* Gambar bisa ditambahkan dari local folder `assets/` atau API terpisah (opsional)

---

## 💡 Rencana Pengembangan

* ✅ Otentikasi login/register
* ✅ Sidebar dinamis distrik & kebun
* ✅ FlyTo marker
* 🔲 Upload data `coords` dari panel admin
* 🔲 Tambah fitur pencarian titik rumah
* 🔲 Simpan data kebun di Firestore
* 🔲 Fitur ekspor CSV
* 🔲 Akses mobile yang lebih optimal

---

## 👨‍💻 Kontributor

**Afif Hamzah**
[LinkedIn](https://linkedin.com/in/afifhamzah17)
[GitHub](https://github.com/afifhamzah17)
[Instagram](https://instagram.com/afifhamzah17)

