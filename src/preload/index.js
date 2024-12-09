import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('API', {
  ai_key: () => import.meta.env.VITE_AI_KEY,
  oppen_session_key: () => import.meta.env.VITE_AI_OPEN_SESSION_KEY
})

contextBridge.exposeInMainWorld('windowSizeControler', {
  minimize: () => ipcRenderer.send('minimize'),
  maximize: () => ipcRenderer.send('maximize'),
  close: () => ipcRenderer.send('close')
})

contextBridge.exposeInMainWorld('workspaceManager', {
  openNewProject: () => ipcRenderer.sendSync('openNewProject'),
  openProjectFromPath: () => ipcRenderer.send('openProjectFromPath'),
  saveWorkspace: () => ipcRenderer.send('saveWorkspace'),
  getCurrentWorkSpace: () => ipcRenderer.sendSync('getCurrentWorkSpace')
})

contextBridge.exposeInMainWorld('fileHandler', {
  readFolder: (dirPath) => ipcRenderer.invoke('readFolder', dirPath),
  readMainFile: (rootPath) => ipcRenderer.sendSync('readMainFile', rootPath),
  readMainFilePaths: (rootPath) => ipcRenderer.sendSync('readMainFilePaths', rootPath),
  readFile: (filePath) => ipcRenderer.invoke('readFile', filePath),
  saveProject: (html, htmlPath, css, cssPath) =>
    ipcRenderer.sendSync('saveProject', html, htmlPath, css, cssPath)
})

contextBridge.exposeInMainWorld('componentHandler', {
  addComponent: (html, css, name) => ipcRenderer.invoke('addComponent', html, css, name),
  updateComponent: (html, css, name) => ipcRenderer.invoke('updateComponent', html, css, name),
  deleteComponent: (name) => ipcRenderer.invoke('deleteComponent', name),
  getComponents: () => ipcRenderer.invoke('getComponents')
})
