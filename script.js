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

class AssetLoader {
    constructor() {
        this._promises = [];
        this._assets = new Map();
    }

    addImage(name, url) {
        const img = new Image();
        img.src = url;

        const promise = new Promise((resolve) =>
            img.addEventListener("load", () => {
                this._assets.set(name, img);
                resolve(img);
            })
        );

        this._promises.push(promise);
    }

    async loadAll() {
        await Promise.all(this._promises);
        return this._assets;
    }

    get(name) {
        return this._assets.get(name);
    }
}

const assets = new AssetLoader();

let fontFamily = "PixelMplus";

const context = canvas.getContext("2d");

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
    context.drawImage(assets.get("bg"), 0, 0);
    context.drawImage(assets.get("body"), 0, 0);
    context.drawImage(assets.get(face.value), 0, 0);
    if (effect.value != "none")
        context.drawImage(assets.get(effect.value), 0, 0);
    if (frame.checked) {
        context.globalCompositeOperation = "multiply";
        context.drawImage(assets.get("frame"), 0, 0);
        context.globalCompositeOperation = "source-over";
    }
    if (next.checked) context.drawImage(assets.get("next"), 0, 0);
    if (yuri.checked) context.drawImage(assets.get("name"), 0, 0);

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

const bindEvent = () => {
    frame.addEventListener("change", render);
    next.addEventListener("change", render);
    yuri.addEventListener("change", render);
    face.addEventListener("change", render);
    effect.addEventListener("change", render);
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
};

assets.addImage("bg", "img/bg.jpg");
assets.addImage("body", "img/body.png");
assets.addImage("name", "img/botanyuri.png");
assets.addImage("effect1", "img/effect1.png");
assets.addImage("effect2", "img/effect2.png");
assets.addImage("effect3", "img/effect3.png");
assets.addImage("effect4", "img/effect4.png");
assets.addImage("effect5", "img/effect5.png");
assets.addImage("effect6", "img/effect6.png");
assets.addImage("effect7", "img/effect7.png");
assets.addImage("effect8", "img/effect8.png");
assets.addImage("face1", "img/face1.png");
assets.addImage("face2", "img/face2.png");
assets.addImage("face3", "img/face3.png");
assets.addImage("face4", "img/face4.png");
assets.addImage("face5", "img/face5.png");
assets.addImage("face6", "img/face6.png");
assets.addImage("face7", "img/face7.png");
assets.addImage("face8", "img/face8.png");
assets.addImage("face9", "img/face9.png");
assets.addImage("face10", "img/face10.png");
assets.addImage("face12", "img/face12.png");
assets.addImage("face13", "img/face13.png");
assets.addImage("face14", "img/face14.png");
assets.addImage("face15", "img/face15.png");
assets.addImage("face16", "img/face16.png");
assets.addImage("face17", "img/face17.png");
assets.addImage("face18", "img/face18.png");
assets.addImage("face19", "img/face19.png");
assets.addImage("face20", "img/face20.png");
assets.addImage("face21", "img/face21.png");
assets.addImage("frame", "img/frame.png");
assets.addImage("next", "img/next.png");

assets.loadAll().then(() => {
    bindEvent();
    render();
});

saveImage.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "image.png";
    a.click();
});
