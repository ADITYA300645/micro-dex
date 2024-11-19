import { createMutable } from 'solid-js/store'
import { onMount, onCleanup, createSignal } from 'solid-js'
import jsonObjectRenderer from './renderer/jsonFileRenderer'

const isHtmlTag = (selector) => {
  const htmlTags = [
    'html',
    'body',
    'div',
    'span',
    'p',
    'a',
    'img',
    'button',
    'input',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'table',
    'tr',
    'td',
    'th',
    'thead',
    'tbody',
    'section',
    'article',
    'nav',
    'header',
    'footer',
    'main',
    'aside',
    'pre',
    'code',
    'hr',
    'br',
    'em',
    'strong',
    'i',
    'b',
    'select',
    'option',
    'textarea'
  ]

  // Split selector by spaces, commas, or pseudo-classes/elements
  const selectorParts = selector.split(/[\s,:]/).map((part) => part.trim())
  return selectorParts.some((part) => htmlTags.includes(part.toLowerCase()))
}

const processSelector = (selector) => {
  if (selector.startsWith('@')) return selector

  return selector
    .split(',')
    .map((part) => {
      part = part.trim()
      // Split into individual parts (handling space-separated selectors)
      const selectorParts = part.split(/\s+/)

      return selectorParts
        .map((subPart) => {
          // Preserve pseudo-classes and pseudo-elements
          const [baseSelector, ...pseudoParts] = subPart.split(':')
          const pseudo = pseudoParts.length ? ':' + pseudoParts.join(':') : ''

          // Add dot only if it's an HTML tag and doesn't already have a prefix
          if (
            isHtmlTag(baseSelector) &&
            !baseSelector.startsWith('.') &&
            !baseSelector.startsWith('#')
          ) {
            return '.' + baseSelector + pseudo
          }
          return baseSelector + pseudo
        })
        .join(' ')
    })
    .join(', ')
}

const convertCssJsonToString = (cssJson) => {
  const serializeRules = (json) => {
    let cssString = ''

    for (const key in json) {
      if (key.startsWith('@')) {
        cssString += `${key} {\n${serializeRules(json[key])}}\n`
      } else {
        const processedSelector = processSelector(key)
        cssString += `${processedSelector} {\n`
        const properties = json[key]
        for (const prop in properties) {
          if (typeof properties[prop] === 'object') {
            // Handle nested rules
            cssString += serializeRules({ [prop]: properties[prop] })
          } else {
            cssString += `  ${prop}: ${properties[prop]};\n`
          }
        }
        cssString += '}\n'
      }
    }

    return cssString
  }

  return serializeRules(cssJson)
}

export const PageRenderer = (props) => {
  // console.log(JSON.stringify(props.files.css))
  // console.log(convertCssJsonToString(props.files.css))

  let windowRef
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

  const setToMaxWidth = () => {
    dimensions.maxWidth = window.innerWidth - 50
    const newWidth = dimensions.maxWidth
    dimensions.width = newWidth
    props.setWidth(newWidth)
    if (windowRef) windowRef.style.width = `${newWidth}px`
  }

  const handleMouseDown = (e, isLeft, isBottom) => {
    e.preventDefault()
    if (isLeft) {
      setIsDraggingLeft(true)
    } else if (isBottom) {
      setIsDraggingBottom(true)
    } else {
      setIsDraggingRight(true)
    }
    setStartX(e.clientX)
    setStartY(e.clientY)
    setStartWidth(dimensions.width)
    setStartHeight(dimensions.height)
  }

  const handleMouseMove = (e) => {
    if (isDraggingLeft() || isDraggingRight()) {
      const deltaX = e.clientX - startX()
      dimensions.maxWidth = window.innerWidth - 50
      let newWidth = startWidth() + (isDraggingLeft() ? -deltaX : deltaX)
      newWidth = Math.max(dimensions.minWidth, Math.min(dimensions.maxWidth, newWidth))
      dimensions.width = newWidth
      props.setWidth(newWidth)
      if (windowRef) windowRef.style.width = `${newWidth}px`
    }

    if (isDraggingBottom()) {
      dimensions.maxHeight = window.innerHeight - 100
      const deltaY = e.clientY - startY()
      let newHeight = startHeight() + deltaY
      newHeight = Math.max(dimensions.minHeight, Math.min(dimensions.maxHeight, newHeight))
      dimensions.height = newHeight
      props.setHeight(newHeight)
      if (windowRef) windowRef.style.height = `${newHeight}px`
    }
  }

  const handleMouseUp = () => {
    setIsDraggingLeft(false)
    setIsDraggingRight(false)
    setIsDraggingBottom(false)
  }

  onMount(() => {
    dimensions.width = props.windowWidth
    dimensions.height = props.windowHeight

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
          <style>
            {typeof props.files.css === 'string'
              ? props.files.css
              : convertCssJsonToString(props.files.css)}
          </style>
          <div class="relative overflow-auto min-h-screen">
            {jsonObjectRenderer(props.files.html)}
          </div>
        </div>
      ) : (
        <div class="flex justify-center items-center h-[93vh]">
          <div>
            <div class="flex justify-center items-center mt-4">
              <div
                ref={leftBarRef}
                onDblClick={() => setToMaxWidth(true)}
                class="h-full cursor-col-resize transition-transform duration-200 transform hover:scale-y-110 hover:rounded-full"
                onMouseDown={(e) => handleMouseDown(e, true)}
                style={{ 'touch-action': 'none', 'user-select': 'none' }}
              >
                <div class="w-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors h-16 rounded-xl" />
              </div>

              <div
                ref={windowRef}
                class="rounded border-[1px] dark:border-[#444] border-[#aaa] mx-[6px] relative overflow-auto"
                style={{
                  width: `${props.windowWidth}px`,
                  height: `${props.windowHeight}px`
                }}
              >
                <style>
                  {typeof props.files.css === 'string'
                    ? props.files.css
                    : convertCssJsonToString(props.files.css)}
                </style>
                {jsonObjectRenderer(props.files.html)}
              </div>

              <div
                ref={rightBarRef}
                onDblClick={() => setToMaxWidth()}
                class="h-full cursor-col-resize transition-transform duration-200 transform hover:scale-y-110 hover:rounded-full"
                onMouseDown={(e) => handleMouseDown(e, false)}
                style={{ 'touch-action': 'none', 'user-select': 'none' }}
              >
                <div class="w-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors h-16 rounded-xl" />
              </div>
            </div>

            <div
              ref={bottomBarRef}
              class="cursor-row-resize transition-transform duration-200 transform hover:scale-x-110 hover:rounded-full mt-2 flex justify-center"
              onMouseDown={(e) => handleMouseDown(e, false, true)}
              style={{ 'touch-action': 'none', 'user-select': 'none' }}
            >
              <div class="h-1 bg-gray-400 dark:hover:bg-gray-200 hover:bg-gray-600 transition-colors w-32 rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
