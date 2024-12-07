import { createSignal, onCleanup, For, batch } from 'solid-js'
import { marked } from 'marked'

export const AiComponentWriter = (props) => {
  const [width, setWidth] = createSignal(800)
  const [isResizing, setIsResizing] = createSignal(false)
  const [chatMessages, setChatMessages] = createSignal([
    { role: 'assistant', content: 'How can I assist you today?' }
  ])

  let inputField
  const [inputText, setInputText] = createSignal('')
  const [isLoading, setIsLoading] = createSignal(false)

  const [currentComponentHtml, setCurrentComponentHtml] = createSignal('')
  const [currentComponentCSS, setCurrentComponentCSS] = createSignal('')
  const [currentComponentName, setCurrentComponentName] = createSignal('')

  const [selectedComponent, setSelectedComponent] = createSignal(null)
  const closeModal = () => {
    setSelectedComponent(null)
  }
  const minWidth = 300
  const maxWidth = 1200

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e) => {
    if (isResizing()) {
      const newWidth = Math.min(Math.max(minWidth, e.clientX), maxWidth)
      setWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)

  onCleanup(() => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  function extractJSON(text) {
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start !== -1 && end !== -1 && end > start) {
      let jsonString = text.substring(start, end + 1)
      try {
        console.log(jsonString)
        return JSON.parse(jsonString)
      } catch (e) {
        console.error('Invalid JSON string:', e)
        return null
      }
    }
    return null
  }

  const handleSend = async () => {
    if (inputText().trim() === '') return
    setIsLoading(true)

    try {
      const fullQuery =
        inputText() +
        ' your are going to produce only component so, do not produce html head or other unnessary tags return the change in the Given Styled Json Format [{html:"some html content",css:"some css content",componentName:"a very sort and meaning full name",explaination:"A very sort discription and why did you took that decision very sort !! "}] Only Provide Json response Nothing ELSE '

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          apikey: window.API.ai_key()
        },
        body: JSON.stringify({
          responseMode: 'sync',
          query: fullQuery,
          endpointId: 'predefined-openai-gpt4o'
        })
      }

      const response = await fetch(
        `https://api.on-demand.io/chat/v1/sessions/${window.API.oppen_session_key()}/query`,
        options
      )
      const data = await response.json()
      const content = extractJSON(data.data.answer)[0]

      setCurrentComponentHtml(content.html)
      setCurrentComponentCSS(content.css)
      setCurrentComponentName(content.componentName)

      batch(() => {
        setChatMessages((prev) => [
          ...prev,
          { role: 'user', content: inputText() },
          {
            role: 'assistant',
            content: content === undefined ? 'no explaination' : content.explaination
          }
        ])
        setInputText('')
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Error during send:', error)
      setIsLoading(false)
    }
  }

  return (
    <div
      class="fixed w-full h-[97vh] flex justify-center items-center z-30 backdrop-blur-md"
      onClick={props.switchIsAiComponentWriterVisible}
    >
      <div
        class="flex h-[90%] w-[90%] dark:bg-neutral-900 rounded bg-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/*  (Component Renderer) */}
        <div
          class="dark:bg-neutral-800 flex flex-col justify-center relative items-center bg-gray-100 h-full overflow-auto p-4"
          style={{ width: `${width()}px` }}
        >
          {currentComponentHtml() === '' ? (
            <button
              class="dark:text-white text-gray-800 font-semibold mb-2 px-4 py-2 dark:bg-neutral-600 rounded bg-slate-300"
              onclick={() => inputField.focus()}
            >
              &lt; Prompt for component / &gt;
            </button>
          ) : (
            <></>
          )}

          <div class="rounded p-4 " innerHTML={currentComponentHtml()} />
          <style>{currentComponentCSS()}</style>
          {currentComponentHtml() === '' ? (
            <></>
          ) : (
            <button
              class="dark:bg-neutral-700 dark:hover:bg-neutral-600 px-3 py-2 rounded absolute bottom-3 right-3 bg-slate-300 hover:bg-slate-400 transition-all"
              onclick={() => setSelectedComponent(currentComponentName())}
            >
              Import Component
            </button>
          )}
        </div>
        {/* Import model */}
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
                Do you want to import <strong>{selectedComponent()}</strong> ?
              </p>
              <div class="flex space-x-4">
                <button
                  class="dark:bg-neutral-800 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  onClick={() => {
                    window.componentHandler.addComponent(
                      currentComponentHtml(),
                      currentComponentCSS(),
                      currentComponentName()
                    )
                    props.switchIsAiComponentWriterVisible()
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

        {/* Divider */}
        <div
          class="cursor-col-resize bg-gray-300 dark:bg-gray-600"
          style={{ width: '4px' }}
          onMouseDown={handleMouseDown}
        />

        {/* Right Pane (Chat Interface) */}
        <div class="flex-1 flex flex-col dark:bg-neutral-900 bg-white h-full">
          <div class="flex-grow p-4 overflow-auto">
            <For each={chatMessages()}>
              {(message) => (
                <div
                  class={`mb-4 p-3 rounded ${
                    message.role === 'assistant'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                  innerHTML={marked(message.content)}
                />
              )}
            </For>
            {isLoading() && (
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          <div class="p-4 border-t dark:border-[#555] border-gray-300">
            <div class="flex space-x-2">
              <input
                type="text"
                ref={inputField}
                disabled={isLoading()}
                placeholder="Type your message..."
                value={inputText()}
                onInput={(e) => setInputText(e.target.value)}
                class={`flex-grow border rounded px-3 py-2 dark:${isLoading() ? 'bg-neutral-600' : 'bg-neutral-800'} ${isLoading() ? 'bg-[#aaa]' : 'bg-none'} dark:border-[#444] dark:text-white outline-none`}
              />
              <button
                onClick={handleSend}
                class={`px-4 py-2 rounded ${
                  isLoading() ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600 transition'
                } text-white`}
                disabled={isLoading()}
              >
                {isLoading() ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
