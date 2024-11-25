import { createSignal, createEffect } from 'solid-js'
import DeclaredCssControl from './Components/DeclaredCssControl'

export const ValuesRenderer = (props) => {
  // Use createSignal to hold the properties
  const [properties, setProperties] = createSignal({})

  createEffect(() => {
    const element = props.currentlySelectedElement()
    if (!element) return

    let combinedProperties = {}

    const cssProperties = props.cssProperties || {}

    // Handle ID-based CSS
    if (element.id && cssProperties[`#${element.id}`]) {
      Object.assign(combinedProperties, cssProperties[`#${element.id}`])
    }

    if (element.className) {
      element.className.split(' ').forEach((className) => {
        if (cssProperties[`.${className}`]) {
          Object.assign(combinedProperties, cssProperties[`.${className}`])
        }
        if (cssProperties[className]) {
          Object.assign(combinedProperties, cssProperties[className])
        }
      })
    }

    if (element.tagName) {
      const tagNameLowerCase = element.tagName.toLowerCase()
      if (cssProperties[tagNameLowerCase]) {
        Object.assign(combinedProperties, cssProperties[tagNameLowerCase])
      }
    }

    setProperties(combinedProperties)
  })

  const handlePropertyChange = (property, value) => {
    const cssProperties = { ...props.cssProperties } // Clone the current CSS properties
    const element = props.currentlySelectedElement()
    if (!element) return

    // Handle special cases for `html` and `body` classes
    if (element.className === 'html') {
      if (!cssProperties.html) {
        cssProperties.html = {} // Create the `html` entry if it doesn't exist
      }
      cssProperties.html[property] = value
      props.onCssPropertiesChange?.(cssProperties)
      return
    }

    if (element.className === 'body') {
      if (!cssProperties.body) {
        cssProperties.body = {} // Create the `body` entry if it doesn't exist
      }
      cssProperties.body[property] = value
      props.onCssPropertiesChange?.(cssProperties)
      return
    }

    // 2. Check and modify ID-based properties
    if (element.id) {
      const idKey = `#${element.id}`
      if (!cssProperties[idKey]) {
        cssProperties[idKey] = {} // Create new ID entry if it doesn't exist
      }
      cssProperties[idKey][property] = value
      props.onCssPropertiesChange?.(cssProperties)
      return
    }

    // 1. Check and modify class-based properties
    if (element.className) {
      let classHandled = false
      element.className.split(' ').forEach((className) => {
        console.log(className)
        const classKey = `.${className}`
        if (cssProperties[classKey]) {
          cssProperties[classKey][property] = value
          classHandled = true
        }
      })
      if (classHandled) {
        // If class was handled, notify and return
        props.onCssPropertiesChange?.(cssProperties)
        return
      }
    }



    // 3. Check and modify tag-based properties
    const tagName = element.tagName.toLowerCase()
    if (!cssProperties[tagName]) {
      cssProperties[tagName] = {}
    }
    cssProperties[tagName][property] = value
    props.onCssPropertiesChange?.(cssProperties)
  }

  return (
    <div>
      <DeclaredCssControl properties={properties()} onChange={handlePropertyChange} />
    </div>
  )
}
