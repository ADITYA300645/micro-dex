import { ipcMain } from 'electron'

function registerWindowIpcControlls(mainWindow) {
  ipcMain.on('minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('maximize', () => {
    if (mainWindow.isMaximized() === true) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('close', () => {
    mainWindow.close()
  })
}

export default registerWindowIpcControlls
