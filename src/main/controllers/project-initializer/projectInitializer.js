import fs from 'fs/promises' // Import promises API from fs
import path from 'path'
import FilesSerializer from '../file-serialization/FilesSerializer'

export default class ProjectInitializer {
  constructor(basePath) {
    console.log(basePath)
    this.basePath = basePath
    this.ignoreFolders = new Set(['node_modules', '.git', '.sarthi', '.vscode'])
    this.sarthiPath = path.join(basePath, '.sarthi/project-structure')
    this.initializeProject()
    const filesSerializer = new FilesSerializer(path.join(this.basePath), this.basePath)
    filesSerializer.scanAndSerializeAll()
  }

  async doesSarthiExist() {
    try {
      const files = await fs.readdir(this.basePath)
      return files.includes('.sarthi')
    } catch (err) {
      console.error(`Error checking for .sarthi folder:`, err)
      return false
    }
  }

  isDirectory(location) {
    try {
      const stats = fs.statSync(location)
      return stats.isDirectory()
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false
      } else {
        throw err
      }
    }
  }

  async initializeProject() {
    const sarthiExists = await this.doesSarthiExist()
    if (sarthiExists) {
      console.log('does exist')
    } else {
      console.log('does not exist')
      await fs.mkdir(this.sarthiPath, { recursive: true })
      await this.createParallelStyleFolder(this.basePath, this.sarthiPath)
    }
  }

  async createParallelStyleFolder(sourcePath, destinationPath,i=20) {
    if(i < 0) return;
    try {

      const entries = await fs.readdir(sourcePath, { withFileTypes: true })

      for (const entry of entries) {

        if (!this.ignoreFolders.has(entry.name) && entry.isDirectory()) {
          const sourceDirPath = path.join(sourcePath, entry.name)
          const destDirPath = path.join(destinationPath, entry.name)

          try {
            await fs.mkdir(destDirPath, { recursive: true })
            const filesSerializer = new FilesSerializer(sourceDirPath, this.basePath)
            await filesSerializer.scanAndSerializeAll()
            await this.createParallelStyleFolder(sourceDirPath, destDirPath,i-1)
          } catch (mkdirErr) {
            console.error(`Error creating folder ${destDirPath}:`, mkdirErr)
          }
        }
      }
    } catch (readdirErr) {
      console.error(`Error reading directory ${sourcePath}:`, readdirErr)
    }
  }
}
