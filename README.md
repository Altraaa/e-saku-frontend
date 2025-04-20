 # Proyek Vite + React + shadcn/ui

Ini adalah proyek Front End menggunakan framework Vite dan React yang telah di-clone dari Git. Proyek ini juga menggunakan **shadcn/ui** untuk komponen UI yang elegan dan mudah digunakan.

## Prasyarat

Pastikan Anda telah menginstal alat berikut di komputer Anda:

- **Node.js 22.13.1**: Versi yang digunakan dalam proyek ini.

- **Git**: Untuk meng-clone repository.

- **Node.js dan npm**: Untuk mengelola dependensi dan menjalankan proyek ini.

## Instalasi

1. **Clone Repository**

   Clone repository ini dengan perintah berikut:

   ```bash
   git clone https://gitlab.com/username/proyek-react.git
   ```

2. **Masuk ke Direktori Proyek**

   Pindah ke dalam direktori proyek yang baru saja di-clone:

   ```bash
   cd e-saku
   ```

3. **Instal Dependensi**

   Instal semua dependensi yang diperlukan menggunakan npm:

   ```bash
   npm install
   ```

4. **Instal shadcn/ui**

   Tambahkan shadcn/ui ke proyek dengan perintah berikut:

   ```bash
   npx shadcn-ui@latest init
   ```

   Lalu tambahkan komponen yang diperlukan, misalnya:

   ```bash
   npx shadcn-ui@latest add button
   ```

5. **Jalankan Proyek**

   Jalankan server pengembangan Vite dengan perintah:

   ```bash
   npm start
   ```

   Server akan berjalan di `http://localhost:5173`.

## Akses Aplikasi

Buka browser dan akses aplikasi Anda di `http://localhost:5173`.

## Masalah Umum

Jika Anda mengalami masalah saat instalasi atau menjalankan proyek, pastikan:

- Node.js dan npm sudah terinstal dengan versi terbaru.
- Semua dependensi sudah terinstal dengan benar.
- Coba jalankan `npm install` ulang jika ada error terkait dependensi.

Jika masalah masih berlanjut, hubungi pengelola proyek atau lihat dokumentasi resmi dari [Vite](https://vitejs.dev/) dan [shadcn/ui](https://ui.shadcn.com/).

