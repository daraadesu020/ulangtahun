// =========================================
// ANIMASI BUNGA TULIP — DIDEFINISIKAN DI ATAS SUPAYA SELALU TERSEDIA
// =========================================
function tampilkanBungaTulip(x, y) {
    const jumlahTulip = 12;
    const warnaTulip = ['#ffb6d9', '#ffffff', '#d88ab5', '#aee2ff'];

    for (let i = 0; i < jumlahTulip; i++) {
        const tulip = document.createElement('span');
        tulip.classList.add('tulip-bunga');
        tulip.textContent = '🌷';

        tulip.style.position = 'fixed';
        tulip.style.left = x + 'px';
        tulip.style.top = y + 'px';
        tulip.style.zIndex = '9999';
        tulip.style.color = warnaTulip[Math.floor(Math.random() * warnaTulip.length)];
        tulip.style.pointerEvents = 'none';

        const sudut = Math.random() * 2 * Math.PI;
        const jarak = 60 + Math.random() * 110;
        tulip.style.setProperty('--tx', Math.cos(sudut) * jarak + 'px');
        tulip.style.setProperty('--ty', Math.sin(sudut) * jarak + 'px');
        tulip.style.setProperty('--rot', (Math.random() * 360 - 180) + 'deg');
        tulip.style.setProperty('--scale', 0.8 + Math.random() * 1);

        document.body.appendChild(tulip);
        tulip.addEventListener('animationend', () => tulip.remove());
    }
}

// === PENGATURAN MUSIK ===
const audio = document.getElementById("bg-music");
const iconMuted = document.getElementById("icon-muted");
const iconPlaying = document.getElementById("icon-playing");
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        iconPlaying.style.display = "none";
        iconMuted.style.display = "block";
    } else {
        audio.play();
        iconMuted.style.display = "none";
        iconPlaying.style.display = "block";
    }
    isPlaying = !isPlaying;
}

// Putar musik otomatis saat user nge-klik apapun di layar pertama kali
document.body.addEventListener('click', function() {
    if (!isPlaying) {
        audio.play().then(() => {
            isPlaying = true;
            iconMuted.style.display = "none";
            iconPlaying.style.display = "block";
        }).catch((e) => {
            console.log("Menunggu interaksi user untuk memutar musik.");
        });
    }
}, { once: true });

// === TRANSISI BUKA KEJUTAN ===

// Langkah 1: Saat tombol login diklik, sembunyikan halaman login
// dan tampilkan overlay surat + confetti
function bukaKejutan() {
    const loginSection = document.getElementById('login-section');
    const overlay = document.getElementById('bg-overlay');
    const envelopeOverlay = document.getElementById('envelope-overlay');

    // Fade out halaman login
    loginSection.style.opacity = '0';
    loginSection.style.transform = 'scale(0.95)';
    overlay.style.opacity = '0';

    setTimeout(() => {
        loginSection.style.display = 'none';
        overlay.style.display = 'none';

        // Tampilkan overlay surat + confetti
        envelopeOverlay.classList.add('show');
        mulaiConfetti();
    }, 800);
}

// Langkah 2: Saat surat diklik, mainkan animasi "buka surat"
// lalu fade out semuanya dan baru masuk ke halaman kejutan
function bukaSurat() {
    const envelopeWrap = document.getElementById('envelope-wrap');
    const envelopeOverlay = document.getElementById('envelope-overlay');

    // Kalau surat udah dibuka, jangan diulang lagi
    if (envelopeWrap.classList.contains('open')) return;

    // Animasi flap surat terbuka + kertas muncul
    envelopeWrap.classList.add('open');

    // Tunggu animasi buka surat selesai, baru fade out overlay
    setTimeout(() => {
        envelopeOverlay.classList.add('fade-out');
        hentikanConfetti();

        // Setelah overlay fade out, tampilkan halaman kejutan
        setTimeout(() => {
            envelopeOverlay.style.display = 'none';
            tampilkanHalamanKejutan();
        }, 600);
    }, 1100);
}

// Langkah 3: Tampilkan halaman kejutan (logic asli kamu)
function tampilkanHalamanKejutan() {
    const surpriseSection = document.getElementById('surprise-section');

    surpriseSection.style.display = 'block';

    // Fade in halaman kejutan
    setTimeout(() => {
        surpriseSection.style.opacity = '1';
        surpriseSection.style.transform = 'translateY(0)';
    }, 50);
}

// =========================================
// CONFETTI ANIMATION (CANVAS)
// =========================================
let confettiCtx, confettiCanvas, confettiPieces = [],
    confettiAnimId = null;

function mulaiConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    confettiCtx = confettiCanvas.getContext('2d');

    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);

    const warnaConfetti = ['#d88ab5', '#ffb6d9', '#ffd966', '#9be3de', '#ffffff'];

    confettiPieces = [];
    const jumlahConfetti = 120;

    for (let i = 0; i < jumlahConfetti; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            ukuran: Math.random() * 8 + 4,
            warna: warnaConfetti[Math.floor(Math.random() * warnaConfetti.length)],
            kecepatanY: Math.random() * 3 + 2,
            kecepatanX: Math.random() * 2 - 1,
            rotasi: Math.random() * 360,
            kecepatanRotasi: Math.random() * 6 - 3
        });
    }

    animasiConfetti();
}

