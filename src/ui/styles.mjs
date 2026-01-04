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
    .dj-info-classic-container {
      display: grid;
      align-items: center;
      width: 100%;
    }
    .djInfoList {
      min-width: 0;
    }
    .dj-info-classic-item {
      display: block;
      font-size: 13px;
      white-space: nowrap;
      padding: 0 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }
    .dj-info-classic-separator {
      opacity: 0.4;
      font-size: 8px;
      margin: 0 2px;
      display: inline-block;
    }
    .dj-info-grid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      line-height: normal;
      padding-left: 8px;
    }
    .dj-info-row-top {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 2px;
      font-weight: 500;
      font-size: 13px;
    }
    .dj-info-row-bottom {
      display: flex;
      align-items: center;
      gap: 0px;
      font-size: 11px;
      opacity: 0.8;
    }
    .dj-info-separator {
      opacity: 0.6;
      font-size: 0.8em;
      padding: 0 4px;
    }
    .dj-info-tag {
      padding: 1px 6px;
      border-radius: 4px;
      color: #000;
      font-weight: 700;
      font-size: 11px;
      text-shadow: none;
    }
    
    :root {
      --camelot-1A: #00D3AA;
      --camelot-1B: #00CC33;
      --camelot-2A: #00E072;
      --camelot-2B: #78E600;
      --camelot-3A: #60E916;
      --camelot-3B: #BFD700;
      --camelot-4A: #C3EC00;
      --camelot-4B: #EBD100;
      --camelot-5A: #F0E100;
      --camelot-5B: #FFC000;
      --camelot-6A: #FFC900;
      --camelot-6B: #FF8D00;
      --camelot-7A: #FFA900;
      --camelot-7B: #EF5524;
      --camelot-8A: #FF7C00;
      --camelot-8B: #FF354C;
      --camelot-9A: #E24F21;
      --camelot-9B: #D81C65;
      --camelot-10A: #C83036;
      --camelot-10B: #A22888;
      --camelot-11A: #982257;
      --camelot-11B: #561F9B;
      --camelot-12A: #5A1C81;
      --camelot-12B: #0096C6;
    }

    .camelot-key-1A { background-color: var(--camelot-1A); }
    .camelot-key-1B { background-color: var(--camelot-1B); }
    .camelot-key-2A { background-color: var(--camelot-2A); }
    .camelot-key-2B { background-color: var(--camelot-2B); }
    .camelot-key-3A { background-color: var(--camelot-3A); }
    .camelot-key-3B { background-color: var(--camelot-3B); }
    .camelot-key-4A { background-color: var(--camelot-4A); }
    .camelot-key-4B { background-color: var(--camelot-4B); }
    .camelot-key-5A { background-color: var(--camelot-5A); }
    .camelot-key-5B { background-color: var(--camelot-5B); }
    .camelot-key-6A { background-color: var(--camelot-6A); }
    .camelot-key-6B { background-color: var(--camelot-6B); }
    .camelot-key-7A { background-color: var(--camelot-7A); }
    .camelot-key-7B { background-color: var(--camelot-7B); }
    .camelot-key-8A { background-color: var(--camelot-8A); }
    .camelot-key-8B { background-color: var(--camelot-8B); }
    .camelot-key-9A { background-color: var(--camelot-9A); }
    .camelot-key-9B { background-color: var(--camelot-9B); }
    .camelot-key-10A { background-color: var(--camelot-10A); }
    .camelot-key-10B { background-color: var(--camelot-10B); }
    .camelot-key-11A { background-color: var(--camelot-11A); }
    .camelot-key-11B { background-color: var(--camelot-11B); }
    .camelot-key-12A { background-color: var(--camelot-12A); }
    .camelot-key-12B { background-color: var(--camelot-12B); }
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
