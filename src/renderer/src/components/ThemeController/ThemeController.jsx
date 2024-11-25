import { Show } from 'solid-js'
import { themeState, toggleTheme } from '../../stores/themeStore'
import { Sun } from 'lucide-solid'
import { SiStarship } from 'solid-icons/si'

const ThemeController = () => {
  return (
    <button
      onClick={toggleTheme}
      style={{ '-webkit-app-region': 'no-drag' }}
      class={`dark:text-black
        transition-all duration-500 ease-in-out mx-2
      `}
      aria-label="Toggle theme"
    >
      <Show
        when={themeState.isDark}
        fallback={
          <Sun
            class={`w-[1.20rem] h-[1.20rem] transform transition-transform duration-500 text-bal
              ${themeState.isTransitioning ? 'rotate-180' : ''}
            `}
          />
        }
      >
        <SiStarship
          class={`w-[1.20rem] h-[1.20rem] transform transition-transform duration-500 text-white
            ${themeState.isTransitioning ? '-rotate-180' : ''}
          `}
        />
      </Show>
    </button>
  )
}

export default ThemeController
