function magnify(containerId, zoom = 2) {
    const container = document.getElementById(containerId);
    const img = container.querySelector("img");
    const magnifier = container.querySelector(".magnifier");

    container.addEventListener("mousemove", (e) => {
        const { left, top } = img.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (x < 0 || x > img.width || y < 0 || y > img.height) {
            magnifier.style.display = "none";
            return;
        }

        magnifier.style.display = "block";
        magnifier.style.left = `${x - magnifier.offsetWidth / 2}px`;
        magnifier.style.top = `${y - magnifier.offsetHeight / 2}px`;

        magnifier.style.backgroundImage = `url('${img.src}')`;
        magnifier.style.backgroundRepeat = "no-repeat";
        magnifier.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;
        magnifier.style.backgroundPosition = `-${x * zoom - magnifier.offsetWidth / 2}px -${y * zoom - magnifier.offsetHeight / 2}px`;
    });

    container.addEventListener("mouseleave", () => {
        magnifier.style.display = "none";
    });
}


function magnifyLinked(container1Id, container2Id, zoom = 2) {
    const container1 = document.getElementById(container1Id);
    const container2 = document.getElementById(container2Id);

    const img1 = container1.querySelector("img");
    const img2 = container2.querySelector("img");

    const magnifier1 = container1.querySelector(".magnifier");
    const magnifier2 = container2.querySelector(".magnifier");

    const handleMouseMove = (e, sourceImg, targetImg, sourceMagnifier, targetMagnifier) => {
        const { left, top, width, height } = sourceImg.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (x < 0 || x > width || y < 0 || y > height) {
            sourceMagnifier.style.display = "none";
            targetMagnifier.style.display = "none";
            return;
        }

        sourceMagnifier.style.display = "block";
        targetMagnifier.style.display = "block";

        const zoomedWidth = sourceImg.width * zoom;
        const zoomedHeight = sourceImg.height * zoom;

        sourceMagnifier.style.left = `${x - sourceMagnifier.offsetWidth / 2}px`;
        sourceMagnifier.style.top = `${y - sourceMagnifier.offsetHeight / 2}px`;
        sourceMagnifier.style.backgroundImage = `url('${sourceImg.src}')`;
        sourceMagnifier.style.backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`;
        sourceMagnifier.style.backgroundPosition = `-${x * zoom - sourceMagnifier.offsetWidth / 2}px -${y * zoom - sourceMagnifier.offsetHeight / 2}px`;

        // Sync magnification on the second image
        const { left: targetLeft, top: targetTop, width: targetWidth, height: targetHeight } = targetImg.getBoundingClientRect();

        const relativeX = (x / width) * targetWidth;
        const relativeY = (y / height) * targetHeight;

        targetMagnifier.style.left = `${relativeX - targetMagnifier.offsetWidth / 2}px`;
        targetMagnifier.style.top = `${relativeY - targetMagnifier.offsetHeight / 2}px`;
        targetMagnifier.style.backgroundImage = `url('${targetImg.src}')`;
        targetMagnifier.style.backgroundSize = `${targetImg.width * zoom}px ${targetImg.height * zoom}px`;
        targetMagnifier.style.backgroundPosition = `-${relativeX * zoom - targetMagnifier.offsetWidth / 2}px -${relativeY * zoom - targetMagnifier.offsetHeight / 2}px`;
    };

    const handleMouseLeave = () => {
        magnifier1.style.display = "none";
        magnifier2.style.display = "none";
    };

    container1.addEventListener("mousemove", (e) => handleMouseMove(e, img1, img2, magnifier1, magnifier2));
    container1.addEventListener("mouseleave", handleMouseLeave);

    container2.addEventListener("mousemove", (e) => handleMouseMove(e, img2, img1, magnifier2, magnifier1));
    container2.addEventListener("mouseleave", handleMouseLeave);
}



