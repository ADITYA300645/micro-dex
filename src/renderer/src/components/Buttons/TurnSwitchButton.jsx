import { Show, createSignal } from 'solid-js'

function TurnSwitchButton(props) {
  const [isTransitioning, setIsTransitioning] = createSignal(false)

  const handleClick = () => {
    setIsTransitioning(true)
    props.onClickHandler()
    setTimeout(() => setIsTransitioning(false), 500)
  }

  return (
    <button
      onClick={handleClick}
      style={{ '-webkit-app-region': 'no-drag' }}
      class={`transition-all duration-500 ease-in-out mx-2 px-2 py-1 text-black dark:text-white rounded dark:bg-[#222] bg-slate-200`}
      aria-label="Toggle theme"
    >
      <Show
        when={props.isActive}
        fallback={
          <props.ActiveIcon
            class={`w-[1.20rem] h-[1.20rem] transform transition-transform duration-500 ${
              isTransitioning() ? 'rotate-180' : ''
            }`}
          />
        }
      >
        <props.InActiveIcon
          class={`w-[1.20rem] h-[1.20rem] transform transition-transform duration-500 ${
            isTransitioning() ? '-rotate-180' : ''
          }`}
        />
      </Show>
    </button>
  )
}

export default TurnSwitchButton
