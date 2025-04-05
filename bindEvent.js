const bindEvent = () => {
    frame.addEventListener("input", render);
    next.addEventListener("input", render);
    yuri.addEventListener("input", render);
    face.addEventListener("input", render);
    effect.addEventListener("input", render);
    text.addEventListener("input", render);
    fontSize.addEventListener("input", () => {
        fontSizeRange.value = fontSize.value;
        render();
    });
    fontSizeRange.addEventListener("input", () => {
        fontSize.value = fontSizeRange.value;
        render();
    });
    positionX.addEventListener("input", () => {
        displayX.value = positionX.value;
        render();
    });
    displayX.addEventListener("input", () => {
        positionX.value = displayX.value;
        render();
    });
    positionY.addEventListener("input", () => {
        displayY.value = positionY.value;
        render();
    });
    displayY.addEventListener("input", () => {
        positionY.value = displayY.value;
        render();
    });
    positionCS.addEventListener("input", () => {
        displayCS.value = positionCS.value;
        render();
    });
    displayCS.addEventListener("input", () => {
        positionCS.value = displayCS.value;
        render();
    });
    positionLS.addEventListener("input", () => {
        displayLS.value = positionLS.value;
        render();
    });
    displayLS.addEventListener("input", () => {
        positionLS.value = displayLS.value;
        render();
    });
};
