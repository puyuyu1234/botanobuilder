"use strict";

const context = canvas.getContext("2d");
context.font = "120px monospace";
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
    waitingEvent = () => {
        context.drawImage(images[bg.value], 0, 0);

        const textArray = text.value.split("\n");
        for (const id in textArray) {
            const str = textArray[id];
            const x = 330;
            const y = 1210 + id * 120;
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

render();

saveImage.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "image.png";
    a.click();
});
