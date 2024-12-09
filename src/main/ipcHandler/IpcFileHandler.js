import CSSManager from '../controllers/file-serialization/css-serializer/cssSerializer'
import HTMLSerializer from '../controllers/file-serialization/html-serializer/htmlSerializer'

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
      const sarthiRoot = path.join(rootPath, '.sarthi/project-structure')
      const controlFolder = await fs.readdir(sarthiRoot)
      const rootFolder = await fs.readdir(rootPath)

      let files = {}
      let fileNames = {}

      for (const entry in rootFolder) {
        if (rootFolder[entry].endsWith('.js')) {
          const content = await fs.readFile(path.join(rootPath, rootFolder[entry]))
          files['js'] = content.toString()
        }
      }
      //  Modded space
      for (const entry in controlFolder) {
        if (controlFolder[entry].endsWith('.html.json')) {
          const content = await fs.readFile(
            path.join(rootPath, '.sarthi/project-structure', controlFolder[entry])
          )
          files['html'] = JSON.parse(content.toString())
          var htmlFileNameParts = controlFolder[entry].split('.')
          htmlFileNameParts.pop()
          fileNames['html'] = path.join(rootPath, htmlFileNameParts.join('.'))
        }
        if (controlFolder[entry].endsWith('.css.json')) {
          const content = await fs.readFile(
            path.join(rootPath, '.sarthi/project-structure', controlFolder[entry])
          )
          files['css'] = JSON.parse(content.toString())
          var cssFileNameParts = controlFolder[entry].split('.')
          cssFileNameParts.pop()
          fileNames['css'] = path.join(rootPath, cssFileNameParts.join('.'))
        }
      }
      event.returnValue = { files: files, fileNames: fileNames }
    } catch (e) {
      console.log(e)
    }
  })
  ipcMain.on('readMainFilePaths', async (event, rootPath) => {
    try {
      const rootFolder = await fs.readdir(rootPath)
      const files = {}
      for (const entry of rootFolder) {
        const entryPath = path.join(rootPath, entry)
        const stats = await fs.stat(entryPath)
        if (stats.isFile()) {
          const parts = entry.split('.')
          const ext = parts.length > 1 ? parts[parts.length - 1] : ''
          if (ext) {
            if (!files[ext]) {
              files[ext] = []
            }
            files[ext].push(entryPath)
          }
        }
      }
      event.returnValue = files
    } catch (e) {
      console.log(e)
    }
  })

  ipcMain.on('saveProject', (event, html, htmlPath, css, cssPath) => {
    try {
      // console.log(html, htmlPath, css, cssPath)
      var htmlString = HTMLSerializer.jsonToHtml(html)
      fs.writeFile(htmlPath, htmlString)
      var cssString = CSSManager.serializeRules(JSON.parse(css))
      fs.writeFile(cssPath, cssString)
      event.returnValue = 'Done !!'
    } catch (e) {
      console.log(e)
    }
  })
}

export default registerIpcFileControls
