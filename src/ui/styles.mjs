const STYLE_ID = "dj-info-styles";

export function initStyles() {
  let globalStyle = document.getElementById(STYLE_ID);
  if (!globalStyle) {
    globalStyle = document.createElement("style");
    globalStyle.id = STYLE_ID;
    document.head.appendChild(globalStyle);
  }
  globalStyle.innerHTML = `
    @keyframes djInfoFadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .djinfo-animate {
      animation: djInfoFadeIn 0.4s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
  `;
}

export const CONFIG_MODAL_CSS = `
.setting-row::after {
    content: "";
    display: table;
    clear: both;
    border-radius: 4px;
}
.setting-row .col {
    display: flex;
    padding: 10px 0;
    align-items: center;
}
.setting-row .col.description {
    float: left;
    padding-right: 15px;
    color: var(--spice-text);
}
.setting-row .col.action {
    float: right;
    text-align: right;
}
h1.main-type-alto {
  color: var(--spice-text);
}
button.switch {
    align-items: center;
    border: 0px;
    border-radius: 50%;
    background-color: rgba(var(--spice-rgb-shadow), .7);
    color: var(--spice-text);
    cursor: pointer;
    display: flex;
    margin-inline-start: 12px;
    padding: 8px;
}
button.switch.disabled,
button.switch[disabled] {
    color: rgba(var(--spice-rgb-text), .3);
}
button.btn {
    font-weight: 700;
    font-size: medium;
    background-color: transparent;
    border-radius: 24px;
    transition-duration: 33ms;
    transition-property: background-color, border-color, color, box-shadow, filter, transform;
    padding-inline: 15px;
    border: 1px solid #727272;
    color: var(--spice-text);
    min-block-size: 32px;
    cursor: pointer;
}
button.btn:hover {
    transform: scale(1.04);
    border-color: var(--spice-text);
}
`;