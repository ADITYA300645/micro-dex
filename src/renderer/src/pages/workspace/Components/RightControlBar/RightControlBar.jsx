import { TbLayoutNavbarCollapse } from "solid-icons/tb";
import { VsDesktopDownload } from "solid-icons/vs";
import { BsFullscreen } from "solid-icons/bs";
import { AiOutlineFullscreen } from "solid-icons/ai";
import { createSignal, onCleanup } from "solid-js";

export default function RightControlBar({ switchIsCollapsed, isWideViewActive, switchWideView }) {
    const [width, setWidth] = createSignal(384); // Initial width of the sidebar
    const [isResizing, setIsResizing] = createSignal(false);
    const minWidth = 256; // Minimum width limit
    const maxWidth = 600; // Maximum width limit

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsResizing(true);
    };

    const handleMouseMove = (e) => {
        if (isResizing()) {
            const newWidth = Math.min(Math.max(minWidth, window.innerWidth - e.clientX), maxWidth);
            setWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    // Attach and clean up mouse events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    onCleanup(() => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    });

    return (
        <div
            class="fixed top-8 right-0 mx-2 my-3 rounded h-[93vh] py-2 px-4 dark:bg-[#141414] bg-[#fff]"
            style={{ width: `${width()}px` }}
        >
            {/* Resizer on the left */}
            <div
                class="absolute top-0 left-0 h-full w-1 cursor-col-resize bg-transparent"
                onMouseDown={handleMouseDown}
                style={{ touchAction: "none", userSelect: "none" }}
            />
            <div className="flex space-x-2 mb-3 justify-between items-center">
                <div class="justify-center items-center flex">
                    <button
                        className={`px-2 py-1 dark:bg-[#222] bg-slate-200 text-sm rounded 'bg-gray-300 dark:bg-[#242424]'`}
                    >
                        File name
                    </button>
                    <div class="mx-3">
                        <button
                            onClick={switchWideView}
                            class={`px-2 ${isWideViewActive() === false ? "dark:bg-[#333] bg-slate-300" : "dark:bg-[#222] bg-slate-200"} py-1 rounded-l mr-[2px]`}
                        >
                            <BsFullscreen />
                        </button>
                        <button
                            onClick={switchWideView}
                            class={`px-2 ${isWideViewActive() === true ? "dark:bg-[#333] bg-slate-300" : "dark:bg-[#222] bg-slate-200"} py-1 rounded-r ml-[2px]`}
                        >
                            <AiOutlineFullscreen />
                        </button>
                    </div>
                </div>
                <div class="justify-center items-center flex">
                    <button
                        class="justify-center items-center flex [animation:spin_500ms_ease-in-out_1]"
                        onclick={switchIsCollapsed}
                    >
                        <TbLayoutNavbarCollapse />
                    </button>
                </div>
            </div>
        </div>
    );
}
