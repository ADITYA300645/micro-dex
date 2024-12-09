import { createSignal, For, onMount } from 'solid-js'
import jsonComponentRenderer from './FileComponentRenderers/componentHtmlJson'
import convertCssJsonToStringComponent from './FileComponentRenderers/componentCssJson'

function CurrentFileComponentsStructure(props) {
  const [components, setComponents] = createSignal([])
  const [lastElement, setLastElement] = createSignal(null)
  const [draggedComponent, setDraggedComponent] = createSignal(null)

  onMount(async () => {
    const comp = await window.componentHandler.getComponents()
    setComponents(comp.components || [])
  })

  function combineCssObjects(css1, css2) {
    const mergedCss = { ...css1 }

    for (const [key, value] of Object.entries(css2)) {
      if (key in mergedCss) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          mergedCss[key] = { ...mergedCss[key], ...value }
        } else {
          throw new Error(`Conflict with non-object value for key: ${key}`)
        }
      } else {
        mergedCss[key] = value
      }
    }

    return mergedCss
  }

  function insertToObject(s_id) {
    props.historyStack.push(JSON.parse(JSON.stringify(props.renderFile.files)))

    if (!s_id || typeof s_id.value !== 'string') {
      throw new Error('Invalid s_id: Expected a valid object with a string "value" property')
    }

    const keys = s_id.value.split('.').map((item) => parseInt(item, 10))

    let currentNode = props.renderFile.files.html

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
    currentNode.childNodes.unshift(draggedComponent().html)

    const draggedCss = draggedComponent().css
    const cssRules = props.renderFile.files.css

    props.renderFile.files.css = combineCssObjects(cssRules, draggedCss)
  }

  return (
    <div class="component-wrapper">
      <For each={components()}>
        {(component) => (
          <div
            class="
            component-item transition-all rounded justify-center items-center flex flex-col
              dark:bg-neutral-900 my-4 py-2 dark:hover:bg-neutral-800 bg-[#ddd] hover:bg-[#ccc]
                cursor-pointer
              "
            draggable={true}
            onDrag={(event) => {
              setDraggedComponent(component)
              const elementUnder = document.elementFromPoint(event.x, event.y)

              if (lastElement() && elementUnder !== lastElement()) {
                lastElement().style.outline = 'none'
              }
              if (elementUnder) {
                elementUnder.style.outline = '1px dashed #888888'
                setLastElement(elementUnder)
              }
            }}
            onDragEnd={(event) => {
              if (lastElement()) {
                lastElement().style.outline = 'none'
                setLastElement(null)
              }

              var s_id = document.elementFromPoint(event.x, event.y).attributes['s_id']
              // console.log(document.elementFromPoint(event.x, event.y))

              insertToObject(s_id)

              setDraggedComponent(null)
              console.log()
            }}
            style={{ width: `${props.parentWidth() - 35}px` }}
          >
            <style>{convertCssJsonToStringComponent(component.css)}</style>
            <div class="componentWrapper">{jsonComponentRenderer(component.html)}</div>
            <div class="component-name">{component.name}</div>
          </div>
        )}
      </For>
    </div>
  )
}

export default CurrentFileComponentsStructure
