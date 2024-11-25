import { createMemo, For, Show } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import CSSAlignment from './PropertiesComponents/CSSAlignment'
import DimensionsControl from './PropertiesComponents/DimensionsControl' // Assuming you have this component

const DeclaredCssControl = (props) => {



  const propertyPairs = {
    dimensions: {
      properties: ['height', 'width'],
      component: DimensionsControl
    }
    // Add other pairs as needed
  }

  const singleControls = {
    align: CSSAlignment
  }

  const categories = {
    Layout: ['dimensions', 'align'],
    Appearance: ['background', 'color'] // Example; modify as needed
  }

  const categorizedControls = createMemo(() => {
    const processedProperties = new Set()
    const categoryMap = {}

    for (const [category, keys] of Object.entries(categories)) {
      categoryMap[category] = []

      keys.forEach((key) => {
        if (processedProperties.has(key)) return

        if (propertyPairs[key]) {
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
        } else if (singleControls[key]) {
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

  const handleChange = (property, newValue) => {
    props.onChange?.(property, newValue)
  }

  const handlePairChange = (updates) => {
    Object.entries(updates).forEach(([prop, value]) => {
      props.onChange?.(prop, value)
    })
  }

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
                {(entry) => {
                  if (entry.type === 'pair') {
                    return (
                      <Dynamic
                        component={entry.component}
                        values={entry.values}
                        onChange={handlePairChange}
                      />
                    )
                  } else {
                    return (
                      <div>
                        <Dynamic
                          component={entry.component}
                          value={entry.value}
                          onChange={[handleChange, entry.property]}
                        />
                      </div>
                    )
                  }
                }}
              </For>
            </div>
          </Show>
        )}
      </For>
    </div>
  )
}

export default DeclaredCssControl
