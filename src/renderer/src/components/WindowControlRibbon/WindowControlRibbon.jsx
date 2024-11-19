import { MinusIcon } from "lucide-solid";
import { FaRegularWindowMaximize, FaRegularWindowMinimize, FaRegularWindowRestore } from 'solid-icons/fa';
import { AiOutlineClose } from 'solid-icons/ai';
import ThemeController from "../ThemeController/ThemeController";
import { useLocation } from "@solidjs/router";

function WindowControlRibbon({ isWorkspace }) {
  const darkThemeColor = isWorkspace ? '#242424' : 'bg-gray-800'
  const lightThemeColor = isWorkspace ? '#aaa' : 'bg-white'
  const darkBorderColor = isWorkspace ? '#111' : 'border-gray-700'
  const lightBorderColor = isWorkspace ? '#cccccc' : 'border-gray-200'

  if (isWorkspace) {
    return (
      <div
        class={`flex sticky top-0 left-0 right-0 w-screen z-50 justify-between items-center ${'dark:bg-[#222] bg-white'} shadow px-0 py-0`}
        style={{
          backgroundColor: isWorkspace
            ? document.body.classList.contains('dark')
              ? darkThemeColor
              : lightThemeColor
            : '',
          borderColor: isWorkspace
            ? document.body.classList.contains('dark')
              ? darkBorderColor
              : lightBorderColor
            : '',
          '-webkit-app-region': 'drag'
        }}
      >
        {/* Draggable area */}
        <div class="flex items-center px-2" style={{ '-webkit-app-region': 'drag' }}>
          <div style={{ '-webkit-app-region': 'no-drag' }}>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              File
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              Edit
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              View
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              Project
            </button>
          </div>
        </div>

        <div class="flex h-8">
          <ThemeController />
          <button
            onClick={() => window.windowSizeControler.minimize()}
            id="minimize-btn"
            class="hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white px-4 flex items-center gap-2"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <FaRegularWindowMinimize class="h-5 w-5" />
          </button>
          <button
            onClick={() => window.windowSizeControler.maximize()}
            id="maximize-btn"
            class="hover:bg-gray-200 dark:hover:bg-gray-700 font-thin dark:text-white px-4 flex items-center gap-2"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <FaRegularWindowMaximize class="h-4 w-4" />
          </button>
          <button
            onClick={() => window.windowSizeControler.close()}
            id="close-btn"
            class="hover:bg-red-500 dark:text-white font-thin px-4 flex items-center"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <AiOutlineClose class="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div
        class={`flex sticky top-0 left-0 right-0 w-screen z-50 justify-between items-center ${'bg-white dark:bg-gray-800'} shadow px-0 py-0`}
        style={{
          backgroundColor: isWorkspace
            ? document.body.classList.contains('dark')
              ? darkThemeColor
              : lightThemeColor
            : '',
          borderColor: isWorkspace
            ? document.body.classList.contains('dark')
              ? darkBorderColor
              : lightBorderColor
            : '',
          '-webkit-app-region': 'drag'
        }}
      >
        {/* Draggable area */}
        <div class="flex items-center px-2" style={{ '-webkit-app-region': 'drag' }}>
          <div style={{ '-webkit-app-region': 'no-drag' }}>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              File
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              Edit
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              View
            </button>
            <button class="hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1 text-sm dark:text-white">
              Project
            </button>
          </div>
        </div>

        <div class="flex h-8">
          <ThemeController />
          <button
            onClick={() => window.windowSizeControler.minimize()}
            id="minimize-btn"
            class="hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white px-4 flex items-center gap-2"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <FaRegularWindowMinimize class="h-5 w-5" />
          </button>
          <button
            onClick={() => window.windowSizeControler.maximize()}
            id="maximize-btn"
            class="hover:bg-gray-200 dark:hover:bg-gray-700 font-thin dark:text-white px-4 flex items-center gap-2"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <FaRegularWindowMaximize class="h-4 w-4" />
          </button>
          <button
            onClick={() => window.windowSizeControler.close()}
            id="close-btn"
            class="hover:bg-red-500 dark:text-white font-thin px-4 flex items-center"
            style={{ '-webkit-app-region': 'no-drag' }}
          >
            <AiOutlineClose class="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }
}

export default WindowControlRibbon;
