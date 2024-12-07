const isHtmlTag = (selector) => {
  const HTML_TAGS = [
    'html',
    'head',
    'body',
    'document',
    'doctype',
    'title',
    'meta',
    'base',
    'link',
    'script',
    'noscript',
    'style'
  ]
  const selectorParts = selector.split(/[\s,:]/).map((part) => part.trim())
  return selectorParts.some((part) => HTML_TAGS.includes(part.toLowerCase()))
}

const processSelector = (selector) => {
  if (selector.startsWith('@')) return selector

  return selector
    .split(',')
    .map((part) => {
      const selectorParts = part.trim().split(/\s+/)
      return selectorParts
        .map((subPart) => {
          const [baseSelector, ...pseudoParts] = subPart.split(':')
          const pseudo = pseudoParts.length ? ':' + pseudoParts.join(':') : ''

          if (
            isHtmlTag(baseSelector) &&
            !baseSelector.startsWith('.') &&
            !baseSelector.startsWith('#')
          ) {
            return `.applicationWrapper ${baseSelector}${pseudo}`
          }
          return baseSelector + pseudo
        })
        .join(' ')
    })
    .join(', ')
}

const convertCssJsonToStringComponent = (cssJson) => {
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
          cssString += `  ${prop}: ${properties[prop]};\n`
        }
        cssString += '}\n'
      }
    }
    return cssString
  }

  return `.componentWrapper {\n${serializeRules(cssJson)}\n}`
}

export default convertCssJsonToStringComponent
