import { useLocation } from '@solidjs/router'
import WindowControlRibbon from '../../components/WindowControlRibbon/WindowControlRibbon'
import LeftControlBar from './Components/LeftControlBar/LeftControlBar'
import RightControlBar from './Components/RightControlBar/RightControlBar'
import { createSignal } from 'solid-js'
import CollapsedLeftControllBar from './Components/LeftControlBar/CollapsedLeftControllBar'
import CollapsedRightControlBar from './Components/RightControlBar/CollapsedRightControlBar'
import { PageRenderer } from './Components/PageRenderer/PageRenderer'
import { createMutable } from 'solid-js/store'

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

  function switchIsWideView() {
    // console.log(isWideViewActive())
    setIsScriptEnabled(false)
    setIsWideViewActive((isWideView) => !isWideView)
  }

  function switchIsLeftCollapsed() {
    setIsLeftCollapsed((is_collapsed) => !is_collapsed)
  }

  function switchIsRightCollapsed() {
    setIsRightCollapsed((is_collapsed) => !is_collapsed)
  }

  var filesData = window.fileHandler.readMainFile(location.state.path)
  renderFile.files = filesData

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

  return (
    <div class="">
      <WindowControlRibbon isWorkspace={true} />
      {isLeftCollapsed() === false ? (
        <CollapsedLeftControllBar
          currentPath={location.state.path}
          switchIsLeftCollapsed={switchIsLeftCollapsed}
        />
      ) : (
        <LeftControlBar isCollapsed={isLeftCollapsed} switchIsCollapsed={switchIsLeftCollapsed} />
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
