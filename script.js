/* =========================================
   SETTINGS
========================================= */

// Maksimal foto yang akan dicek
const MAX_PHOTOS = 5000;

// FORMAT FOTO
// PNG = 1.png, 2.png, 3.png, dst.
const PHOTO_EXTENSION = "png";

// Jumlah foto yang dicek sekaligus
const BATCH_SIZE = 25;


/* =========================================
   VARIABLES
========================================= */

const galleryGrid =
  document.getElementById("galleryGrid");

const galleryLoading =
  document.getElementById("galleryLoading");

const music =
  document.getElementById("music");

const photoViewer =
  document.getElementById("photoViewer");

const viewerImage =
  document.getElementById("viewerImage");

const viewerCounter =
  document.getElementById("viewerCounter");


let photos = [];

let currentPhotoIndex = 0;


/* =========================================
   PAGE NAVIGATION
========================================= */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const page =
    document.getElementById(pageName);

  if (page) {

    page.classList.add("active");

  }


  // Mulai musik setelah user melakukan klik
  startMusic();

}


/* =========================================
   MUSIC
========================================= */

function startMusic() {

  if (!music) return;

  music.volume = 0.5;

  const promise =
    music.play();

  if (promise !== undefined) {

    promise.catch(() => {
      // Browser memblokir autoplay.
      // Akan dicoba lagi saat user klik.
    });

  }

}


/* =========================================
   CEK FOTO PNG
========================================= */

function checkPhoto(number) {

  return new Promise(resolve => {

    const img = new Image();

    const src =
      `${number}.${PHOTO_EXTENSION}`;

    img.onload = () => {

      resolve({
        number: number,
        src: src
      });

    };

    img.onerror = () => {

      resolve(null);

    };

    img.src = src;

  });

}


/* =========================================
   LOAD GALLERY
========================================= */

async function loadGallery() {

  galleryLoading.style.display =
    "block";

  galleryLoading.textContent =
    "Loading memories...";

  let missingStreak = 0;

  const MAX_MISSING =
    100;


  for (
    let start = 1;
    start <= MAX_PHOTOS;
    start += BATCH_SIZE
  ) {

    const end =
      Math.min(
        start + BATCH_SIZE - 1,
        MAX_PHOTOS
      );


    const promises = [];


    for (
      let number = start;
      number <= end;
      number++
    ) {

      promises.push(
        checkPhoto(number)
      );

    }


    const results =
      await Promise.all(promises);


    let foundInBatch = 0;


    results.forEach(photo => {

      if (photo) {

        photos.push(photo);

        foundInBatch++;

        missingStreak = 0;

        createPhotoElement(photo);

      } else {

        missingStreak++;

      }

    });


    /*
      Kalau sudah ketemu banyak nomor kosong
      berturut-turut, anggap foto sudah habis.

      Jadi tidak perlu mengecek sampai 5000
      kalau sebenarnya cuma ada 100 foto.
    */

    if (
      missingStreak >= MAX_MISSING
    ) {

      break;

    }


    // Beri sedikit waktu browser
    // supaya halaman tidak terlalu berat
    await new Promise(
      resolve =>
        setTimeout(resolve, 10)
    );

  }


  galleryLoading.style.display =
    "none";


  if (photos.length === 0) {

    galleryLoading.style.display =
      "block";

    galleryLoading.textContent =
      "Belum ada foto ditemukan.";

  }

}


/* =========================================
   CREATE PHOTO
========================================= */

function createPhotoElement(photo) {

  const img =
    document.createElement("img");

  img.className =
    "photo";

  img.src =
    photo.src;

  img.alt =
    `Photo ${photo.number}`;

  img.loading =
    "lazy";

  img.decoding =
    "async";


  img.addEventListener(
    "click",
    () => {

      const index =
        photos.findIndex(
          item =>
            item.number === photo.number
        );

      if (index !== -1) {

        openPhoto(index);

      }

    }
  );


  galleryGrid.appendChild(img);

}


/* =========================================
   OPEN PHOTO
========================================= */

function openPhoto(index) {

  if (
    index < 0 ||
    index >= photos.length
  ) {

    return;

  }


  currentPhotoIndex =
    index;


  updateViewer();


  photoViewer.classList.add(
    "active"
  );


  document.body.style.overflow =
    "hidden";

}


/* =========================================
   UPDATE VIEWER
========================================= */

function updateViewer() {

  const photo =
    photos[currentPhotoIndex];

  if (!photo) return;


  viewerImage.src =
    photo.src;


  viewerCounter.textContent =
    `${currentPhotoIndex + 1} / ${photos.length}`;

}


/* =========================================
   NEXT PHOTO
========================================= */

function showNextPhoto() {

  if (!photos.length) return;


  currentPhotoIndex++;

  if (
    currentPhotoIndex >=
    photos.length
  ) {

    currentPhotoIndex = 0;

  }


  updateViewer();

}


/* =========================================
   PREVIOUS PHOTO
========================================= */

function showPreviousPhoto() {

  if (!photos.length) return;


  currentPhotoIndex--;

  if (
    currentPhotoIndex < 0
  ) {

    currentPhotoIndex =
      photos.length - 1;

  }


  updateViewer();

}


/* =========================================
   CLOSE VIEWER
========================================= */

function closeViewer() {

  photoViewer.classList.remove(
    "active"
  );


  viewerImage.src = "";


  document.body.style.overflow =
    "hidden";

}


/* =========================================
   KEYBOARD
========================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      !photoViewer.classList.contains(
        "active"
      )
    ) {

      return;

    }


    if (
      event.key === "ArrowRight"
    ) {

      showNextPhoto();

    }


    if (
      event.key === "ArrowLeft"
    ) {

      showPreviousPhoto();

    }


    if (
      event.key === "Escape"
    ) {

      closeViewer();

    }

  }
);


/* =========================================
   MOBILE SWIPE
========================================= */

let touchStartX = 0;
let touchEndX = 0;


photoViewer.addEventListener(
  "touchstart",
  event => {

    touchStartX =
      event.changedTouches[0].screenX;

  },
  { passive: true }
);


photoViewer.addEventListener(
  "touchend",
  event => {

    touchEndX =
      event.changedTouches[0].screenX;

    handleSwipe();

  },
  { passive: true }
);


function handleSwipe() {

  const difference =
    touchStartX - touchEndX;


  // Geser kiri
  if (
    difference > 50
  ) {

    showNextPhoto();

  }


  // Geser kanan
  if (
    difference < -50
  ) {

    showPreviousPhoto();

  }

}


/* =========================================
   CLICK OUTSIDE PHOTO
========================================= */

photoViewer.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      photoViewer
    ) {

      closeViewer();

    }

  }
);


/* =========================================
   START MUSIC ON FIRST CLICK
========================================= */

document.addEventListener(
  "click",
  () => {

    startMusic();

  },
  {
    once: true
  }
);


/* =========================================
   START GALLERY
========================================= */

loadGallery();
