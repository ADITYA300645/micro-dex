import { createSignal } from 'solid-js'

function CurrentFileComponentsStructure() {
  const [lastElement, setLastElement] = createSignal(null)


  return (
    <div>
      <div class="m-4">
        <div
          class="w-36 h-36 bg-[#121212] rounded justify-center items-center flex"
          draggable={true}
          onDrag={(event) => {
            const elementUnder = document.elementFromPoint(event.x, event.y)

            if (lastElement() && elementUnder !== lastElement()) {
              lastElement().style.border = 'none'
            }
            if (elementUnder) {
              elementUnder.style.border = '1px dotted white'
              setLastElement(elementUnder)
            }
          }}
          onDragEnd={(event) => {
            if (lastElement()) {
              lastElement().style.border = 'none'
              setLastElement(null)
            }
            console.log(document.elementFromPoint(event.x, event.y))
          }}
        >
          drop box
        </div>
      </div>
    </div>
  )
}

export default CurrentFileComponentsStructure
