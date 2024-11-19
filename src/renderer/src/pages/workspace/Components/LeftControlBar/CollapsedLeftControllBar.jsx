import { TbLayoutSidebarLeftCollapse } from "solid-icons/tb";
import { createDraggable } from '@neodrag/solid';

function CollapsedLeftControllBar({currentPath,switchIsLeftCollapsed}) {
    const { draggable } = createDraggable();
    return (
        <div
            use:draggable={{ bounds: 'body' }}
            class="fixed bottom-0 left-0 hover:cursor-move transition-colors z-30  hover:bg-[#ccc] dark:hover:bg-[#424242] mx-2 my-3 rounded w-64 py-[14px] px-4 dark:bg-[#141414] bg-[#fff]"

        >
            <div class="justify-between items-center flex">
                <div class="font-mono text-xs">{currentPath}</div>

                <button class="justify-center items-center flex [animation:spin_500ms_ease-in-out_1]" onclick={switchIsLeftCollapsed}>
                    <TbLayoutSidebarLeftCollapse />
                </button>
            </div>
        </div>
    );
}

export default CollapsedLeftControllBar;
