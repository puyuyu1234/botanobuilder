"use strict";

function getLen(str) {
    var result = 0;
    for (var i = 0; i < str.length; i++) {
        var chr = str.charCodeAt(i);
        if (
            (chr >= 0x00 && chr < 0x81) ||
            chr === 0xf8f0 ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)
        ) {
            //半角文字の場合は1を加算
            result += 1;
        } else {
            //それ以外の文字の場合は2を加算
            result += 2;
        }
    }
    //結果を返す
    return result;
}

let fontFamily = "PixelMplus";

const context = canvas.getContext("2d");

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
    const defaultFont = {
        fontSize: +fontSize.value,
        positionX: +positionX.value,
        positionY: +positionY.value,
        color: "white",
    };
    context.font = `${defaultFont.fontSize}px ${fontFamily}`;
    context.fillStyle = defaultFont.color;
    waitingEvent = () => {
        context.drawImage(images[bg.value], 0, 0);

        const textArray = text.value.split("\n");
        let currentFontData = {
            fontSize: defaultFont.fontSize,
            bold: false,
            italic: false,
            x: 0,
            y: 0,
        };
        const generateFont = () => {
            let s = "";
            if (currentFontData.bold) {
                s += "bold ";
            }
            if (currentFontData.italic) {
                s += "italic ";
            }
            s += `${currentFontData.fontSize}px ${fontFamily}`;

            return s;
        };
        for (const id in textArray) {
            const str = textArray[id];
            const stringParts = [];
            const regex = /\[font [^\]]+\]/g;
            let match;
            let lastIndex = 0;

            while ((match = regex.exec(str)) !== null) {
                const startIndex = match.index;
                const endIndex = match.index + match[0].length;
                stringParts.push(str.slice(lastIndex, startIndex));
                stringParts.push(str.slice(startIndex, endIndex));
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < str.length) {
                stringParts.push(str.slice(lastIndex));
            }

            let x = defaultFont.positionX;
            let y = defaultFont.positionY + id * defaultFont.fontSize;
            for (const part of stringParts) {
                if (regex.exec(part)) {
                    // font処理
                    const fontArray = part.slice(0, -1).split(" ");
                    for (let i = 1; i < fontArray.length; i++) {
                        const eqArray = fontArray[i].split("=");
                        switch (eqArray[0]) {
                            case "size":
                                currentFontData.fontSize = eqArray[1];
                                context.font = generateFont();
                                break;
                            case "color":
                                context.fillStyle = eqArray[1];
                                break;
                            case "italic":
                                currentFontData.italic = true;
                                context.font = generateFont();
                                break;
                            case "bold":
                                currentFontData.bold = true;
                                context.font = generateFont();
                                break;
                            case "x":
                                currentFontData.x = +eqArray[1];
                                break;
                            case "y":
                                currentFontData.y = +eqArray[1];
                                break;
                            case "reset":
                                currentFontData.fontSize = defaultFont.fontSize;
                                currentFontData.italic = false;
                                currentFontData.bold = false;
                                currentFontData.x = 0;
                                currentFontData.y = 0;
                                context.font = generateFont();
                                context.fillStyle = defaultFont.color;
                                break;
                        }
                    }
                    continue;
                }

                // 文章通常処理
                context.fillText(
                    part,
                    x + currentFontData.x,
                    y + currentFontData.y
                );
                x += (getLen(part) * currentFontData.fontSize) / 2;
            }
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
