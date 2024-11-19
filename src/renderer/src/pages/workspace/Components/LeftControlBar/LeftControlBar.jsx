import ProjectFilesStructure from './tabs/ProjectFilesStructure/ProjectFilesStructure'
import CurrentFileComponentsStructure from './tabs/CurrentFileComponentsStructure/CurrentFileComponentsStructure'
import { createSignal, Show, onCleanup } from 'solid-js'
import { TbLayoutNavbarCollapse } from 'solid-icons/tb'

function LeftControlBar({ isCollapsed, switchIsCollapsed }) {
  const [activeTab, setActiveTab] = createSignal('Files')
  const [width, setWidth] = createSignal(256)
  const [isResizing, setIsResizing] = createSignal(false)
  const minWidth = 256
  const maxWidth = 400

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e) => {
    if (isResizing()) {
      const newWidth = Math.min(Math.max(minWidth, e.clientX), maxWidth)
      setWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  // Attach and clean up mouse events
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return (
    <div
      className={`fixed top-8 left-0 mx-2 my-3 z-10 rounded h-[93vh] py-2 px-4 dark:bg-[#141414] bg-[#fff]`}
      style={{ width: `${width()}px` }}
    >
      <div className="flex space-x-2 mb-3 justify-between items-center">
        <div className="justify-center items-center flex font-medium">
          <button
            onClick={() => setActiveTab('Files')}
            className={`px-2 py-1 text-sm rounded ${activeTab() === 'Files' ? 'bg-gray-300 dark:bg-[#242424]' : 'bg-transparent'}`}
          >
            Files
          </button>
          <button
            onClick={() => setActiveTab('Components')}
            className={`px-2 py-1 text-sm rounded ${activeTab() === 'Components' ? 'bg-gray-300 dark:bg-[#242424]' : 'bg-transparent'}`}
          >
            Components
          </button>
        </div>
        <div className="justify-center items-center flex">
          <button
            className="justify-center items-center flex [animation:spin_500ms_ease-in-out_1]"
            onclick={switchIsCollapsed}
          >
            <TbLayoutNavbarCollapse />
          </button>
        </div>
      </div>

      <div className="border-t overflow-auto max-h-[86vh] border-gray-300 dark:border-gray-600 mt-2 pt-2 noscrollbar">
        <Show when={activeTab() === 'Files'} fallback={<CurrentFileComponentsStructure />}>
          <ProjectFilesStructure />
        </Show>
      </div>

      {/* Resizer on the right */}
      <div
        className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-transparent"
        onMouseDown={handleMouseDown}
        style={{ touchAction: 'none', userSelect: 'none' }}
      />
    </div>
  )
}

export default LeftControlBar
