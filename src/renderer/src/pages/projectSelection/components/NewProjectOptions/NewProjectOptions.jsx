import { FolderIcon, GithubIcon } from 'lucide-solid'
import { VsAdd } from 'solid-icons/vs'
import ProjectListTile from './components/ProjectListTile'
import { useNavigate } from '@solidjs/router'

function NewProjectOptions() {
  const navigate = useNavigate()

  return (
    <div class="">
      <h2 class="text-xl font-bold mx-4 mt-4 opacity-65">Import or Create a Project</h2>
      <ProjectListTile
        onClick={async () => {
          var res = await window.workspaceManager.openNewProject()
          if (res) navigate('/workspace', { state: { path: res } })
          else console.log('project not selected')
        }}
        Icon={FolderIcon}
        subtitle="Add an existing project from your files"
        title="Select a Folder"
      />
      <ProjectListTile
        onClick={() => console.log(window.workspaceManager.getCurrentWorkSpace())}
        Icon={VsAdd}
        subtitle="Use a template to start a new project"
        title="Create from Template"
      />
      <ProjectListTile
        Icon={GithubIcon}
        subtitle="Import a project directly from GitHub"
        title="Import from GitHub"
      />
    </div>
  )
}

export default NewProjectOptions
