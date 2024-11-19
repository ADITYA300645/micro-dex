import fs from 'fs/promises'
import path from 'path'
import HTMLSerializer from './html-serializer/htmlSerializer'
import CSSManager from './css-serializer/cssSerializer'

export default class FilesSerializer {
  constructor(folderPath, basePath) {
    this.folderPath = folderPath
    this.basePath = basePath
    var sourceSplit = folderPath.split(basePath)
    this.destination = path.join(
      basePath,
      '.sarthi/project-structure',
      sourceSplit[sourceSplit.length - 1]
    )
    console.log('destination decided', this.destination)
  }

  static hasExtension(fileName, extension) {
    return path.extname(fileName).toLowerCase() === extension
  }

  async scanAndSerializeAll() {
    try {
      const entries = await fs.readdir(this.folderPath, { withFileTypes: true })

      for (const entry of entries) {
        if (entry.isFile()) {
          const fullPath = path.join(this.folderPath, entry.name)

          if (FilesSerializer.hasExtension(entry.name, '.html')) {
            const htmlSerializer = new HTMLSerializer(
              fullPath,
              path.join(this.destination, `${entry.name}.json`)
            )

            await htmlSerializer.serializeHtmlToJson()
          }

          if (FilesSerializer.hasExtension(entry.name, '.css')) {
            console.log(`Found CSS file: ${entry.name}`)
            const cssPath = path.join(this.folderPath, entry.name)
            var cssManager = new CSSManager(
              cssPath,
              path.join(this.destination, `${entry.name}.json`)
            )
            // this.serializeCss(fullPath);
            cssManager.parseCssToJson() // Reading from Css
          }

          if (FilesSerializer.hasExtension(entry.name, '.js')) {
            console.log(`Found JS file: ${entry.name}`)
            // TODO: Call JS serialization method here
            // this.serializeJs(fullPath);
          }
        }
      }
    } catch (err) {
      console.error('Error scanning folder:', err)
    }
  }
}
