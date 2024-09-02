"use strict";

const context = canvas.getContext("2d");
context.fillStyle = "white";

const images = {};
for (let i = 0; i <= 6; i++) {
    images["img" + i] = new Image();
    images["img" + i].src = `img/${i}.jpeg`;
    images["img" + i].addEventListener("load", () => {
        images["img" + i].loadFlag = true;
    });
}

let waitingEvent = () => {};
const render = () => {
    context.font = `${fontSize.value}px monospace`;
    waitingEvent = () => {
        context.drawImage(images[bg.value], 0, 0);

        const textArray = text.value.split("\n");
        for (const id in textArray) {
            const str = textArray[id];
            const x = +positionX.value;
            const y = +positionY.value + id * fontSize.value;
            context.fillText(str, x, y);
        }
    };
    // 読み込みが完了している場合は即座描画・待機中イベント消去
    if (images[bg.value].loadFlag) {
        waitingEvent();
        waitingEvent = () => {};
    }
    // 待機中イベントの遅延呼び出し
    else {
        images[bg.value].addEventListener("load", () => {
            waitingEvent();
            waitingEvent = () => {};
        });
    }
};

bg.addEventListener("change", render);
text.addEventListener("change", render);
fontSize.addEventListener("change", () => {
    fontSizeRange.value = fontSize.value;
    render();
});
fontSizeRange.addEventListener("change", () => {
    fontSize.value = fontSizeRange.value;
    render();
});
positionX.addEventListener("change", () => {
    displayX.value = positionX.value;
    render();
});
displayX.addEventListener("change", () => {
    positionX.value = displayX.value;
    render();
});
positionY.addEventListener("change", () => {
    displayY.value = positionY.value;
    render();
});
displayY.addEventListener("change", () => {
    positionY.value = displayY.value;
    render();
});

render();

saveImage.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "image.png";
    a.click();
});
