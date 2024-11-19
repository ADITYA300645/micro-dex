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

  const renderFile = createMutable({ files: {} })

  const [isLeftCollapsed, setIsLeftCollapsed] = createSignal(true)
  const [isRightCollapsed, setIsRightCollapsed] = createSignal(true)

  const [renderWindowWidth, setRenderWindowWidth] = createSignal(650)
  const [renderWindowHeight, setRenderWindowHeight] = createSignal(500)

  const [isWideViewActive, setIsWideViewActive] = createSignal(false)
  const [jsEnabled, setJsEnabled] = createSignal(false);



  function switchIsWideView() {
    console.log(isWideViewActive())
    setIsWideViewActive((isWideView) => !isWideView)
  }

  function switchIsLeftCollapsed() {
    setIsLeftCollapsed((is_collapsed) => !is_collapsed)
  }

  function switchIsRightCollapsed() {
    setIsRightCollapsed((is_collapsed) => !is_collapsed)
  }

  // Todo: OPTIMIZE IT
  var filesData = window.fileHandler.readMainFile(location.state.path)
  // filesData.css = { '.sarthiStyles': filesData.css }
  renderFile.files = filesData

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
        files={renderFile.files}
        isWideView={isWideViewActive}
        setWidth={setRenderWindowWidth}
        setHeight={setRenderWindowHeight}
        windowWidth={renderWindowWidth()}
        windowHeight={renderWindowHeight()}
      />
      {isRightCollapsed() === false ? (
        <CollapsedRightControlBar
          isWideViewActive={isWideViewActive}
          switchWideView={switchIsWideView}
          switchIsCollapsed={switchIsRightCollapsed}
        />
      ) : (
        <RightControlBar
          isWideViewActive={isWideViewActive}
          switchWideView={switchIsWideView}
          switchIsCollapsed={switchIsRightCollapsed}
        />
      )}
    </div>
  )
}

export default Workspace
