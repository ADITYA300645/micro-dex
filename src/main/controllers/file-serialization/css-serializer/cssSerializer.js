const fs = require('fs')
const postcss = require('postcss')

export default class CSSManager {
  /**
   * Initializes the CSSManager with paths for the CSS and JSON files.
   * @param {string} cssPath - Path to the CSS file.
   * @param {string} jsonPath - Path to the JSON file.
   */
  constructor(cssPath, jsonPath) {
    this.cssPath = cssPath
    this.jsonPath = jsonPath

    console.log('css path : ', cssPath)
    console.log('json path : ', jsonPath)
    this.cssJson = {}
  }

  /**
   * Recursively parses CSS rules into a JSON structure.
   * @param {Object} parent - PostCSS root or rule object.
   * @returns {Object} - JSON representation of the CSS rules.
   */
  parseRules(parent) {
    const rulesJson = {}

    parent.walkRules((rule) => {
      const selector = rule.selector
      if (!rulesJson[selector]) rulesJson[selector] = {}

      rule.walkDecls((decl) => {
        rulesJson[selector][decl.prop] = decl.value
      })
    })

    // Handle nested rules and at-rules
    parent.walkAtRules((atRule) => {
      const atRuleName = `@${atRule.name} ${atRule.params}`
      if (!rulesJson[atRuleName]) rulesJson[atRuleName] = {}

      rulesJson[atRuleName] = this.parseRules(atRule)
    })

    return rulesJson
  }

  /**
   * Reads the CSS file and parses it into JSON.
   */
  parseCssToJson() {
    const cssContent = fs.readFileSync(this.cssPath, 'utf8')
    const root = postcss.parse(cssContent)
    this.cssJson = this.parseRules(root)

    this.writeJsonToFile() // Save the parsed JSON to the JSON file
  }

  /**
   * Recursively serializes JSON back into CSS.
   * @param {Object} cssJson - JSON representation of CSS.
   * @param {number} indentLevel - Current indentation level for formatting.
   * @returns {string} - CSS as a string.
   */
  static serializeRules(cssJson, indentLevel = 0) {
    const indent = '  '.repeat(indentLevel) // Use two spaces per indentation level
    let cssString = ''

    for (const key in cssJson) {
      if (key.startsWith('@')) {
        // Handle at-rules (e.g., @media, @keyframes)
        cssString += `${indent}${key} {\n`
        cssString += CSSManager.serializeRules(cssJson[key], indentLevel + 1)
        cssString += `${indent}}\n`
      } else if (typeof cssJson[key] === 'object') {
        // Handle regular rules
        cssString += `${indent}${key} {\n`
        const properties = cssJson[key]
        for (const prop in properties) {
          if (typeof properties[prop] === 'object') {
            // Nested rules
            cssString += CSSManager.serializeRules({ [prop]: properties[prop] }, indentLevel + 1)
          } else {
            cssString += `${indent}  ${prop}: ${properties[prop]};\n`
          }
        }
        cssString += `${indent}}\n`
      }
    }

    return cssString
  }

  /**
   * Writes the current JSON representation of the CSS to the JSON file.
   */
  writeJsonToFile() {
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.cssJson, null, 2), 'utf8')
  }

  /**
   * Reads the JSON file to load the CSS JSON representation.
   */
  loadJson() {
    if (fs.existsSync(this.jsonPath)) {
      const jsonContent = fs.readFileSync(this.jsonPath, 'utf8')
      this.cssJson = JSON.parse(jsonContent)
    }
  }

  /**
   * Adds or updates a property in the JSON for a given selector or at-rule.
   * @param {string} selector - CSS selector to modify.
   * @param {string} property - CSS property to add or update.
   * @param {string} value - Value for the CSS property.
   * @param {string} [atRule] - Optional at-rule to target (e.g., `@media screen and (max-width: 600px)`).
   */
  updateCssProperty(selector, property, value, atRule = null) {
    if (atRule) {
      if (!this.cssJson[atRule]) this.cssJson[atRule] = {}
      if (!this.cssJson[atRule][selector]) this.cssJson[atRule][selector] = {}
      this.cssJson[atRule][selector][property] = value
    } else {
      if (!this.cssJson[selector]) this.cssJson[selector] = {}
      this.cssJson[selector][property] = value
    }

    this.writeJsonToFile() // Save changes to JSON file
  }

  /**
   * Serializes the JSON representation back into a CSS string and writes it to the CSS file.
   */
  serializeJsonToCss() {
    const cssString = CSSManager.serializeRules(this.cssJson)
    fs.writeFileSync(this.cssPath, cssString, 'utf8')
  }
}
