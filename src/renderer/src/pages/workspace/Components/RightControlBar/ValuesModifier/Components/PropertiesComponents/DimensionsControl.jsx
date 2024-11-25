import { createSignal, createEffect } from 'solid-js'

const DimensionsControl = (props) => {
  const [width, setWidth] = createSignal('auto')
  const [height, setHeight] = createSignal('auto')

  createEffect(() => {
    const { width: initialWidth, height: initialHeight } = props.values
    setWidth(initialWidth ?? 'auto')
    setHeight(initialHeight ?? 'auto')
    // console.log(props)
  })

  const handleWidthChange = (e) => {
    setWidth(e.target.value)
  }

  const handleHeightChange = (e) => {
    setHeight(e.target.value)
  }

  const applyWidthChange = () => {
    props.onChange?.({ width: width() })
  }

  const applyHeightChange = () => {
    props.onChange?.({ height: height() })
  }

  const handleKeyDown = (e, applyChange) => {
    if (e.key === 'Enter') {
      applyChange()
      e.target.blur()
    }
  }

  return (
    <div class="flex rounded-md w-full [&>*]:mx-2 text-xs">
      <div class="flex items-center space-x-2">
        <label class="text-gray-700 dark:text-gray-400 text-sm font-medium">w</label>
        <input
          class="w-[150%] py-[2px] min-w-16 bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-300 text-sm font-medium rounded-md px-2 outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          type="text"
          value={width()}
          onInput={handleWidthChange}
          onBlur={applyWidthChange} // Apply changes on blur
          onKeyDown={(e) => handleKeyDown(e, applyWidthChange)} // Apply changes on Enter
        />
      </div>
      <div class="flex items-center space-x-2">
        <label class="text-gray-700 dark:text-gray-400 text-sm font-medium">h</label>
        <input
          class="w-[100%] min-w-16 py-[2px] bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-300 text-sm font-medium rounded-md px-2 outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
          type="text"
          value={height()}
          onInput={handleHeightChange}
          onBlur={applyHeightChange} // Apply changes on blur
          onKeyDown={(e) => handleKeyDown(e, applyHeightChange)} // Apply changes on Enter
        />
      </div>
    </div>
  )
}

export default DimensionsControl
