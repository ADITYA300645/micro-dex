// This Component requires the json format of html
// from parse 5

import { For } from 'solid-js'

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

function shouldNotRenderTag(tag) {
  const shouldNotRender = new Set(['head', 'title', 'meta'])
  return shouldNotRender.has(tag)
}

export default function jsonObjectRenderer(node) {
  if (node.nodeName === '#text') {
    return node.value
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
        attrs[attr.name] = attr.value + ' ' + `${node.tagName}`
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
      <div
        ref={self}
        {...attrs}
        onDragOver={() => (self.style.border = '1px dotted')}
        onDragLeave={() => {
          self.style.opacity = '1'
        }}
      >
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
