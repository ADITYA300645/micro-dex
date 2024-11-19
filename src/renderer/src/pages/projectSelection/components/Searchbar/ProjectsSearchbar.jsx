import { Search } from "lucide-solid"

function ProjectsSearchbar() {
  return (
    <div class="w-full flex justify-center items-center">
        <div class="flex justify-start items-center bg-white dark:bg-gray-700 opacity-70 rounded w-full mx-4 px-4 text-[#979797] min-h-10">
            <Search></Search>
            <div class="w-2"></div>
            <input class="w-full h-full outline-none p-3 text-xl dark:bg-gray-700 dark:text-white"></input>
        </div>
    </div>
  )
}

export default ProjectsSearchbar