import { createMutable } from 'solid-js/store'
import { onMount, onCleanup, createSignal } from 'solid-js'
import convertCssJsonToString from './renderer/RecursiveRenderer/CssJsonInputer'
import jsonObjectRenderer from './renderer/RecursiveRenderer/jsonFileRenderer'

export const PageRenderer = (props) => {
  let leftBarRef
  let rightBarRef
  let bottomBarRef

  const [isDraggingLeft, setIsDraggingLeft] = createSignal(false)
  const [isDraggingRight, setIsDraggingRight] = createSignal(false)
  const [isDraggingBottom, setIsDraggingBottom] = createSignal(false)
  const [startX, setStartX] = createSignal(0)
  const [startY, setStartY] = createSignal(0)
  const [startWidth, setStartWidth] = createSignal(0)
  const [startHeight, setStartHeight] = createSignal(0)

  const dimensions = createMutable({
    width: props.windowWidth,
    height: props.windowHeight,
    minWidth: 400,
    maxWidth: window.innerWidth - 50,
    minHeight: 300,
    maxHeight: window.innerHeight - 100
  })

  const updateDimensions = () => {
    dimensions.maxWidth = window.innerWidth - 50
    dimensions.maxHeight = window.innerHeight - 100
  }

  const handleMouseDown = (e, isLeft = false, isRight = false, isBottom = false) => {
    e.preventDefault()
    setIsDraggingLeft(isLeft)
    setIsDraggingRight(isRight)
    setIsDraggingBottom(isBottom)
    setStartX(e.clientX)
    setStartY(e.clientY)
    setStartWidth(dimensions.width)
    setStartHeight(dimensions.height)
  }

  const handleMouseMove = (e) => {
    if (isDraggingLeft() || isDraggingRight()) {
      const deltaX = e.clientX - startX()
      let newWidth = startWidth() + (isDraggingLeft() ? -deltaX : deltaX)
      newWidth = Math.max(dimensions.minWidth, Math.min(dimensions.maxWidth, newWidth))
      dimensions.width = newWidth
      props.setWidth(newWidth)
      if (props.windowRef) props.windowRef.style.width = `${newWidth}px`
    }

    if (isDraggingBottom()) {
      const deltaY = e.clientY - startY()
      let newHeight = startHeight() + deltaY
      newHeight = Math.max(dimensions.minHeight, Math.min(dimensions.maxHeight, newHeight))
      dimensions.height = newHeight
      props.setHeight(newHeight)
      if (props.windowRef) props.windowRef.style.height = `${newHeight}px`
    }
  }

  const handleMouseUp = () => {
    setIsDraggingLeft(false)
    setIsDraggingRight(false)
    setIsDraggingBottom(false)
  }

  const setToMaxWidth = () => {
    updateDimensions()
    const newWidth = dimensions.maxWidth
    dimensions.width = newWidth
    props.setWidth(newWidth)
    if (props.windowRef) props.windowRef.style.width = `${newWidth}px`
  }

  onMount(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  })

  onCleanup(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
  })

  return (
    <div>
      {props.isWideView() ? (
        <div>
          <div class="overflow-auto min-h-screen h-screen dark:text-black">
            {/*  Insert the renderer here*/}
            <style>
              {typeof props.files.css === 'string'
                ? props.files.css
                : convertCssJsonToString(props.files.css)}
            </style>
            {jsonObjectRenderer(props.files.html)}
          </div>
        </div>
      ) : (
        <div class="flex justify-center items-center h-[93vh]">
          <div>
            <div class="flex justify-center items-center mt-4">
              <div
                ref={leftBarRef}
                onDblClick={setToMaxWidth}
                onMouseDown={(e) => handleMouseDown(e, true, false, false)}
                class="h-full cursor-col-resize transition-transform duration-200 transform hover:scale-y-110 hover:rounded-full"
              >
                <div class="w-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors h-16 rounded-xl" />
              </div>

              <div
                ref={props.windowRef}
                class="rounded-xl border-[1px] dark:border-[#444] border-[#aaa] mx-[6px] relative overflow-auto bg-white dark:bg-black dark:text-black"
                style={{
                  width: `${props.windowWidth}px`,
                  height: `${props.windowHeight}px`
                }}
              >
                {/*Renderer Goes here*/}
                <script>{props.files.js}</script>
                <style>
                  {typeof props.files.css === 'string'
                    ? props.files.css
                    : convertCssJsonToString(props.files.css)}
                </style>
                {jsonObjectRenderer(props.files.html)}
              </div>

              <div
                ref={rightBarRef}
                onDblClick={setToMaxWidth}
                onMouseDown={(e) => handleMouseDown(e, false, true, false)}
                class="h-full cursor-col-resize transition-transform duration-200 transform hover:scale-y-110 hover:rounded-full"
              >
                <div class="w-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors h-16 rounded-xl" />
              </div>
            </div>

            <div
              ref={bottomBarRef}
              onMouseDown={(e) => handleMouseDown(e, false, false, true)}
              class="cursor-row-resize transition-transform duration-200 transform hover:scale-x-110 hover:rounded-full mt-2 flex justify-center"
            >
              <div class="h-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors w-32 rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
