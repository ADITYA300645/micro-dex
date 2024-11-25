import {createMemo, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import CSSAlignment from './PropertiesComponents/CSSAlignment'
import DimensionsControl from './PropertiesComponents/DimensionsControl'

const DeclaredCssControl = (props) => {
  // Define mappings for grouped and single controls
  const propertyPairs = {
    dimensions: {
      properties: ['height', 'width'],
      component: DimensionsControl
    }
  }

  const singleControls = {
    'align-items': CSSAlignment // Ensure this matches the props key
  }

  // Define categories for organizing controls
  const categories = {
    Layout: ['dimensions', 'align-items'],
    Appearance: ['background', 'color'] // Modify as needed
  }

  // Categorize controls dynamically based on props.properties
  const categorizedControls = createMemo(() => {
    const processedProperties = new Set()
    const categoryMap = {}

    for (const [category, keys] of Object.entries(categories)) {
      categoryMap[category] = []

      keys.forEach((key) => {
        if (processedProperties.has(key)) return

        if (propertyPairs[key]) {
          // Handle grouped properties (e.g., dimensions)
          const pairValues = {}
          propertyPairs[key].properties.forEach((prop) => {
            pairValues[prop] = props.properties[prop]
            processedProperties.add(prop)
          })

          categoryMap[category].push({
            type: 'pair',
            key,
            component: propertyPairs[key].component,
            values: pairValues
          })
        } else if (singleControls[key] && key in props.properties) {
          // Handle single controls with validation from props.properties
          categoryMap[category].push({
            type: 'single',
            property: key,
            value: props.properties[key],
            component: singleControls[key]
          })
          processedProperties.add(key)
        }
      })
    }

    return categoryMap
  })

  // Handlers for updating properties
  const handleChange = (property, newValue) => {
    console.log(property, newValue)
    props.onChange?.(property, newValue)
  }

  const handlePairChange = (updates) => {
    Object.entries(updates).forEach(([prop, value]) => {
      props.onChange?.(prop, value)
    })
  }

  // Render the categorized controls
  return (
    <div class="space-y-4">
      <For each={Object.entries(categorizedControls())}>
        {([category, controls]) => (
          <Show when={controls.length > 0}>
            <div>
              {/* Category Header */}
              <div class="gap-2 px-2 py-2 text-gray-500 dark:text-[#848484] border-b-[0.5px] dark:border-b-[#333] mb-2">
                <span class="text-xs font-medium">{category}</span>
              </div>
              {/* Render Controls */}
              <For each={controls}>
                {(entry) =>
                  entry.type === 'pair' ? (
                    <Dynamic
                      component={entry.component}
                      values={entry.values}
                      onChange={handlePairChange}
                    />
                  ) : (
                    <div>
                      <Dynamic
                        component={entry.component}
                        value={entry.value}
                        onChange={[handleChange, entry.property]}
                      />
                    </div>
                  )
                }
              </For>
            </div>
          </Show>
        )}
      </For>
    </div>
  )
}

export default DeclaredCssControl
