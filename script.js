/* =================================
   MUSIC
================================= */

const music =
    document.getElementById("music");


function startMusic() {

    music.volume = 0.35;

    music.play().catch(() => {

        console.log(
            "Musik menunggu interaksi pengguna."
        );

    });

}



/* =================================
   PAGE NAVIGATION
================================= */

function openPage(pageName) {

    startMusic();


    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const target =
        document.getElementById(pageName);


    target.classList.add("active");


    /*

       Kalau kembali ke Home,
       posisi Gallery dikembalikan
       ke bagian paling atas.

    */

    if (pageName === "home") {

        document
            .getElementById("gallery")
            .scrollTop = 0;

    }

}



/* =================================
   GALLERY
================================= */


/*

    Kamu bisa menggunakan:

    20 foto
    atau
    30 foto.

    Kode akan otomatis
    menyembunyikan file yang
    belum ada.

*/

const totalPhotos = 30;


const photoContainer =
    document.getElementById(
        "photo-container"
    );


for (
    let i = 1;
    i <= totalPhotos;
    i++
) {

    const img =
        document.createElement("img");


    img.src =
        `${i}.png`;


    img.className =
        "photo";


    img.alt =
        `Memory ${i}`;


    img.loading =
        "lazy";


    /*
        Kalau foto tidak ditemukan,
        otomatis disembunyikan.
    */

    img.onerror = function () {

        this.style.display =
            "none";

    };


    /*
        Klik foto
        untuk fullscreen.
    */

    img.onclick = function () {

        openPhoto(this.src);

    };


    photoContainer.appendChild(img);

}



/* =================================
   FULLSCREEN PHOTO
================================= */

function openPhoto(src) {

    const viewer =
        document.createElement("div");


    viewer.className =
        "photo-viewer";


    viewer.innerHTML = `

        <div
            class="close-viewer"
        >
            ×
        </div>

        <img
            src="${src}"
            alt="Photo"
        >

    `;


    /*
        Tambahkan style viewer
        langsung melalui JS.
    */

    viewer.style.position =
        "fixed";

    viewer.style.inset =
        "0";

    viewer.style.zIndex =
        "100";

    viewer.style.background =
        "rgba(0,0,0,0.92)";

    viewer.style.display =
        "flex";

    viewer.style.alignItems =
        "center";

    viewer.style.justifyContent =
        "center";

    viewer.style.padding =
        "20px";


    const image =
        viewer.querySelector("img");


    image.style.maxWidth =
        "95%";

    image.style.maxHeight =
        "90%";

    image.style.objectFit =
        "contain";


    const close =
        viewer.querySelector(
            ".close-viewer"
        );


    close.style.position =
        "absolute";

    close.style.top =
        "15px";

    close.style.right =
        "25px";

    close.style.fontSize =
        "40px";

    close.style.color =
        "white";

    close.style.cursor =
        "pointer";


    document.body.appendChild(
        viewer
    );


    close.onclick = function () {

        viewer.remove();

    };


    viewer.onclick = function(e) {

        if (e.target === viewer) {

            viewer.remove();

        }

    };

}



/* =================================
   START MUSIC AFTER USER TOUCH
================================= */

document.addEventListener(
    "click",
    startMusic,
    { once: true }
);