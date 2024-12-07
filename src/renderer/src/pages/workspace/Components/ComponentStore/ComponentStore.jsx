import { createSignal, For, Show } from 'solid-js'

const components = [
  { id: 1, name: 'Button', image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Card', image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Modal', image: 'https://via.placeholder.com/150' }
  // Add more components here
]

const ComponentStoreWindow = (props) => {
  const [selectedComponent, setSelectedComponent] = createSignal(null)

  const handleCardClick = (component) => {
    setSelectedComponent(component)
  }

  const closeModal = () => {
    setSelectedComponent(null)
  }

  return (
    <div
      class="fixed w-full h-[97vh] flex justify-center items-center z-30 backdrop-blur-md"
      onClick={props.switchIsCreateComponenVisible}
    >
      <div
        class="flex flex-col justify-between h-[90%] w-[90%] dark:bg-neutral-900 dark:border-[2px] dark:border-[#444] rounded bg-white border-[2px] border-[#aaa] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="flex justify-between items-center px-6 py-4 border-b dark:border-[#555] bg-gray-50 dark:bg-neutral-800">
          <h2 class="text-xl dark:text-white text-gray-900 font-semibold">Component Store</h2>
          <button
            class="dark:bg-neutral-700 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            onClick={() => alert('Contribute Component functionality coming soon!')}
          >
            Contribute Component
          </button>
        </div>

        {/* Search Bar */}
        <div class="pt-4 flex items-center justify-center space-x-4 px-6">
          <input
            type="text"
            placeholder="Search components..."
            class="outline-none border-[2px] dark:border-[#555] rounded px-3 py-2 dark:bg-neutral-800 w-[50%] dark:text-white"
          />
          <button class="dark:bg-neutral-800 bg-[#ccc] px-3 py-2 rounded hover:shadow-lg transition">
            Search
          </button>
        </div>

        {/* Component Cards */}
        <div class="flex-grow flex flex-wrap justify-center mt-4 gap-6 px-6 overflow-y-auto">
          <Show
            when={components.length > 0}
            fallback={
              <p class="text-gray-500 dark:text-gray-400 text-center mt-20">
                No components available. Contribute one!
              </p>
            }
          >
            <For each={components}>
              {(component) => (
                <div
                  class="w-[200px] h-[240px] dark:bg-neutral-800 bg-gray-100 border dark:border-[#444] rounded-lg cursor-pointer flex flex-col justify-between items-center p-4 hover:shadow-lg transition"
                  onClick={() => handleCardClick(component)}
                >
                  <img
                    src={component.image}
                    alt={component.name}
                    class="w-full h-[150px] object-cover rounded"
                  />
                  <p class="text-center dark:text-white text-gray-800 font-medium mt-2">
                    {component.name}
                  </p>
                </div>
              )}
            </For>
          </Show>
        </div>

        {/* Footer */}
        <div class="flex justify-center items-center py-4 border-t dark:border-[#555] bg-gray-50 dark:bg-neutral-800">
          <p class="text-sm text-gray-500 dark:text-gray-400">Hope you will 💓 this project.</p>
        </div>

        {/* Import Modal */}
        {selectedComponent() && (
          <div
            class="fixed inset-0 z-40 flex justify-center items-center backdrop-blur-md bg-black/50"
            onClick={closeModal}
          >
            <div
              class="w-[40%] h-[30%] dark:bg-neutral-900 bg-white dark:border-[2px] border-[#aaa] rounded p-6 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 class="text-lg dark:text-white text-black font-semibold mb-4">
                Import Component
              </h3>
              <p class="dark:text-white text-black mb-4 text-center">
                Do you want to import <strong>{selectedComponent().name}</strong>?
              </p>
              <div class="flex space-x-4">
                <button
                  class="dark:bg-neutral-800 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => {
                    props.switchIsCreateComponenVisible()
                  }}
                >
                  Import
                </button>
                <button
                  class="dark:bg-neutral-800 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 transition"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComponentStoreWindow
