import { CONFIG, saveConfig } from './config.mjs';

const getReact = () => Spicetify.React;

export const DisplayIcon = ({ icon, size }) => {
  const react = getReact();
  return react.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 16 16',
    fill: 'currentColor',
    dangerouslySetInnerHTML: {
      __html: icon,
    },
  });
};

export const ConfigItem = ({ name, field, disabled = false }) => {
  const react = getReact();
  const [value, setValue] = react.useState(CONFIG[field]);
  return react.createElement(
    'div',
    { className: 'setting-row' },
    react.createElement('label', { className: 'col description' }, name),
    react.createElement(
      'div',
      { className: 'col action' },
      react.createElement(
        'button',
        {
          className: 'switch' + (value ? '' : ' disabled'),
          disabled,
          onClick: () => {
            const state = !value;
            CONFIG[field] = state;
            setValue(state);
            saveConfig();
          },
        },
        react.createElement(DisplayIcon, {
          icon: Spicetify.SVGIcons.check,
          size: 16,
        }),
      ),
    ),
  );
};

// Number field that commits on Enter / blur (so typing "90" isn't clamped at "9").
export const NumberItem = ({ name, field, min, max, onChange }) => {
  const react = getReact();
  const [text, setText] = react.useState(String(CONFIG[field]));
  const commit = () => {
    let v = parseInt(text, 10);
    if (!Number.isFinite(v)) v = CONFIG[field];
    v = Math.min(max, Math.max(min, v));
    CONFIG[field] = v;
    setText(String(v));
    saveConfig();
    if (onChange) onChange(v);
  };
  return react.createElement(
    'div',
    { className: 'setting-row' },
    react.createElement('label', { className: 'col description' }, name),
    react.createElement(
      'div',
      { className: 'col action' },
      react.createElement('input', {
        type: 'number',
        min,
        max,
        step: 1,
        value: text,
        style: {
          width: '76px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid var(--spice-button-disabled, #535353)',
          background: 'transparent',
          color: 'inherit',
        },
        onChange: (e) => setText(e.target.value),
        onBlur: commit,
        onKeyDown: (e) => {
          if (e.key === 'Enter') commit();
        },
      }),
    ),
  );
};

export const ReloadItem = ({ name, disabled = false }) => {
  const react = getReact();
  return react.createElement(
    'div',
    { className: 'setting-row' },
    react.createElement('label', { className: 'col description' }, name),
    react.createElement(
      'div',
      { className: 'col action' },
      react.createElement(
        'button',
        {
          className: 'btn',
          disabled,
          onClick: () => {
            window.location.reload();
          },
        },
        'Reload',
      ),
    ),
  );
};

export const ButtonItem = ({ name, btnText, onClick, disabled = false }) => {
  const react = getReact();
  return react.createElement(
    'div',
    { className: 'setting-row' },
    react.createElement('label', { className: 'col description' }, name),
    react.createElement(
      'div',
      { className: 'col action' },
      react.createElement(
        'button',
        {
          className: 'btn',
          disabled,
          onClick,
        },
        btnText,
      ),
    ),
  );
};
