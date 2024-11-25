import { createSignal, For } from 'solid-js'
import { AiOutlineAlignLeft, AiOutlineAlignRight, AiOutlineAlignCenter } from 'solid-icons/ai'
import { FaSolidAlignJustify } from 'solid-icons/fa'

const alignmentOptions = [
  { label: 'left', icon: AiOutlineAlignLeft },
  { label: 'center', icon: AiOutlineAlignCenter },
  { label: 'right', icon: AiOutlineAlignRight },
  { label: 'justify', icon: FaSolidAlignJustify }
]

const CSSAlignment = (props) => {
  const [selectedAlignment, setSelectedAlignment] = createSignal(props.value || 'left')

  const handleAlignmentChange = (alignment) => {
    setSelectedAlignment(alignment)
    const [changer, property] = props.onChange
    changer(property, alignment)
    // props.onChange?.({ alignment }) // Notify parent component
  }

  return (
    <div class="flex items-center space-x-2 my-3">
      <label class="text-gray-700 dark:text-gray-400 text-sm font-medium">Align Vertical</label>

      {/* Alignment Options */}
      <div class="flex space-x-1">
        <For each={alignmentOptions}>
          {({ label, icon: Icon }) => (
            <button
              class={`px-2 py-1 mx-1 rounded-md text-sm flex items-center justify-center ${
                selectedAlignment() === label
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-300'
              }`}
              onClick={() => handleAlignmentChange(label)}
              aria-label={`Align ${label}`}
            >
              <Icon class="w-5 h-5" />
            </button>
          )}
        </For>
      </div>
    </div>
  )
}

export default CSSAlignment
