let activeFaceValue;
let activeEffectValue;
const bindEvent = () => {
    // タブ切り替え
    let activeOption = 0;
    const chooseButtons = [
        document.getElementById("button_face"),
        document.getElementById("button_effect"),
        document.getElementById("button_text"),
    ];
    const optionDivs = document.getElementsByClassName("div_option");
    for (let i = 0; i < 3; i++) {
        chooseButtons[i].addEventListener("click", () => {
            chooseButtons[activeOption].className = "";
            optionDivs[activeOption].className = "div_option hidden";
            activeOption = i;
            chooseButtons[i].className = "active";
            optionDivs[i].className = "div_option";
        });
    }

    // オプションボタン
    let activeFace = 0;
    const obFaces = document.getElementsByClassName("ob_face");
    activeFaceValue = obFaces[activeFace].value;
    for (let i = 0; i < obFaces.length; i++) {
        obFaces[i].addEventListener("click", () => {
            obFaces[activeFace].className = "ob_face option_button";
            activeFace = i;
            obFaces[i].className = "ob_face option_button active";
            activeFaceValue = obFaces[activeFace].value;
            render();
        });
    }
    let activeEffect = 0;
    const obEffects = document.getElementsByClassName("ob_effect");
    activeEffectValue = obEffects[activeEffect].value;
    for (let i = 0; i < obEffects.length; i++) {
        obEffects[i].addEventListener("click", () => {
            obEffects[activeEffect].className = "ob_effect option_button";
            activeEffect = i;
            obEffects[i].className = "ob_effect option_button active";
            activeEffectValue = obEffects[activeEffect].value;
            render();
        });
    }
    text.addEventListener("input", render);
};
