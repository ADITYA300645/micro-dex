import { render } from 'solid-js/web'
import { lazy } from 'solid-js'
import { Route, HashRouter } from '@solidjs/router'
import './index.css'
import App from './App'

// Lazy load components
const Workspace = lazy(() => import('./pages/workspace/Workspace'))
const ProjectSelectionScreen = lazy(() => import('./pages/projectSelection/ProjectSelectionScreen'))

render(
  () => (
    <HashRouter root={App}>
      <Route path="/" component={ProjectSelectionScreen} />
      <Route path="/workspace" component={Workspace} />
    </HashRouter>
  ),
  document.getElementById('root')
)
