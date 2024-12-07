import { ipcMain } from 'electron'
import ProjectComponentsHandler from '../controllers/components-serializer/ProjectComponentsHandler'

function registerIpcComponentsController(basePath) {
  const componentHandler = new ProjectComponentsHandler(basePath)

  ipcMain.handle('addComponent', async (event, html, css, name) => {
    try {
      componentHandler.addComponent(html, css, name)
      return { success: true }
    } catch (error) {
      console.error('Error adding component:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('updateComponent', async (event, html, css, name) => {
    try {
      componentHandler.updateComponent(html, css, name)
      return { success: true }
    } catch (error) {
      console.error('Error updating component:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('deleteComponent', async (event, name) => {
    try {
      componentHandler.deleteComponent(name)
      return { success: true }
    } catch (error) {
      console.error('Error deleting component:', error)
      return { success: false, error: error.message }
    }
  })

  ipcMain.handle('getComponents', async () => {
    try {
      const components = componentHandler.getComponents()

      return { success: true, components }
    } catch (error) {
      console.error('Error retrieving components:', error)
      return { success: false, error: error.message }
    }
  })
}

export default registerIpcComponentsController
