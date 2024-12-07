import { createSignal, For, onMount } from 'solid-js'
import jsonComponentRenderer from './FileComponentRenderers/componentHtmlJson'
import convertCssJsonToStringComponent from './FileComponentRenderers/componentCssJson'

function CurrentFileComponentsStructure(props) {
  const [components, setComponents] = createSignal([])
  const [lastElement, setLastElement] = createSignal(null)

  onMount(async () => {
    const comp = await window.componentHandler.getComponents()
    setComponents(comp.components || [])
  })

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
              console.log(document.elementFromPoint(event.x, event.y))
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
