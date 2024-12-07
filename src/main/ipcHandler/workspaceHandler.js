import { ipcMain, dialog } from 'electron'
import ProjectInitializer from '../controllers/project-initializer/projectInitializer'
import registerIpcComponentsController from './ipcComponentHandler'

function registerWorkspaceHandler() {
  global.currentWorkspacePath = null
  ipcMain.on('openNewProject', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    if (!canceled && filePaths.length > 0) {
      const folderPath = filePaths[0]
      global.currentWorkspacePath = folderPath
      new ProjectInitializer(folderPath)
      registerIpcComponentsController(folderPath)
      event.returnValue = folderPath
      return
    }
    event.returnValue = ''
  })

  ipcMain.on('getCurrentWorkSpace', (event) => {
    event.returnValue = global.currentWorkspacePath || ''
  })
}

export default registerWorkspaceHandler
