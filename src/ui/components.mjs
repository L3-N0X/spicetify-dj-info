import { CONFIG, saveConfig } from "./config.mjs";

const getReact = () => Spicetify.React;

export const DisplayIcon = ({ icon, size }) => {
  const react = getReact();
  return react.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "currentColor",
    dangerouslySetInnerHTML: {
      __html: icon,
    },
  });
};

export const ConfigItem = ({ name, field, disabled = false }) => {
  const react = getReact();
  const [value, setValue] = react.useState(CONFIG[field]);
  return react.createElement(
    "div",
    { className: "setting-row" },
    react.createElement("label", { className: "col description" }, name),
    react.createElement(
      "div",
      { className: "col action" },
      react.createElement(
        "button",
        {
          className: "switch" + (value ? "" : " disabled"),
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

export const ReloadItem = ({ name, disabled = false }) => {
  const react = getReact();
  return react.createElement(
    "div",
    { className: "setting-row" },
    react.createElement("label", { className: "col description" }, name),
    react.createElement(
      "div",
      { className: "col action" },
      react.createElement(
        "button",
        {
          className: "btn",
          disabled,
          onClick: () => {
            window.location.reload();
          },
        },
        "Reload",
      ),
    ),
  );
};
