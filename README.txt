UNTIRTA - PERJALANAN LIMA KAMPUS
================================
Cara membuka: klik dua kali index.html (Chrome, Edge, Firefox, atau Safari terbaru).
Animasi 3D berjalan tanpa internet. Internet hanya dipakai untuk font Plus Jakarta Sans
dan tautan ke SPADA, SIAKANG, serta untirta.ac.id.

Isi folder
  index.html        kerangka halaman
  css/style.css     seluruh tampilan, termasuk tampilan ponsel (@media max-width:820px)
  js/data.js        DATA kampus, fakultas, prodi, gedung, dan alamat (ubah di sini)
  js/app.js         teks hero, langkah 01-05, kartu kampus, dan jendela "Tentang"
  js/scene.js       dunia 3D (bangunan, lobi, rombongan berjalan) memakai Three.js
  js/three.min.js   Three.js r128 (lisensi MIT)
  assets/           logo dan ilustrasi lima kampus

Mengubah data: buka js/data.js. K[i] berisi teks hero dan daftar ruang di lobi,
ABOUT[i] berisi isi jendela "Tentang" (penjelasan, prodi, gedung, kontak).
Data prodi dan pembagian kampus belum diverifikasi dengan sumber resmi.
Periksa kembali di https://untirta.ac.id/
