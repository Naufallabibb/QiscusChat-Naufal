# Qiscus Chat Application - Technical Assessment

## 📋 Deskripsi Proyek

Aplikasi chat modern berbasis Vue 3 yang dikembangkan sebagai bagian dari technical assessment Qiscus. Aplikasi ini mendukung obrolan pribadi (single chat) dan obrolan grup dengan fitur lengkap seperti pengiriman media (gambar, video, PDF), auto-reply, dan search functionality.

## 🎯 Penyelesaian Technical Assessment

### ✅ Poin 1: Diagram Sistem Chatting

**Status:** Selesai ✓

Diagram sistem chatting untuk obrolan grup dan obrolan pribadi telah dibuat dan dilampirkan di:

- **File:** `public/qiscus_flow.png`
- Diagram menunjukkan arsitektur sistem yang mendukung:
  - Single chat (one-to-one messaging)
  - Group chat (multi-participant messaging)
  - Message flow dari client ke server

### ✅ Poin 2: Struktur Basis Data (ERD)

**Status:** Selesai ✓

Entity-Relationship Diagram (ERD) untuk struktur database telah dibuat dan dilampirkan di:

- **File:** `public/qiscus_erd.png`

#### Database Structure Overview:

**Entitas Utama:**

1. **Users** - Menyimpan informasi pengguna
   - Primary Key: user_id
   - Atribut: name, email (unique), password, avatar_url, timestamps
   - Relasi: Dapat join ke banyak chat rooms
2. **Chat Rooms** - Menyimpan informasi room chat
   - Primary Key: room_id
   - Atribut: room_name, is_group (boolean untuk membedakan single/group chat), timestamps
   - Relasi: Memiliki banyak members dan messages
3. **Chat Room Members** - Tabel junction untuk relasi many-to-many
   - Primary Key: member_id
   - Foreign Keys: room_id, user_id
   - Atribut: joined_at
   - Fungsi: Menghubungkan users dengan chat rooms mereka
4. **Messages** - Menyimpan semua pesan
   - Primary Key: message_id
   - Foreign Keys: room_id, user_id
   - Atribut: message_type ('text', 'image', 'video', 'pdf'), content, created_at
   - Relasi: Dapat memiliki attachments
5. **Attachments** - Menyimpan file media
   - Primary Key: attachment_id
   - Foreign Key: message_id
   - Atribut: file_url, file_type (MIME), file_size, uploaded_at
   - Fungsi: Menyimpan informasi file yang dilampirkan pada messages

#### Relasi Antar Entitas:

- **Users ↔ Chat Rooms** : Many-to-Many (melalui Chat Room Members)
- **Chat Rooms ↔ Messages** : One-to-Many (satu room memiliki banyak messages)
- **Users ↔ Messages** : One-to-Many (satu user dapat mengirim banyak messages)
- **Messages ↔ Attachments** : One-to-One atau One-to-Many (satu message dapat memiliki attachment)

### ✅ Poin 3: Antarmuka Chat dengan Dummy JSON

**Status:** Selesai ✓

Antarmuka chat responsif telah dikembangkan menggunakan:

- **Data Source:** `public/dummy-data.json` (dari [bit.ly/chat_room_endpoint](https://bit.ly/chat_room_endpoint))
- **Framework:** Vue 3 + Tailwind CSS
- **Fitur:** Fully responsive untuk web dan mobile

### ✅ Poin 4: Format JSON untuk Tipe Pesan Lain

**Status:** Selesai ✓

Format JSON telah dikembangkan untuk mendukung berbagai tipe pesan:

- **File:** `public/extended-data.json`
- **Tipe Pesan Didukung:**
  - Text messages
  - Image messages (dengan preview)
  - Video messages (dengan player)
  - PDF documents (dengan download)

### ✅ Poin 5: Implementasi Tampilan Media

**Status:** Selesai ✓

Halaman antarmuka chat telah dikembangkan untuk menampilkan semua tipe pesan:

- Komponen: `MessageBubble.vue`, `MediaPreview.vue`
- Mendukung preview, download, dan playback media

---

## 🚀 Cara Instalasi

### Prasyarat

- Node.js versi 16 atau lebih tinggi
- npm atau yarn package manager
- Git

### Langkah Instalasi via Terminal

bash

```bash
# 1. Clone Repository
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal
$ git clone https://github.com/Naufallabibb/QiscusChat-Naufal.git

# 2. Masuk ke direktori project
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal
$ cd QiscusChat-Naufal

# 3. Install dependencies
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal/QiscusChat-Naufal
$ npminstall

# 4. Jalankan development server
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal/QiscusChat-Naufal
$ npm run dev

# Aplikasi akan berjalan di http://localhost:5173
```

### Build untuk Production

bash

```bash
# Build project
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal/QiscusChat-Naufal
$ npm run build

# Preview production build
Naufal Labib@LAPTOP-TBGQTBKP MINGW64 /d/qiscus_naufal/QiscusChat-Naufal
$ npm run preview
```

---

## 📂 Struktur Proyek

```
QiscusChat-Naufal/
├── public/
│   ├── dummy-data.json          # Data chat dummy (dari bit.ly link)
│   ├── extended-data.json       # Data dengan media (image, video, PDF)
│   ├── qiscus_erd.png          # Entity Relationship Diagram
│   └── qiscus_flow.png         # Diagram sistem chatting
│   └── qiscus_title.png         # Icon title Qiscus
├── src/
│   ├── assets/
│   │   └── main.css            # Styling global dengan Qiscus theme
│   ├── components/
│   │   ├── ChatList.vue        # Daftar room chat
│   │   ├── ChatWindow.vue      # Window percakapan utama
│   │   ├── MessageBubble.vue   # Bubble pesan (text, image, video, PDF)
│   │   ├── MediaPreview.vue    # Preview modal untuk media
│   │   ├── NewChatModal.vue    # Modal untuk membuat chat baru
│   │   └── TypingIndicator.vue # Indikator typing
│   ├── composables/
│   │   ├── useChatMessages.js  # Logic manajemen pesan
│   │   ├── useFileUpload.js    # Logic upload file
│   │   └── useMessageSearch.js # Logic pencarian pesan
│   ├── services/
│   │   └── autoReplyService.js # Service auto-reply sistem
│   ├── utils/
│   │   ├── dateFormatter.js    # Utility format tanggal & ukuran file
│   │   └── messageIdGenerator.js # Generator ID unik untuk pesan
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Fitur Utama

### 1. **Manajemen Chat Room**

- Daftar room chat dengan preview pesan terakhir
- Support single chat dan group chat
- Unread message counter
- Search functionality untuk mencari room
- Auto-sort berdasarkan pesan terakhir

### 2. **Pengiriman Pesan**

#### A. Text Message

- Ketik pesan di input field
- Tekan Enter atau klik tombol kirim
- Support multi-line text dengan whitespace preservation
- Real-time update timestamp

#### B. Image Message

javascript

```javascript
// Cara mengirim gambar:
1.Klik icon paperclip(📎)
2.Pilih file gambar(JPG,PNG, dll)
3.Preview akan muncul
4.Tambahkancaption(opsional)
5.Klik "Kirim" atau tekan "Enter" pada keyboard
```

**Format JSON Image:**

json

```json
{
  "id": "msg_1234",
  "type": "image",
  "message": "Caption gambar (opsional)",
  "sender": "customer@mail.com",
  "timestamp": "2024-01-15T19:30:00Z",
  "attachment": {
    "url": "https://example.com/image.jpg",
    "file_name": "photo.jpg",
    "file_size": 456000,
    "mime_type": "image/jpeg"
  }
}
```

#### C. Video Message

javascript

```javascript
// Cara mengirim video:
1.Klik icon paperclip(📎)
2.Pilih file video(MP4,WebM, dll)
3.Preview dengan player akan muncul
4.Tambahkancaption(opsional)
5.Klik "Kirim" atau tekan "Enter" pada keyboard
```

**Format JSON Video:**

json

```json
{
  "id": "msg_1235",
  "type": "video",
  "message": "Caption video (opsional)",
  "sender": "agent@mail.com",
  "timestamp": "2024-01-15T19:31:00Z",
  "attachment": {
    "url": "https://example.com/video.mp4",
    "file_name": "demo.mp4",
    "file_size": 5242880,
    "mime_type": "video/mp4",
    "duration": 30,
    "thumbnail": "https://example.com/thumb.jpg"
  }
}
```

#### D. PDF Document

javascript

```javascript
// Cara mengirim PDF:
1.Klik icon paperclip(📎)
2.Pilih file PDF
3.Preview nama file akan muncul
4.Tambahkancaption(opsional)
5.Klik "Kirim" atau tekan "Enter" pada keyboard
```

**Format JSON PDF:**

json

```json
{
  "id": "msg_1236",
  "type": "pdf",
  "message": "Caption dokumen (opsional)",
  "sender": "customer@mail.com",
  "timestamp": "2024-01-15T19:32:00Z",
  "attachment": {
    "url": "https://example.com/document.pdf",
    "file_name": "document.pdf",
    "file_size": 1048576,
    "mime_type": "application/pdf",
    "page_count": 12
  }
}
```

### 3. **Auto-Reply System**

Sistem akan secara otomatis membalas pesan dengan delay realistis menggunakan **debouncing mechanism** .

**Fitur Auto-Reply:**

- **Typing Indicator:** Menampilkan animasi "..." sebelum pesan masuk
- **Smart Reply:** Respon disesuaikan dengan konteks pesan
- **Read Delay:** Simulasi waktu baca (2.5-3 detik)
- **Typing Duration:** Simulasi waktu mengetik (1.5-2.5 detik)
- **Debouncing:** Menghindari multiple reply pada pesan berturut-turut
- **Queue Management:** Membatalkan reply sebelumnya jika ada pesan baru

**Contoh Reply Pattern:**

javascript

```javascript
// Text patterns
"Halo" → "Halo! Ada yang bisa saya bantu? 😊"
"Terima kasih" → "Sama-sama! Senang bisa membantu 😊"
"?" → "Baik, biarkan saya cek informasinya dulu ya"
"pembayaran" → "Baik, terima kasih. Saya akan proses pembayaran Anda segera 💳"

// Media patterns
Image → "Terima kasih sudah mengirim fotonya 📸"
Video → "Video sudah diterima dengan baik 🎥"
PDF → "Dokumen sudah saya terima 📄"
```

**Cara Kerja Debouncing:**

javascript

```javascript
// autoReplyService.js
-Setiap room memiliki reply queue sendiri
-Pesan baru akan membatalkan reply yang sedang diproses
-Mencegah spam auto-reply
-Memastikan hanya satu reply aktif per room
```

### 4. **Message Search**

- Klik icon search (🔍) di header
- Ketik kata kunci untuk mencari pesan
- Real-time search dengan debouncing
- Navigasi hasil pencarian dengan arrow up/down
- Highlight kuning pada pesan yang cocok
- Counter menampilkan posisi hasil (contoh: 2/5)
- Auto-scroll ke pesan yang ditemukan

### 5. **New Chat**

javascript

```javascript
// Cara membuat chat baru:
1.Klik tombol "+" di header sidebar
2.Modal akan menampilkan daftar available users
3.Gunakan search untuk menemukan user
4.Klik user untuk memulai chat
5.Room baru otomatis dibuat dengan dataSource 'new-chat'
```

Data available users diambil dari `extended-data.json`:

json

```json
"available_users":[
{
"id":"user@mail.com",
"name":"User Name",
"avatar":"https://...",
"email":"user@mail.com",
"status":"online",
"role":"Role Name"
}
]
```

### 6. **Media Preview & Download**

- Klik pada gambar/video untuk preview full screen
- Tombol download tersedia di preview modal
- PDF auto-download saat diklik
- Close modal dengan klik di luar atau tombol X
- Support keyboard shortcut (ESC untuk close)

### 7. **Responsive Design**

- **Mobile (<768px):**
  - Full screen chat
  - Swipe back to list
  - Hamburger menu
  - Touch-optimized controls
- **Tablet (768px-1024px):**
  - Side-by-side view
  - Adjustable sidebar width
- **Desktop (>1024px):**
  - Optimal layout
  - Wide screen support
  - Hover effects

### 8. **Real-time Features**

- Live timestamp updates setiap detik
- Message status indicators (✓ sent, ✓✓ read)
- Online/offline status
- Typing indicators dengan animasi
- Smooth scroll ke pesan terbaru

### 9. **Data Management**

- **Lazy Loading:** Messages dimuat dari JSON sesuai kebutuhan
- **Memory Optimization:** Room yang tidak aktif tidak reload data
- **State Persistence:** Messages disimpan per room dalam memory
- **Auto-save:** Setiap perubahan langsung tersimpan di room state

---

## 🔧 Teknologi yang Digunakan

- **Frontend Framework:** Vue 3 (Composition API)
- **Styling:** Tailwind CSS 4.1.16 + Custom Qiscus Theme
- **Icons:** Font Awesome 7.1.0
- **Emoji Picker:** vue3-emoji-picker
- **Build Tool:** Vite
- **State Management:** Vue Composables (tidak menggunakan Vuex/Pinia)
- **Module Bundler:** ES Modules

---

## 📊 Data Source

### 1. Dummy Data (Basic Chat)

**File:** `public/dummy-data.json`

- Single chat antara customer dan agent
- Text messages only
- 5 pesan sample
- Digunakan untuk room chat "Agent A"

### 2. Extended Data (Full Features)

**File:** `public/extended-data.json`

- Group chat dengan multiple participants (5 orang)
- Mendukung text, image, video, dan PDF
- 27 pesan dengan berbagai tipe
- Available users untuk new chat (4 users)
- Digunakan untuk room "Product Qiscus Team"

### 3. Dynamic New Chat

- Data disimpan dalam memory saat runtime
- Support semua tipe pesan
- Auto-reply terintegrasi
- Participant management

**Cara Mengambil Data dari JSON:**

javascript

```javascript
// Di useChatMessages.js
constloadMessages=async()=>{
if(props.room.dataSource==='extended'){
const res =awaitfetch('/extended-data.json')
const data =await res.json()
    messages.value= data.results[0].comments
    roomData.value= data.results[0].room
}elseif(props.room.dataSource==='dummy'){
const res =awaitfetch('/dummy-data.json')
const data =await res.json()
    messages.value= data.results[0].comments.slice(0,5)
    roomData.value= data.results[0].room
}
}
```

---

## 🎨 Theme Customization

Aplikasi menggunakan Qiscus color scheme yang konsisten:

css

```css
:root {
  --qiscus-dark-blue: #1a7ba9;
  --qiscus-light-blue: #30b1ac;
  --qiscus-green: #85c66c;
  --qiscus-dark-blue-hover: #155f87;
  --qiscus-light-blue-hover: #288f8b;
  --qiscus-green-hover: #6fa857;
}
```

**Custom Classes** tersedia di `assets/main.css`:

- `.bg-qiscus-gradient` - Gradient background header
- `.bg-qiscus-light` - Light blue background
- `.bg-qiscus-dark` - Dark blue background
- `.bg-qiscus-green` - Green background (notifications)
- `.chat-bubble-own` - Bubble untuk pesan sendiri (gradient)
- `.chat-bubble-other` - Bubble untuk pesan orang lain (white)
- `.shadow-qiscus` - Shadow dengan warna Qiscus
- `.ring-qiscus-light` - Focus ring Qiscus colored

**Gradient Pattern:**

css

```css
.bg-qiscus-gradient {
  background: linear-gradient(135deg, var(--qiscus-dark-blue) 0%, var(--qiscus-light-blue) 100%);
}

.chat-bubble-own {
  background: linear-gradient(135deg, var(--qiscus-light-blue) 0%, var(--qiscus-green) 100%);
}
```

---

## 🧪 Testing Guide

### Manual Testing Checklist:

#### ✅ Chat Room Management

- [x] Tampilan daftar room dengan avatar dan initials fallback
- [x] Klik room untuk membuka chat
- [x] Search room functionality (nama & last message)
- [x] Unread count update dan reset saat buka room
- [x] Last message preview dan timestamp
- [x] Auto-sort room berdasarkan pesan terakhir
- [x] Group indicator icon pada group chat

#### ✅ Text Messages

- [x] Kirim pesan text sederhana
- [x] Terima auto-reply dengan delay
- [x] Typing indicator muncul sebelum reply
- [x] Timestamp format (HH:MM, Kemarin, Hari, DD/MM/YYYY)
- [x] Read status update (✓ sent, ✓✓ read after 1s)
- [x] Multi-line text support
- [x] Whitespace preservation

#### ✅ Image Messages

- [x] Upload gambar dari file picker
- [x] Preview modal dengan gambar penuh
- [x] Caption support (opsional)
- [x] Click untuk full preview
- [x] Download functionality
- [x] File size display
- [x] Auto-reply "Terima kasih sudah mengirim fotonya 📸"

#### ✅ Video Messages

- [x] Upload video
- [x] Video player dengan controls
- [x] Caption support
- [x] Play, pause, volume controls
- [x] Preload metadata
- [x] Duration display
- [x] Auto-reply "Video sudah diterima dengan baik 🎥"

#### ✅ PDF Documents

- [x] Upload PDF
- [x] Preview nama file dengan icon
- [x] Download berfungsi (browser support)
- [x] File size display
- [x] Page count (jika tersedia)
- [x] Hover effect pada PDF card
- [x] Auto-reply "Dokumen sudah saya terima 📄"

#### ✅ Search Functionality

- [x] Search bar toggle on/off
- [x] Highlight hasil pencarian (kuning)
- [x] Navigate dengan arrow up/down
- [x] Counter hasil (1/5, 2/5, dst)
- [x] Auto-scroll ke hasil
- [x] Clear search
- [x] Search reset saat ganti room

#### ✅ New Chat

- [x] Modal terbuka dengan daftar available users
- [x] User list dengan avatar dan info
- [x] Search user (nama, email, role)
- [x] Create chat baru
- [x] Room baru muncul di top list
- [x] Filter user yang sudah ada chat

#### ✅ Auto-Reply System

- [x] Delay realistis (2.5-3s read + 1.5-2.5s typing)
- [x] Typing indicator dengan animasi
- [x] Smart reply berdasarkan keyword
- [x] Debouncing (cancel reply lama saat pesan baru)
- [x] Queue management per room
- [x] Reply hanya di room yang tepat

#### ✅ Responsive Design

- [x] Mobile layout (<768px)
  - Full screen chat
  - Back button muncul
  - Touch-friendly controls
- [x] Tablet layout (768px-1024px)
  - Side-by-side view
  - Sidebar visible
- [x] Desktop layout (>1024px)
  - Optimal spacing
  - Hover effects
- [x] Orientation change handling

#### ✅ Media Preview

- [x] Full screen modal untuk image/video
- [x] Close button (X)
- [x] Download button
- [x] Click outside untuk close
- [x] Escape key untuk close
- [x] Prevent body scroll saat modal aktif

#### ✅ Edge Cases

- [x] Empty room (belum ada pesan)
- [x] Long text wrapping
- [x] Multiple media dalam satu room
- [x] Rapid message sending
- [x] Large file handling
- [x] Network error handling
- [x] Invalid file type handling

---

## 🐛 Known Issues & Limitations

### Current Limitations:

1. **Storage:**
   - Pesan disimpan dalam memory (in-memory)
   - Data hilang saat refresh/reload
   - Tidak ada localStorage/sessionStorage integration
2. **Real-time:**
   - Tidak ada WebSocket connection
   - Menggunakan simulasi dengan setTimeout
   - Auto-reply hanya client-side simulation
3. **File Upload:**
   - File dikonversi ke base64 data URL
   - Tidak diunggah ke server
   - Large files dapat menyebabkan memory issues
   - Max recommended file size: 5MB
4. **Authentication:**
   - Tidak ada sistem login/register
   - User hardcoded sebagai "Naufal Labib"
   - Email: [customer@mail.com](mailto:customer@mail.com)
5. **Persistence:**
   - Room messages tidak persist antar session
   - New chat hilang saat refresh
   - No backend integration

### Future Improvements:

- [ ] Backend API integration
- [ ] WebSocket untuk real-time messaging
- [ ] Actual file upload ke cloud storage
- [ ] User authentication system
- [ ] IndexedDB untuk local persistence
- [ ] Push notifications
- [ ] Voice messages

---

## 📝 Notes untuk Evaluator

### Keputusan Teknis & Alasan:

1. **No Backend - Fully Frontend:**
   - Fokus pada UI/UX implementation
   - Memudahkan deployment dan testing
   - Demonstrasi Vue 3 capabilities
2. **Composables over Vuex/Pinia:**
   - Memanfaatkan Vue 3 Composition API
   - Lebih modular dan reusable
   - Easier testing dan maintenance
   - Smaller bundle size
3. **Memory Storage (No Persistence):**
   - Trade-off antara complexity dan implementation time
   - Fokus pada core features demonstration
   - Easier state management untuk prototype
4. **Auto-reply Simulation:**
   - Demonstrasi message flow
   - Typing indicator implementation
   - Debouncing mechanism showcase
5. **Base64 File Handling:**
   - No backend required
   - Immediate preview capability
   - Simplifies demo deployment

### Code Quality Highlights:

✨ **Clean Architecture:**

- Separation of concerns (components, composables, services, utils)
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)

✨ **Reusable Composables:**

- `useChatMessages` - Message management logic
- `useFileUpload` - File handling logic
- `useMessageSearch` - Search functionality logic

✨ **Error Handling:**

- Try-catch blocks pada async operations
- Fallback untuk missing data
- User-friendly error messages

✨ **Performance Optimization:**

- Lazy loading messages
- Debouncing untuk search dan auto-reply
- Event delegation
- Computed properties untuk filtering

✨ **Responsive & Accessible:**

- Mobile-first approach
- Touch-friendly controls
- Keyboard navigation support
- Semantic HTML
- ARIA labels (dapat ditingkatkan)

✨ **Smooth UX:**

- Loading states
- Typing indicators
- Smooth animations (Tailwind transitions)
- Auto-scroll to latest message
- Optimistic UI updates

✨ **Code Consistency:**

- Consistent naming conventions
- Proper Vue 3 Composition API patterns
- ESLint ready
- Comment untuk complex logic

---

## 🚀 Deployment

### Recommended Platforms:

1. **Vercel** (Recommended)

bash

```bash
npminstall -g vercel
   vercel --prod
```

2. **Netlify**

bash

```bash
npm run build
# Upload dist folder to Netlify
```

3. **GitHub Pages**

bash

```bash
npm run build
# Push dist folder ke gh-pages branch
```

### Environment Configuration:

javascript

```javascript
// vite.config.js sudah dikonfigurasi untuk deployment
exportdefaultdefineConfig({
  base: './', // Relative path untuk assets
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

---

## 👨‍💻 Developer

**Naufal Labib**

- GitHub: [Naufallabibb](https://github.com/Naufallabibb/QiscusChat-Naufal)
- Project: Qiscus Technical Assessment for Web Developer Intern
- Tahun: Oktober 2025

---

## 📄 License

This project is created for **Qiscus Technical Assessment** purposes only.

---

### 🙏 Acknowledgments

Terima kasih kepada tim **Qiscus** atas kesempatan technical assessment ini.

### ✅ Completion Summary

Semua poin technical assessment telah diselesaikan dengan lengkap:

**Poin 1: Diagram Sistem Chatting (Group & Single Chat)**

- Status: ✅ **Selesai**
- File: `public/qiscus_flow.png`
- Deskripsi: Diagram lengkap sistem chatting yang mendukung obrolan grup dan pribadi

**Poin 2: Entity-Relationship Diagram (ERD)**

- Status: ✅ **Selesai**
- File: `public/qiscus_erd.png`
- Deskripsi: Struktur basis data dengan 5 entitas utama (Users, Chat Rooms, Chat Room Members, Messages, Attachments)

**Poin 3: Antarmuka Chat Responsif dengan Dummy JSON**

- Status: ✅ **Selesai**
- Implementasi: Seluruh aplikasi
- Data Source: `public/dummy-data.json` (dari bit.ly/chat_room_endpoint)
- Deskripsi: Antarmuka chat yang fully responsive untuk web dan mobile

**Poin 4: Format JSON untuk Image, Video, PDF**

- Status: ✅ **Selesai**
- File: `public/extended-data.json`
- Deskripsi: Format JSON yang mendukung pesan teks, gambar, video, dan PDF dengan metadata lengkap

**Poin 5: Implementasi Tampilan Media (Image, Video, PDF)**

- Status: ✅ **Selesai**
- Components: `MessageBubble.vue`, `MediaPreview.vue`
- Deskripsi: Tampilan media dengan preview, download, dan playback functionality

### Bonus Features Implemented:

Selain requirement utama, aplikasi ini juga dilengkapi dengan:

- ✨ **Auto-reply System** dengan typing indicator dan debouncing mechanism
- ✨ **Message Search** dengan highlight, navigation, dan counter
- ✨ **New Chat Creation** dengan user selection modal dan search
- ✨ **Media Preview & Download** full screen modal
- ✨ **Emoji Picker** integration untuk input pesan
- ✨ **Read Status Indicators** (✓ sent, ✓✓ read)
- ✨ **Fully Responsive** design (mobile, tablet, desktop)
- ✨ **Smart File Handling** dengan preview dan metadata display
- ✨ **Smooth Animations** dan transitions di seluruh UI

**Code Quality:** Production-ready prototype

**Documentation:** Comprehensive README

---

**Last Updated:** Oktober 2025

---

## 📞 Contact

Jika ada pertanyaan atau klarifikasi mengenai project ini, silakan hubungi:

- **Email:** muhammadnaufallabibramadhan@gmail.com

---

## 📄 License

This project is created for **Qiscus Technical Assessment** purposes.

Copyright © 2025 Naufal Labib. All rights reserved.

---

## 🎯 Final Notes

### Submission Checklist:

✅ **Semua 5 poin technical assessment telah diselesaikan**

- Diagram sistem chatting (Group & Single Chat)
- ERD struktur database
- Antarmuka chat responsif
- Format JSON untuk media
- Implementasi tampilan media

✅ **Dokumentasi lengkap**

- README.md dengan panduan instalasi
- Penjelasan fitur-fitur
- Code structure documentation

✅ **Source code berkualitas**

- Clean code architecture
- Reusable components
- Error handling
- Performance optimization

✅ **Bonus features**

- Auto-reply system
- Search functionality
- Media handling
- Responsive design

### Project Highlights:

🌟 **Modern Tech Stack:** Vue 3 + Vite + Tailwind CSS
🌟 **Clean Architecture:** Composables pattern, separation of concerns
🌟 **User Experience:** Smooth animations, intuitive UI, responsive design
🌟 **Code Quality:** Production-ready, well-documented, maintainable
🌟 **Feature Complete:** Semua requirement + bonus features

---

**Terima kasih telah mengevaluasi project ini!** 🙏

Saya sangat antusias dengan kesempatan untuk bergabung dengan tim Qiscus dan berkontribusi dalam mengembangkan solusi komunikasi yang inovatif.

Jika ada pertanyaan atau memerlukan klarifikasi lebih lanjut mengenai implementasi, saya siap untuk berdiskusi lebih lanjut.