function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

function animasiConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiPieces.forEach(p => {
        p.y += p.kecepatanY;
        p.x += p.kecepatanX;
        p.rotasi += p.kecepatanRotasi;

        // Kalau confetti udah lewat bawah layar, balikin ke atas lagi
        if (p.y > confettiCanvas.height) {
            p.y = -20;
            p.x = Math.random() * confettiCanvas.width;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotasi * Math.PI) / 180);
        confettiCtx.fillStyle = p.warna;
        confettiCtx.fillRect(-p.ukuran / 2, -p.ukuran / 2, p.ukuran, p.ukuran * 0.6);
        confettiCtx.restore();
    });

    confettiAnimId = requestAnimationFrame(animasiConfetti);
}

function hentikanConfetti() {
    if (confettiAnimId) {
        cancelAnimationFrame(confettiAnimId);
        confettiAnimId = null;
    }
    window.removeEventListener('resize', resizeConfettiCanvas);
}

// === FUNGSI SLIDER (GESER FOTO) ===
function geserKiri() {
    const slider = document.querySelector('.slider-container');

    // Animasi bump ke kiri sebelum geser
    slider.classList.remove('bump-kanan', 'bump-kiri');
    slider.classList.add('bump-kiri');
    slider.addEventListener('animationend', () => slider.classList.remove('bump-kiri'), { once: true });

    // 320 adalah estimasi lebar kotak foto + jarak antar foto
    slider.scrollBy({
        left: -320,
        behavior: 'smooth'
    });
}

function geserKanan() {
    const slider = document.querySelector('.slider-container');

    // Animasi bump ke kanan sebelum geser
    slider.classList.remove('bump-kanan', 'bump-kiri');
    slider.classList.add('bump-kanan');
    slider.addEventListener('animationend', () => slider.classList.remove('bump-kanan'), { once: true });

    slider.scrollBy({
        left: 320,
        behavior: 'smooth'
    });
}

// === EFEK BACKGROUND FADE OUT SAAT DI-SCROLL (SUDAH DIPERBAIKI) ===
window.addEventListener('scroll', function() {
    const surpriseSection = document.getElementById('surprise-section');

    // Script ini cuma jalan kalau Nana udah masuk ke halaman kejutan
    if (surpriseSection.style.display === 'block') {
        let posisiScroll = window.scrollY;

        // KUNCI PERUBAHAN: Di pixel ke-600 ke bawah, background putih akan 100% transparan
        let titikPudarMaksimal = 4000; // Bisa disesuaikan, semakin kecil semakin cepat pudar

        // Hitung transparansi: Mulai dari 1 (putih solid) perlahan ke 0 (transparan/nembus GIF)
        let alpha = 1 - (posisiScroll / titikPudarMaksimal);

        // Kunci nilainya biar nggak minus (karena rgba nggak bisa menerima nilai minus)
        if (alpha < 0) alpha = 0;

        // Terapkan warna background putih dengan transparansi yang jauh lebih cepat
        surpriseSection.style.backgroundColor = `rgba(250, 250, 250, ${alpha})`;
    }
});

// === FUNGSI KOLOM HARAPAN ===
function tambahHarapan(event) {
    // Mencegah browser me-reload halaman saat tombol ditekan
    event.preventDefault();

    const nameInput = document.getElementById('wish-name');
    const textInput = document.getElementById('wish-text');
    const wishesList = document.getElementById('wishes-list');

    // Cek kalau input kosong nggak bisa kirim
    if (nameInput.value.trim() === '' || textInput.value.trim() === '') return;

    // Bikin elemen kartu harapan baru secara dinamis
    const newWish = document.createElement('div');
    newWish.classList.add('wish-card');

    // Masukkan HTML ke dalam div baru
    newWish.innerHTML = `
        <h4>${nameInput.value}</h4>
        <p>${textInput.value}</p>
    `;

    // Masukkan kartu harapan baru ke posisi paling atas di dalam daftar
    wishesList.prepend(newWish);

    // Kosongkan kotak ketikan setelah berhasil dikirim
    nameInput.value = '';
    textInput.value = '';
}

// === FUNGSI POP-UP (MODAL) FOTO ===
const modal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const modalText = document.getElementById("modal-text");
const modalPrevBtn = document.getElementById("modal-prev");
const modalNextBtn = document.getElementById("modal-next");

// Daftar foto yang sedang aktif (gallery ATAU slider) + index foto yang dibuka
let currentGallery = [];
let currentIndex = 0;

