//  InOrder for this to work do not forget
// It takes in raw css json from postcss
/*<style>*/
/*  {typeof props.files.css === 'string'*/
/*    ? props.files.css*/
/*    : convertCssJsonToString(props.files.css)}*/
/*</style>*/

const isHtmlTag = (selector) => {
  const htmlTagsRemap = [
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

  // Split selector by spaces, commas, or pseudo-classes/elements
  const selectorParts = selector.split(/[\s,:]/).map((part) => part.trim())
  return selectorParts.some((part) => htmlTagsRemap.includes(part.toLowerCase()))
}

const processSelector = (selector) => {
  if (selector.startsWith('@')) return selector

  return selector
    .split(',')
    .map((part) => {
      part = part.trim()
      const selectorParts = part.split(/\s+/)

      return selectorParts
        .map((subPart) => {
          const [baseSelector, ...pseudoParts] = subPart.split(':')
          const pseudo = pseudoParts.length ? ':' + pseudoParts.join(':') : ''

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

  // Wrap the entire CSS within a `.wrapper` class
  const wrappedCssString = `.applicationWrapper {\n${serializeRules(cssJson)
    .split('\n')
    .map((line) => (line ? `  ${line}` : ''))
    .join('\n')}\n}`
  return wrappedCssString
}

export default convertCssJsonToString
