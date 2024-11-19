const { ipcMain } = require('electron')
const fs = require('fs/promises')
const path = require('path')

function registerIpcFileControls() {
  ipcMain.handle('readFolder', async (event, dirPath) => {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true })
      return await Promise.all(
        items.map(async (item) => {
          const itemPath = path.join(dirPath, item.name)
          const stats = await fs.stat(itemPath)
          return {
            name: item.name,
            type: item.isDirectory() ? 'directory' : 'file',
            path: itemPath,
            size: stats.size,
            modifiedTime: stats.mtime
          }
        })
      )
    } catch (error) {
      console.error('Error reading folder:', error)
      return { error: error.message }
    }
  })

  ipcMain.handle('readFile', async (event, filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return { content }
    } catch (error) {
      console.error('Error reading file:', error)
      return { error: error.message }
    }
  })

  ipcMain.on('readMainFile', async (event, rootPath) => {
    try {
      console.log()
      const sarthiRoot = path.join(rootPath, '.sarthi/project-structure')
      const controlFolder = await fs.readdir(sarthiRoot)
      const rootFolder = await fs.readdir(rootPath)

      var files = {}
      // const injectedScript = document.createElement('script')
      // injectedScript.id = 'injected-script'

      // main base folder read
      // todo: Remove when done experimenting
      for (const entry in rootFolder) {
        if (rootFolder[entry].endsWith('.js')) {
          // injectedScript.src = path.join(rootPath, rootFolder[entry])
          // injectedScript.type = 'module'
          // document.body.appendChild(injectedScript)
        }
      }

      //  Modded space
      for (const entry in controlFolder) {
        if (controlFolder[entry].endsWith('.html.json')) {
          const content = await fs.readFile(
            path.join(rootPath, '.sarthi/project-structure', controlFolder[entry])
          )
          files['html'] = JSON.parse(content.toString())
        }
        if (controlFolder[entry].endsWith('.css.json')) {
          const content = await fs.readFile(
            path.join(rootPath, '.sarthi/project-structure', controlFolder[entry])
          )
          files['css'] = JSON.parse(content.toString())
        }
      }
      event.returnValue = files
    } catch (e) {
      console.log(e)
    }
  })
}

export default registerIpcFileControls