// Fungsi buat nampilin foto berdasarkan index di currentGallery
function tampilkanFoto(index) {
    // Bikin index "looping" (kalau lewat batas, balik ke awal/akhir)
    if (index < 0) index = currentGallery.length - 1;
    if (index >= currentGallery.length) index = 0;

    currentIndex = index;
    const img = currentGallery[currentIndex];

    modalImg.src = img.src;

    // Cek teks yang ada di bawah gambar (tag <p>), kalau ada (khusus gallery grid)
    const text = img.nextElementSibling && img.nextElementSibling.tagName === 'P' ? img.nextElementSibling.innerHTML : "";
    modalText.innerHTML = text;
    modalText.style.display = text ? "block" : "none";
}

// Helper: ambil koordinat dari event click atau touch (mobile-friendly)
function getEventCoords(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

// Fungsi universal untuk pasang event buka modal + tulip pada sebuah img
function pasangEventFoto(img, idx, getGallery) {
    let lastTouchX = null,
        lastTouchY = null;

    img.addEventListener('touchstart', function(e) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }, { passive: true });

    img.addEventListener('touchend', function(e) {
        e.preventDefault();
        const x = e.changedTouches[0].clientX;
        const y = e.changedTouches[0].clientY;
        // Cek jari nggak geser jauh (bukan scroll)
        if (Math.abs(x - lastTouchX) < 10 && Math.abs(y - lastTouchY) < 10) {
            currentGallery = getGallery();
            modal.classList.add('show');
            tampilkanFoto(idx);
            tampilkanBungaTulip(x, y);
        }
    }, { passive: false });

    img.addEventListener('click', function(e) {
        currentGallery = getGallery();
        modal.classList.add('show');
        tampilkanFoto(idx);
        tampilkanBungaTulip(e.clientX, e.clientY);
    });
}

// 1. Logika buka pop-up dari Galeri Grid (Foto + Teks)
const mangaPanels = document.querySelectorAll('.gallery-grid .manga-panel img');
mangaPanels.forEach((img, idx) => {
    pasangEventFoto(img, idx, () => Array.from(mangaPanels));
});

// 2. Logika buka pop-up dari Image Slider (Foto Saja, tanpa teks)
const sliderItems = document.querySelectorAll('.slider-item img');
sliderItems.forEach((img, idx) => {
    pasangEventFoto(img, idx, () => Array.from(sliderItems));
});

// 3. Fungsi tutup pop-up (bisa dipanggil dari tombol X)
function tutupModal() {
    modal.classList.remove('show');
}

// 4. Tutup pop-up juga kalau user nge-klik di luar gambar (area background hitam)
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        tutupModal();
    }
});

// 5. Tombol Prev / Next di dalam modal
function modalSebelumnya(e) {
    e.stopPropagation(); // Biar nggak ke-anggep klik di luar gambar
    bumpModal('kiri');
    tampilkanFoto(currentIndex - 1);
}

function modalSelanjutnya(e) {
    e.stopPropagation();
    bumpModal('kanan');
    tampilkanFoto(currentIndex + 1);
}

// Animasi bump (gerak kecil ke kiri/kanan) sebelum foto modal berganti
function bumpModal(arah) {
    const content = document.getElementById('modal-img');
    const kelas = arah === 'kiri' ? 'bump-kiri' : 'bump-kanan';

    content.classList.remove('bump-kanan', 'bump-kiri');
    content.classList.add(kelas);
    content.addEventListener('animationend', () => content.classList.remove(kelas), { once: true });
}

modalPrevBtn.addEventListener('click', modalSebelumnya);
modalNextBtn.addEventListener('click', modalSelanjutnya);

// 6. Navigasi pakai tombol keyboard (kiri/kanan/escape)
document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('show')) return;

    if (e.key === 'ArrowLeft') {
        bumpModal('kiri');
        tampilkanFoto(currentIndex - 1);
    }
    if (e.key === 'ArrowRight') {
        bumpModal('kanan');
        tampilkanFoto(currentIndex + 1);
    }
    if (e.key === 'Escape') tutupModal();
});

// =========================================
// ANIMASI MUNCUL DARI BAWAH SAAT SCROLL
// =========================================
function pasangRevealScroll() {
    // Target: setiap foto di gallery grid & slider
    const targets = document.querySelectorAll('.gallery-grid .manga-panel, .slider-item');

    targets.forEach(el => el.classList.add('reveal-up'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Animasi cukup sekali aja

                // Munculkan tulip di tengah elemen yang baru kelihatan (khusus mobile/touch)
                if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
                    const rect = entry.target.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    tampilkanBungaTulip(cx, cy);
                }
            }
        });
    }, {
        threshold: 0.3
    });

    targets.forEach(el => observer.observe(el));
}

// Pasang observer begitu halaman kejutan ditampilkan
const _tampilkanHalamanKejutanAsli = tampilkanHalamanKejutan;
tampilkanHalamanKejutan = function() {
    _tampilkanHalamanKejutanAsli();
    setTimeout(pasangRevealScroll, 100);
};

// (fungsi tampilkanBungaTulip sudah didefinisikan di bagian atas file)