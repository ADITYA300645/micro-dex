// This Component requires the json format of html
// from parse 5

import { createSignal, For, Show } from 'solid-js'

import { Dynamic } from 'solid-js/web'

function isSolidRenderableTag(tag) {
  const RESTRICTED_TAGS = new Set([
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
  ])
  if (RESTRICTED_TAGS.has(tag)) {
    return false
  } else {
    return true
  }
}

function isHTag(tag) {
  const H_TAG = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
  if (H_TAG.has(tag)) {
    return true
  } else {
    return false
  }
}

function hTagSize(tag) {
  const H_Tag = {
    h1: 'text-3xl',
    h2: 'text-2xl',
    h3: 'text-xl',
    h4: 'text-lg',
    h5: 'text-md',
    h6: 'text-base'
  }
  return H_Tag[tag]
}

function shouldNotRenderTag(tag) {
  const shouldNotRender = new Set(['head', 'title', 'meta'])
  return shouldNotRender.has(tag)
}

export default function jsonObjectRenderer(node) {
  if (node.nodeName === '#text') {
    const [isTextEditable, setIsTextEditable] = createSignal(false)
    const [textValue, setTextValue] = createSignal(node.value)

    const handleDoubleClick = () => {
      setIsTextEditable(true)
    }

    const handleBlur = () => {
      setIsTextEditable(false)
    }

    const handleInput = (e) => {
      node.value = e.target.value
      setTextValue(e.target.value)
    }

    return (
      <Show
        when={isTextEditable()}
        fallback={
          <div class="" onDblClick={handleDoubleClick}>
            {textValue()}
          </div>
        }
      >
        <input
          type="text"
          value={textValue()}
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleBlur()
            }
          }}
          class="border-none px-1 bg-transparent rounded focus:border-none text-center "
          autoFocus
        />
      </Show>
    )
  }
  if (shouldNotRenderTag(node.tagName)) {
    return <></>
  }
  if (!node.tagName) {
    return (
      <div>
        <For each={node.childNodes}>{(child) => jsonObjectRenderer(child)}</For>
      </div>
    )
  }

  var attrs = {}
  if (Array.isArray(node.attrs)) {
    var isClassPresent = false
    for (const attr of node.attrs) {
      attrs[attr.name] = attr.value
      if (attr.name === 'class') {
        // console.log('class for', node.tagName)
        isClassPresent = true
        // attrs[attr.name] = attr.value + ' ' + `${node.tagName}`
        // console.log('now it is ', attrs[attr.name])
      }
    }
    if (isClassPresent === false) {
      attrs['class'] = `${node.tagName}`
    }
  }
  let self

  if (!isSolidRenderableTag(node.tagName)) {
    return (
      <div ref={self} {...attrs}>
        <For each={node.childNodes}>{(child) => jsonObjectRenderer(child)}</For>
      </div>
    )
  }

  if (isHTag(node.tagName)) {
    return (
      <div ref={self} {...attrs} class={`${hTagSize(node.tagName)} font-semibold py-1`}>
        <For each={node.childNodes}>{(child) => jsonObjectRenderer(child)}</For>
      </div>
    )
  }

  const Tag = node.tagName
  return (
    <Dynamic ref={self} component={Tag} {...attrs}>
      <For each={node.childNodes}>{(child) => jsonObjectRenderer(child)}</For>
    </Dynamic>
  )
}
