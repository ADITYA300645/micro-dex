import { parse } from 'parse5'
import fs from 'fs/promises'
import path from 'path'

export default class HTMLSerializer {
  constructor(filePath, destination) {
    this.filePath = filePath
    this.outputFilePath = destination
  }

  static removeCircularReferences() {
    const seen = new Set()
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return
        }
        seen.add(value)
      }
      return value
    }
  }

  static serializeHtmlStructure(node, level = 0) {
    if (!node || node.nodeName === '#text') return
    if (node.attrs) {
      if (!Array.isArray(node.attrs)) {
        node.attrs = Object.entries(node.attrs).map(([name, value]) => ({ name, value }))
      }
      const sIdAttr = node.attrs.find((attr) => attr.name === 's_id')
      if (!sIdAttr) {
        node.attrs.push({ name: 's_id', value: `${level}.0` })
      }
    } else {
      node.attrs = [{ name: 's_id', value: `${level}.0` }]
    }
    if (node.childNodes && Array.isArray(node.childNodes)) {
      let nonTextNodeIndex = 0
      node.childNodes.forEach((child) => {
        if (child.nodeName !== '#text') {
          if (child.attrs) {
            if (!Array.isArray(child.attrs)) {
              child.attrs = Object.entries(child.attrs).map(([name, value]) => ({ name, value }))
            }
            const sIdAttr = child.attrs.find((attr) => attr.name === 's_id')
            if (!sIdAttr) {
              child.attrs.push({ name: 's_id', value: `${level + 1}.${nonTextNodeIndex}` })
            }
          } else {
            child.attrs = [{ name: 's_id', value: `${level + 1}.${nonTextNodeIndex}` }]
          }
          nonTextNodeIndex++
        }
        HTMLSerializer.serializeHtmlStructure(child, level + 1)
      })
    }
    return node
  }

  async readHtmlFile() {
    try {
      return await fs.readFile(this.filePath, 'utf-8')
    } catch (error) {
      console.error(`Error reading file: ${this.filePath}`, error)
      throw error
    }
  }

  async ensureOutputDirectory() {
    const directory = path.dirname(this.outputFilePath) // Get the parent directory
    try {
      await fs.mkdir(directory, { recursive: true }) // Ensure the directory exists
    } catch (error) {
      console.error(`Error creating directory: ${directory}`, error)
      throw error
    }
  }

  async writeJsonFile(jsonData) {
    try {
      await fs.writeFile(this.outputFilePath, jsonData, 'utf-8')
    } catch (error) {
      console.error(`Error writing file: ${this.outputFilePath}`, error)
      throw error
    }
  }

  async serializeHtmlToJson() {
    try {
      await this.ensureOutputDirectory()
      const rawHtml = await this.readHtmlFile()
      const parsedHtml = parse(rawHtml)
      const serializedHtml = HTMLSerializer.serializeHtmlStructure(parsedHtml)
      const jsonOutput = JSON.stringify(
        serializedHtml,
        HTMLSerializer.removeCircularReferences(),
        2
      )
      await this.writeJsonFile(jsonOutput)
    } catch (error) {
      console.error('Serialization process failed:', error)
    }
  }
}
