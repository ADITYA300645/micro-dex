import { parse } from 'parse5'
const postcss = require('postcss')
import path from 'path'
import fs from 'fs'

export default class ProjectComponentsHandler {
  constructor(basePath) {
    this.basePath = basePath
    this.folderPath = path.join(basePath, '.sarthi', 'components')
  }

  parseRules(parent) {
    const rulesJson = {}

    parent.walkRules((rule) => {
      const selector = rule.selector
      if (!rulesJson[selector]) rulesJson[selector] = {}

      rule.walkDecls((decl) => {
        rulesJson[selector][decl.prop] = decl.value
      })
    })

    parent.walkAtRules((atRule) => {
      const atRuleKey = `@${atRule.name} ${atRule.params}`

      if (!rulesJson[atRuleKey]) rulesJson[atRuleKey] = {}

      // Handle nested rules within at-rules
      atRule.walkRules((nestedRule) => {
        const nestedSelector = nestedRule.selector
        if (!rulesJson[atRuleKey][nestedSelector]) rulesJson[atRuleKey][nestedSelector] = {}

        nestedRule.walkDecls((decl) => {
          rulesJson[atRuleKey][nestedSelector][decl.prop] = decl.value
        })
      })
    })

    return rulesJson
  }

  /**
   * Removes circular references from a given object to make it JSON-serializable.
   * @param {Object} obj - The object to remove circular references from.
   * @returns {Object} - A deep copy of the object with circular references removed.
   */
  static removeCircularReferences(obj) {
    const seen = new WeakSet()

    const removeCircular = (input) => {
      if (typeof input === 'object' && input !== null) {
        if (seen.has(input)) {
          return // Circular reference found, skip it
        }
        seen.add(input)

        if (Array.isArray(input)) {
          return input.map((item) => removeCircular(item))
        } else {
          const result = {}
          for (const key in input) {
            if (Object.prototype.hasOwnProperty.call(input, key)) {
              result[key] = removeCircular(input[key])
            }
          }
          return result
        }
      }
      return input // Primitive value
    }

    return removeCircular(obj)
  }

  static extractRelevantNodes(node) {
    // If the current node is a document, html, head, or body, process its children recursively
    if (
      node.nodeName === '#document' ||
      node.tagName === 'html' ||
      node.tagName === 'head' ||
      node.tagName === 'body'
    ) {
      node.tagName = 'div' // Change the tagName to div
      node.nodeName = 'div' // Update the nodeName to div
    }

    // Process child nodes recursively
    if (node.childNodes) {
      for (const child of node.childNodes) {
        ProjectComponentsHandler.extractRelevantNodes(child)
      }
    }

    return node // Return the updated node
  }

  /**
   * Adds a new component with its HTML and CSS.
   * @param {string} html - HTML content.
   * @param {string} css - CSS content.
   * @param {string} name - Component name.
   */
  addComponent(html, css, name) {
    const componentFolderPath = path.join(this.folderPath, name)
    const htmlPath = path.join(componentFolderPath, 'index.html.json')
    const cssPath = path.join(componentFolderPath, 'index.css.json')

    // Parse HTML and CSS
    const jsonHtml = parse(html)
    const jsonCssNode = this.parseRules(postcss.parse(css))

    // Remove circular references if any
    const sanitizedHtml = ProjectComponentsHandler.removeCircularReferences(jsonHtml)
    const mainHtml = ProjectComponentsHandler.extractRelevantNodes(sanitizedHtml)
    const sanitizedCss = ProjectComponentsHandler.removeCircularReferences(jsonCssNode)

    // Create the component folder if it doesn't exist
    fs.mkdirSync(componentFolderPath, { recursive: true })

    // Save the parsed and sanitized HTML and CSS as JSON
    fs.writeFileSync(htmlPath, JSON.stringify(mainHtml, null, 2))
    fs.writeFileSync(cssPath, JSON.stringify(sanitizedCss, null, 2))
    console.log(`Component "${name}" added successfully.`)
  }

  getComponent(name) {
    const componentFolderPath = path.join(this.folderPath, name)
    const htmlPath = path.join(componentFolderPath, 'index.html.json')
    const cssPath = path.join(componentFolderPath, 'index.css.json')

    const html = JSON.parse(fs.readFileSync(htmlPath, 'utf-8'))
    const css = JSON.parse(fs.readFileSync(cssPath, 'utf-8'))

    return { html, css }
  }

  getComponents() {
    const components = []
    const files = fs.readdirSync(this.folderPath)

    files.forEach((file) => {
      const folderPath = path.join(this.folderPath, file)
      const stats = fs.statSync(folderPath)

      if (stats.isDirectory()) {
        const htmlPath = path.join(folderPath, 'index.html.json')
        const cssPath = path.join(folderPath, 'index.css.json')

        const html = fs.existsSync(htmlPath) ? JSON.parse(fs.readFileSync(htmlPath, 'utf-8')) : null
        const css = fs.existsSync(cssPath) ? JSON.parse(fs.readFileSync(cssPath, 'utf-8')) : null

        components.push({ name: file, html, css })
      }
    })

    return components
  }

  deleteComponent(name) {
    const componentFolderPath = path.join(this.folderPath, name)
    const htmlPath = path.join(componentFolderPath, 'index.html.json')
    const cssPath = path.join(componentFolderPath, 'index.css.json')

    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath)
    if (fs.existsSync(cssPath)) fs.unlinkSync(cssPath)
    fs.rmdirSync(componentFolderPath, { recursive: true })

    console.log(`Component "${name}" deleted successfully.`)
  }

  updateComponent(html, css, name) {
    const componentFolderPath = path.join(this.folderPath, name)
    const htmlPath = path.join(componentFolderPath, 'index.html.json')
    const cssPath = path.join(componentFolderPath, 'index.css.json')

    const sanitizedHtml = ProjectComponentsHandler.removeCircularReferences(html)
    const sanitizedCss = ProjectComponentsHandler.removeCircularReferences(css)

    fs.writeFileSync(htmlPath, JSON.stringify(sanitizedHtml, null, 2))
    fs.writeFileSync(cssPath, JSON.stringify(sanitizedCss, null, 2))
    console.log(`Component "${name}" updated successfully.`)
  }
}
