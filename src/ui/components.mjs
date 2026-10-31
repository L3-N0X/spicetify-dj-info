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

export const NumberItem = ({ name, field, min, max, onCommit, disabled = false }) => {
  const react = getReact();
  const [value, setValue] = react.useState(String(CONFIG[field]));
  const commit = () => {
    const n = Math.min(max, Math.max(min, Math.round(Number(value))));
    if (!Number.isFinite(n)) {
      setValue(String(CONFIG[field]));
      return;
    }
    setValue(String(n));
    if (onCommit) onCommit(n);
    else {
      CONFIG[field] = n;
      saveConfig();
    }
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
        value,
        disabled,
        style: { width: '80px' },
        onChange: (e) => setValue(e.target.value),
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
