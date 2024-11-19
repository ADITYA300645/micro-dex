import { onMount } from 'solid-js'
import { initializeTheme } from './stores/themeStore'
import ThemeWrapper from './components/ThemeController/ThemeWrapper'

function App(props) {
  onMount(() => {
    initializeTheme()
  })

  return (
    <ThemeWrapper>
      <main class="">{props.children}</main>
    </ThemeWrapper>
  )
}

export default App
