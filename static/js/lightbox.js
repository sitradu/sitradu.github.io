document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    const links = Array.from(
        document.querySelectorAll(".gallery-lightbox")
    );

    if (links.length === 0) return;

    const image = lightbox.querySelector(".lightbox-content img");
    const caption = lightbox.querySelector(".lightbox-caption");
    const close = lightbox.querySelector(".lightbox-close");
    const prev = lightbox.querySelector(".lightbox-prev");
    const next = lightbox.querySelector(".lightbox-next");

    let currentIndex = 0;

    function showImage(index) {
        // Hace circular la galería:
        // anterior desde la primera -> última
        // siguiente desde la última -> primera
        currentIndex = (index + links.length) % links.length;

        const link = links[currentIndex];
        const thumbnail = link.querySelector("img");

        image.src = link.href;
        image.alt = thumbnail?.alt || "";
        caption.textContent = link.dataset.caption || "";
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.hidden = true;
        image.src = "";
        document.body.style.overflow = "";
    }

    links.forEach((link, index) => {
        link.addEventListener("click", event => {
            event.preventDefault();
            openLightbox(index);
        });
    });

    close.addEventListener("click", closeLightbox);

    prev.addEventListener("click", event => {
        event.stopPropagation();
        showImage(currentIndex - 1);
    });

    next.addEventListener("click", event => {
        event.stopPropagation();
        showImage(currentIndex + 1);
    });

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", event => {
        if (lightbox.hidden) return;

        switch (event.key) {
            case "Escape":
                closeLightbox();
                break;

            case "ArrowLeft":
                showImage(currentIndex - 1);
                break;

            case "ArrowRight":
                showImage(currentIndex + 1);
                break;
        }
    });
});
