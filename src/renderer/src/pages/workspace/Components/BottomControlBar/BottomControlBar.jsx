import { FaSolidArrowPointer } from 'solid-icons/fa'
import { BsArrowsMove } from 'solid-icons/bs'
import { TbBrandGithubCopilot } from 'solid-icons/tb'
import { AiOutlineAppstoreAdd } from 'solid-icons/ai'
import { VsSave } from 'solid-icons/vs'

const BottomControlBar = (props) => {
  return (
    <div class="fixed bottom-5 left-0 right-0 flex justify-center z-10">
      <div class="dark:hover:[&>*]:bg-neutral-800 hover:[&>*]:bg-[#bbb] dark:bg-black bg-[#fafafa]  dark:text-white rounded-md max-w-[280px] w-full text-center min-h-8 flex items-center justify-evenly p-1 shadow z-50">
        <div class="flex flex-col items-center justify-center dark:bg-neutral-900 px-4 py-2 rounded bg-[#ddd]">
          <FaSolidArrowPointer class="text-xl " />
        </div>
        <div class="flex flex-col items-center dark:bg-neutral-900 bg-[#ddd] justify-center px-4 py-2 rounded">
          <BsArrowsMove class="text-xl" />
        </div>
        <div
          class="flex flex-col items-center dark:bg-neutral-900 bg-[#ddd] justify-center px-4 py-2 rounded"
          onclick={props.switchIsCreateComponenVisible}
        >
          <AiOutlineAppstoreAdd class="text-xl " />
        </div>
        <div
          class="flex flex-col items-center dark:bg-neutral-900 bg-[#ddd] justify-center px-4 py-2 rounded"
          onclick={props.switchIsAiComponentWriterVisible}
        >
          <TbBrandGithubCopilot class="text-xl" />
        </div>
        <div
          class="flex flex-col items-center dark:bg-neutral-900 bg-[#ddd] justify-center px-4 py-2 rounded"
          onclick={props.saveProject}
        >
          <VsSave class="text-xl" />
        </div>
      </div>
    </div>
  )
}

export default BottomControlBar
