import { ipcMain, dialog } from 'electron'
import ProjectInitializer from '../controllers/project-initializer/projectInitializer'

function regesterWorkspaceHandler() {
  ipcMain.on('openNewProject', async (event) => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!canceled && filePaths.length > 0) {
      const folderPath = filePaths[0]
      new ProjectInitializer(folderPath)
      event.returnValue = folderPath
      return
    }
    event.returnValue = ''
    return
  })

  ipcMain.on('getCurrentWorkSpace', (event) => {
    event.returnValue = 'SOME VALUES'
  })
}

export default regesterWorkspaceHandler
