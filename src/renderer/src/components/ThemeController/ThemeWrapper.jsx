import { themeState } from "../../stores/themeStore";

const ThemeWrapper = (props) => {
    return (
        <div
            class={`
        min-h-screen w-full
        transition-all duration-500 ease-in-out
        ${themeState.isDark ? "text-white" : "text-gray-900"}
      `}
        >
            {props.children}
        </div>
    );
};

export default ThemeWrapper;
