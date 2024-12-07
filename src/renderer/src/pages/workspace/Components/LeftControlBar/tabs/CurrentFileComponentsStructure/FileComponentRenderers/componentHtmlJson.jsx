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
