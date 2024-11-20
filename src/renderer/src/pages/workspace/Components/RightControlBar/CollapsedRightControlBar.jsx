import {TbLayoutSidebarLeftCollapse } from "solid-icons/tb"
import {BsFullscreen} from "solid-icons/bs";
import {AiOutlineFullscreen} from "solid-icons/ai";
import {createDraggable} from "@neodrag/solid";

function CollapsedRightControlBar({switchIsCollapsed,isWideViewActive,switchWideView,injectJs}) {
    const { draggable } = createDraggable();
  return (
    <div
        use:draggable={{ bounds: 'body' }}
        class="fixed top-8 right-0 mx-2 my-3 rounded w-96 py-2 px-4 dark:bg-[#141414] hover:bg-[#ccc] dark:hover:bg-[#424242] bg-[#fff] hover:cursor-move transition-colors">
            <div class="flex space-x-2 justify-between items-center">
                <div class="justify-center items-center flex">
                    <button
                        class={`px-2 py-1 dark:bg-[#222] bg-slate-200 text-sm rounded 'bg-gray-300 dark:bg-[#242424]'`}
                    >
                        File name
                    </button>
                    <div class="mx-3">
                        <button
                            onclick={switchWideView}
                            class={`px-2 ${isWideViewActive() === false ? "dark:bg-[#333] bg-slate-300" : "dark:bg-[#222] bg-slate-200"} py-1 rounded-l mr-[2px]`}>
                            <BsFullscreen />
                        </button>
                        <button
                            onclick={switchWideView}
                            class={`px-2 ${isWideViewActive() === true ? "dark:bg-[#333] bg-slate-300" : "dark:bg-[#222] bg-slate-200"} py-1 rounded-r ml-[2px]`}>
                            <AiOutlineFullscreen />
                        </button>
                    </div>
                </div>
                <div class="justify-center items-center flex">
                  <button class="mx-3 px-2 rounded bg-[#222]" onclick={injectJs}>JS</button>
                    <button
                      class="justify-center items-center flex [animation:spin_500ms_ease-in-out_1]"
                      onclick={switchIsCollapsed}
                    >
                        <TbLayoutSidebarLeftCollapse />
                    </button>
                </div>
            </div>
        </div>
  )
}

export default CollapsedRightControlBar
