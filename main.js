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

const renderer = new Renderer(canvas);
const render = () => {
    renderer.render();
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
    const context = canvas.getContext("2d");
    context.textBaseline = "top";
    bindEvent();
    render();
});

saveImage.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL();
    a.download = "image.png";
    a.click();
});
