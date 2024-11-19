import WindowControlRibbon from '../../components/WindowControlRibbon/WindowControlRibbon'
import LastProjectOption from './components/lastProject/LastProjectOption'
import NewProjectOptions from './components/NewProjectOptions/NewProjectOptions'
import ProjectGrid from './components/ProjectGrid'
import ProjectsSearchbar from './components/Searchbar/ProjectsSearchbar'

function ProjectSelectionScreen() {
  const projects = [
    {
      id: 1,
      imageUrl: 'https://cdn.usegalileo.ai/stability/c8503cf3-2ba7-490b-ba08-e63b8f1934c9.png',
      title: 'Project 1',
      description: 'Create a new project'
    },
    {
      id: 2,
      imageUrl: 'https://cdn.usegalileo.ai/stability/b6abbbe1-12bb-4068-aeff-9d251ab4f4d3.png',
      title: 'Project 2',
      description: 'Create a new project'
    },
    {
      id: 3,
      imageUrl: 'https://cdn.usegalileo.ai/stability/64779b10-76e8-41af-8292-e545e9f8ea76.png',
      title: 'Project 3',
      description: 'Create a new project'
    },
    {
      id: 4,
      imageUrl: 'https://cdn.usegalileo.ai/stability/b6abbbe1-12bb-4068-aeff-9d251ab4f4d3.png',
      title: 'Project 4',
      description: 'Create a new project'
    }
  ]

  return (
    <div class="bodyBackground -z-50">
      <WindowControlRibbon />
      <div class="fixed">
        <div class="absolute w-[110vw] h-[110vh] backdrop-blur-3xl bg-[#d9d9d983] dark:bg-[#48484871]" />
      </div>
      <div
        class=" relative flex size-full min-h-screen flex-col  group/design-root overflow-x-hidden"
        style={{ 'font-family': 'Manrope, "Noto Sans", sans-serif' }}
      >
        <div class="layout-container flex h-full grow flex-col">
          <div class="px-40 flex flex-1 justify-center py-5">
            <div class="layout-content-container flex flex-col max-w-[960px] flex-1">
              <ProjectsSearchbar />
              <NewProjectOptions />
              <LastProjectOption />
              <ProjectGrid projects={projects} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectSelectionScreen
