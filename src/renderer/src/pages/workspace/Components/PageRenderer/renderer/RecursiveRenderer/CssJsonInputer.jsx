//  InOrder for this to work do not forget
// It takes in raw css json from postcss
/*<style>*/
/*  {typeof props.files.css === 'string'*/
/*    ? props.files.css*/
/*    : convertCssJsonToString(props.files.css)}*/
/*</style>*/

const isHtmlTag = (selector) => {
  const htmlTags = [
    'html',
    'body',
    'div',
    'span',
    'p',
    'a',
    'img',
    'button',
    'input',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',
    'ol',
    'li',
    'table',
    'tr',
    'td',
    'th',
    'thead',
    'tbody',
    'section',
    'article',
    'nav',
    'header',
    'footer',
    'main',
    'aside',
    'pre',
    'code',
    'hr',
    'br',
    'em',
    'strong',
    'i',
    'b',
    'select',
    'option',
    'textarea'
  ]

  // Split selector by spaces, commas, or pseudo-classes/elements
  const selectorParts = selector.split(/[\s,:]/).map((part) => part.trim())
  return selectorParts.some((part) => htmlTags.includes(part.toLowerCase()))
}

const processSelector = (selector) => {
  if (selector.startsWith('@')) return selector

  return selector
    .split(',')
    .map((part) => {
      part = part.trim()
      // Split into individual parts (handling space-separated selectors)
      const selectorParts = part.split(/\s+/)

      return selectorParts
        .map((subPart) => {
          // Preserve pseudo-classes and pseudo-elements
          const [baseSelector, ...pseudoParts] = subPart.split(':')
          const pseudo = pseudoParts.length ? ':' + pseudoParts.join(':') : ''

          // Add dot only if it's an HTML tag and doesn't already have a prefix
          if (
            isHtmlTag(baseSelector) &&
            !baseSelector.startsWith('.') &&
            !baseSelector.startsWith('#')
          ) {
            return '.' + baseSelector + pseudo
          }
          return baseSelector + pseudo
        })
        .join(' ')
    })
    .join(', ')
}

const convertCssJsonToString = (cssJson) => {
  const serializeRules = (json) => {
    let cssString = ''

    for (const key in json) {
      if (key.startsWith('@')) {
        cssString += `${key} {\n${serializeRules(json[key])}}\n`
      } else {
        const processedSelector = processSelector(key)
        cssString += `${processedSelector} {\n`
        const properties = json[key]
        for (const prop in properties) {
          if (typeof properties[prop] === 'object') {
            // Handle nested rules
            cssString += serializeRules({ [prop]: properties[prop] })
          } else {
            cssString += `  ${prop}: ${properties[prop]};\n`
          }
        }
        cssString += '}\n'
      }
    }

    return cssString
  }

  return serializeRules(cssJson)
}

export default convertCssJsonToString
