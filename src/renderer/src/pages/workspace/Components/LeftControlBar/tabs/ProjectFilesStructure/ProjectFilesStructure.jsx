import { createSignal, createEffect, For, Show } from 'solid-js'
import { useLocation } from '@solidjs/router'
import { AiFillFolder, AiOutlineFile, AiOutlineFileImage, AiOutlineFolder } from 'solid-icons/ai'
import { FaSolidCode } from 'solid-icons/fa'
import styles from './ProjectFilesStructureStyle.module.css'

const Icons = {
  ChevronRight: AiFillFolder,
  ChevronDown: AiOutlineFolder,
  Folder: AiOutlineFolder,
  File: AiOutlineFile,
  Image: AiOutlineFileImage,
  Code: FaSolidCode
}

const FileItem = (props) => {
  const { file, level = 0 } = props

  const getFileIcon = (file) => {
    if (file.type === 'directory') {
      return null
    }
    const extension = file.name.split('.').pop().toLowerCase()
    return extension === 'png' || extension === 'jpg' || extension === 'jpeg' ? (
      <Icons.Image size={20} />
    ) : (
      <Icons.File size={20} />
    )
  }

  return (
    <div style={{ 'padding-left': `${level * 5}px ` }}>
      <div
        class="flex items-center px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#333] text-xs  rounded"
        onClick={async () => {
          props.onSelect(file.path)
          if (file.type === 'directory') {
            props.onToggle(file.path)
          }
        }}
      >
        {file.type === 'directory' && (
          <Show when={props.isExpanded(file.path)} fallback={<Icons.ChevronRight size={16} />}>
            <Icons.ChevronDown size={16} />
          </Show>
        )}
        {getFileIcon(file)}
        <span class="ml-1">{file.name}</span>
      </div>

      <Show when={file.type === 'directory' && props.isExpanded(file.path) && file.children}>
        <For each={file.children}>
          {(child) => (
            <FileItem
              file={child}
              level={level + 1}
              isSelected={props.isSelected}
              isExpanded={props.isExpanded}
              onSelect={props.onSelect}
              onToggle={props.onToggle}
            />
          )}
        </For>
      </Show>
    </div>
  )
}

function ProjectFilesStructure() {
  const location = useLocation()
  const [expanded, setExpanded] = createSignal(new Set())
  const [selected, setSelected] = createSignal(null)
  const [fileStructure, setFileStructure] = createSignal(null)
  const [error, setError] = createSignal(null)

  const readDirectoryStructure = async (dirPath) => {
    const response = await window.fileHandler.readFolder(dirPath)
    if (response.error) {
      setError(response.error)
      return null
    }
    return {
      name: dirPath.split('/').pop(),
      type: 'directory',
      path: dirPath,
      children: response.sort((a, b) => {
        return a.type === 'directory' ? -1 : 1
      })
    }
  }

  const loadDirectoryChildren = async (dirPath) => {
    const structure = fileStructure()
    const findAndUpdateNode = async (node) => {
      if (node.path === dirPath) {
        const children = await readDirectoryStructure(dirPath)
        node.children = children ? children.children : []
        return true
      }
      if (node.children) {
        for (const child of node.children) {
          if (await findAndUpdateNode(child)) return true
        }
      }
      return false
    }
    await findAndUpdateNode(structure)
    setFileStructure({ ...structure })
  }

  createEffect(async () => {
    const dirPath = location.state?.path || process.cwd()
    const structure = await readDirectoryStructure(dirPath)
    if (structure) {
      setFileStructure(structure)
      setExpanded(new Set([dirPath]))
    }
  })

  const toggleDirectory = async (dirPath) => {
    const currentExpanded = expanded()
    const newExpanded = new Set(currentExpanded)
    if (newExpanded.has(dirPath)) {
      newExpanded.delete(dirPath)
    } else {
      newExpanded.add(dirPath)
      await loadDirectoryChildren(dirPath)
    }
    setExpanded(newExpanded)
  }

  const isExpanded = (path) => expanded().has(path)
  const isSelected = (path) => selected() === path

  return (
    <div class={`h-max w-full overflow-hidden group noscrollbar ${styles.fileStructure}`}>
      <div class="p-2 text-sm font-medium text-gray-600 dark:text-gray-300">Explorer</div>
      <Show when={error()}>
        <div class="p-2 text-sm text-red-500">Error: {error()}</div>
      </Show>
      <Show
        when={fileStructure()}
        fallback={<div class="p-2 text-sm text-gray-500">Loading...</div>}
      >
        <FileItem
          file={fileStructure()}
          isSelected={isSelected}
          isExpanded={isExpanded}
          onSelect={setSelected}
          onToggle={toggleDirectory}
        />
      </Show>
    </div>
  )
}

export default ProjectFilesStructure
