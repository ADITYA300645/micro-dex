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
  return !RESTRICTED_TAGS.has(tag)
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
  const IGNORED_TAGS = new Set(['head', 'title', 'meta'])
  return IGNORED_TAGS.has(tag)
}

export default function jsonComponentRenderer(node) {
  if (node.nodeName === '#text') {
    return node.value
  }

  if (shouldNotRenderTag(node.tagName)) {
    return <></>
  }

  const attrs = {}
  if (Array.isArray(node.attrs)) {
    node.attrs.forEach((attr) => {
      attrs[attr.name] = attr.value
    })
    // Ensure every element has a class for debugging or styling
    if (!attrs['class']) {
      attrs['class'] = `${node.tagName}`
    }
  }

  if (!node.tagName) {
    // Handle generic wrapper for child nodes
    return (
      <div>
        <For each={node.childNodes || []}>{(child) => jsonComponentRenderer(child)}</For>
      </div>
    )
  }


  if (isHTag(node.tagName)) {
    return (
      <div ref={self} {...attrs} class={`${hTagSize(node.tagName)} font-semibold py-1 text-black`}>
        <For each={node.childNodes}>{(child) => jsonComponentRenderer(child)}</For>
      </div>
    )
  }

  const Tag = node.tagName
  if (!isSolidRenderableTag(Tag)) {
    // Wrap unsupported tags in a div
    return (
      <div {...attrs}>
        <For each={node.childNodes || []}>{(child) => jsonComponentRenderer(child)}</For>
      </div>
    )
  }

  return (
    <Dynamic component={Tag} {...attrs}>
      <For each={node.childNodes || []}>{(child) => jsonComponentRenderer(child)}</For>
    </Dynamic>
  )
}
