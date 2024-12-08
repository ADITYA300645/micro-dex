import { parse } from 'parse5'
import fs from 'fs/promises'
import path from 'path'

export default class HTMLSerializer {
  constructor(filePath, destination) {
    this.filePath = filePath
    this.outputFilePath = destination
  }

  // Remove circular references during JSON serialization
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

  // Recursively serialize the HTML structure and populate `s_id`s
  static serializeHtmlStructure(node, parentSId = '1', idx = 0) {
    if (!node) return

    if (!node.attrs) node.attrs = []
    if (!node.s_id) node.s_id = `${parentSId}.${idx + 1}`
    const existingSId = node.attrs.find((attr) => attr.name === 's_id')
    if (!existingSId) {
      node.attrs.push({ name: 's_id', value: `${parentSId}.${idx + 1}` })
    }

    if (node.childNodes && Array.isArray(node.childNodes)) {
      let nonTextNodeIndex = 1
      node.childNodes.forEach((child, idx) => {
        HTMLSerializer.serializeHtmlStructure(child, `${parentSId}.${nonTextNodeIndex}`, idx)
        nonTextNodeIndex++
      })
    }

    return node
  }

  // Read HTML from file
  async readHtmlFile() {
    try {
      return await fs.readFile(this.filePath, 'utf-8')
    } catch (error) {
      console.error(`Error reading file: ${this.filePath}`, error)
      throw error
    }
  }

  // Ensure output directory exists
  async ensureOutputDirectory() {
    const directory = path.dirname(this.outputFilePath)
    try {
      await fs.mkdir(directory, { recursive: true })
    } catch (error) {
      console.error(`Error creating directory: ${directory}`, error)
      throw error
    }
  }

  // Write JSON to file
  async writeJsonFile(jsonData) {
    try {
      await fs.writeFile(this.outputFilePath, jsonData, 'utf-8')
    } catch (error) {
      console.error(`Error writing file: ${this.outputFilePath}`, error)
      throw error
    }
  }

  // Insert a node into the structure
  static insertNode(parentNode, newNode, prevSId = null, nextSId = null) {
    if (!parentNode.childNodes) parentNode.childNodes = []

    // Calculate new `s_id`
    const computeFractionalSId = (prev, next) => {
      const getHashValue = (id) => parseInt(id.split('#').pop() || '0', 10)
      const base = prev.split('.').slice(0, -1).join('.')
      const prevHash = getHashValue(prev)
      const nextHash = next ? getHashValue(next) : 100
      return `${base}#${Math.floor((prevHash + nextHash) / 2)}`
    }

    const newSId = computeFractionalSId(prevSId, nextSId)
    newNode.attrs.push({ name: 's_id', value: newSId })

    // Insert node in appropriate position
    if (!nextSId) {
      parentNode.childNodes.push(newNode)
    } else {
      const index = parentNode.childNodes.findIndex((child) =>
        child.attrs?.find((attr) => attr.name === 's_id' && attr.value === nextSId)
      )
      if (index === -1) {
        parentNode.childNodes.push(newNode) // Append if nextSId is not found
      } else {
        parentNode.childNodes.splice(index, 0, newNode)
      }
    }
  }

  // Serialize HTML to JSON file
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
