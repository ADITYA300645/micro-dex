import { useLocation } from '@solidjs/router'
import WindowControlRibbon from '../../components/WindowControlRibbon/WindowControlRibbon'
import LeftControlBar from './Components/LeftControlBar/LeftControlBar'
import RightControlBar from './Components/RightControlBar/RightControlBar'
import { createSignal, onMount } from 'solid-js'
import CollapsedLeftControllBar from './Components/LeftControlBar/CollapsedLeftControllBar'
import CollapsedRightControlBar from './Components/RightControlBar/CollapsedRightControlBar'
import { PageRenderer } from './Components/PageRenderer/PageRenderer'
import { createMutable } from 'solid-js/store'
import BottomControlBar from './Components/BottomControlBar/BottomControlBar'
import ComponentStoreWindow from './Components/ComponentStore/ComponentStore'
import { AiComponentWriter } from './Components/AiComponentWriter/AiComponentwriter'

function Workspace() {
  const location = useLocation()
  // console.log(location.state.path)

  const [isScriptEnabled, setIsScriptEnabled] = createSignal(false)

  const renderFile = createMutable({ files: {} })

  const [isLeftCollapsed, setIsLeftCollapsed] = createSignal(true)
  const [isRightCollapsed, setIsRightCollapsed] = createSignal(true)

  const [renderWindowWidth, setRenderWindowWidth] = createSignal(650)
  const [renderWindowHeight, setRenderWindowHeight] = createSignal(500)

  const [isWideViewActive, setIsWideViewActive] = createSignal(false)

  const [currentlySelectedElement, setCurrentlySelectedElement] = createSignal(null)

  const [isCreateComponenVisible, setIsCreateComponentVisible] = createSignal(false)
  const [isAiComponentWriterVisible, setIsAiComponentWriterVisible] = createSignal(false)

  const historyStack = createMutable([])

  function switchIsWideView() {
    // console.log(isWideViewActive())
    setIsScriptEnabled(false)
    setIsWideViewActive((isWideView) => !isWideView)
  }

  function switchIsCreateComponenVisible() {
    setIsCreateComponentVisible((prev) => !prev)
  }

  function switchIsAiComponentWriterVisible() {
    setIsAiComponentWriterVisible((prev) => !prev)
  }

  function switchIsLeftCollapsed() {
    setIsLeftCollapsed((is_collapsed) => !is_collapsed)
  }

  function switchIsRightCollapsed() {
    setIsRightCollapsed((is_collapsed) => !is_collapsed)
  }

  var filesData = window.fileHandler.readMainFile(location.state.path)
  renderFile.files = filesData.files

  const injectScript = () => {
    if (!isScriptEnabled()) {
      const scriptElement = document.createElement('script')
      scriptElement.id = 'dynamic-script'
      scriptElement.textContent = `(()=>{${renderFile.files['js']}})()`
      document.body.appendChild(scriptElement)
      setIsScriptEnabled(true)
    }
  }

  // Function to remove the script
  const removeScript = () => {
    const existingScript = document.getElementById('dynamic-script')
    if (existingScript) {
      document.body.removeChild(existingScript)
      setIsScriptEnabled(false) // Update state
      // console.log('Script Removed')
    }
  }

  const toggleScript = () => {
    if (isScriptEnabled()) {
      removeScript()
      switchIsWideView()
      switchIsWideView()
      setIsScriptEnabled(false)
    } else {
      removeScript()
      switchIsWideView()
      switchIsWideView()
      injectScript()
      setIsScriptEnabled(true)
    }
  }

  function deleteElement(s_id) {
    historyStack.push(JSON.parse(JSON.stringify(renderFile.files)))

    if (!s_id || typeof s_id.value !== 'string') {
      throw new Error('Invalid s_id: Expected a valid object with a string "value" property')
    }

    const keys = s_id.value.split('.').map((item) => parseInt(item, 10))

    let currentNode = renderFile.files.html

    for (let i = 1; i < keys.length - 1; i++) {
      if (!currentNode.childNodes || !Array.isArray(currentNode.childNodes)) {
        throw new Error(`Invalid s_id: No childNodes found at level ${i}`)
      }

      const childIndex = keys[i] - 1
      const nextNode = currentNode.childNodes[childIndex]

      if (!nextNode) {
        throw new Error(`Invalid s_id: Node not found at index ${keys[i]} (level ${i})`)
      }

      currentNode = nextNode
    }

    currentNode.childNodes = []
  }

  function undoDelete() {
    if (historyStack.length === 0) {
      console.warn('No actions to undo.')
      return
    }

    const previousState = historyStack.pop()
    if (previousState) {
      renderFile.files = previousState
    }
  }

  let isListenerAttached = false

  const handleKeyboardShortcuts = (event) => {
    if (event.key === 'Delete') {
      if (currentlySelectedElement().attributes['s_id'] === undefined) {
        console.log('CHULL')
      } else {
        deleteElement(currentlySelectedElement().attributes['s_id'])
      }
    }
    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      undoDelete()
    }
  }

  function saveProject() {
    window.fileHandler.saveProject(
      JSON.stringify(renderFile.files.html),
      filesData.fileNames.html,
      JSON.stringify(renderFile.files.css),
      filesData.fileNames.css
    )
  }

  onMount(() => {
    if (!isListenerAttached) {
      window.addEventListener('keydown', handleKeyboardShortcuts)
      isListenerAttached = true
      return () => {
        window.removeEventListener('keydown', handleKeyboardShortcuts)
        isListenerAttached = false
      }
    }
  })

  return (
    <div class="">
      <WindowControlRibbon isWorkspace={true} />
      {isLeftCollapsed() === false ? (
        <CollapsedLeftControllBar
          currentPath={location.state.path}
          switchIsLeftCollapsed={switchIsLeftCollapsed}
        />
      ) : (
        <LeftControlBar
          historyStack={historyStack}
          renderFile={renderFile}
          isCollapsed={isLeftCollapsed}
          switchIsCollapsed={switchIsLeftCollapsed}
        />
      )}
      {isCreateComponenVisible() === true ? (
        <ComponentStoreWindow switchIsCreateComponenVisible={switchIsCreateComponenVisible} />
      ) : (
        <></>
      )}
      {isAiComponentWriterVisible() === true ? (
        <AiComponentWriter switchIsAiComponentWriterVisible={switchIsAiComponentWriterVisible} />
      ) : (
        <></>
      )}
      <PageRenderer
        currentlySelectedElement={currentlySelectedElement}
        setCurrentlySelectedElement={setCurrentlySelectedElement}
        files={renderFile.files}
        isWideView={isWideViewActive}
        setWidth={setRenderWindowWidth}
        setHeight={setRenderWindowHeight}
        windowWidth={renderWindowWidth()}
        windowHeight={renderWindowHeight()}
      />
      <BottomControlBar
        saveProject={saveProject}
        isCreateComponenVisible={isCreateComponenVisible}
        switchIsAiComponentWriterVisible={switchIsAiComponentWriterVisible}
        switchIsCreateComponenVisible={switchIsCreateComponenVisible}
      />
      {isRightCollapsed() === false ? (
        <CollapsedRightControlBar
          isScriptEnabled={isScriptEnabled}
          toggleScript={toggleScript}
          isWideViewActive={isWideViewActive}
          switchWideView={switchIsWideView}
          switchIsCollapsed={switchIsRightCollapsed}
        />
      ) : (
        <RightControlBar
          currentlySelectedElement={currentlySelectedElement}
          cssProperties={renderFile.files.css}
          toggleScript={toggleScript}
          isScriptEnabled={isScriptEnabled}
          isWideViewActive={isWideViewActive}
          switchWideView={switchIsWideView}
          switchIsCollapsed={switchIsRightCollapsed}
        />
      )}
    </div>
  )
}

export default Workspace
