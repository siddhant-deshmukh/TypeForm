import CenterPanel from './CenterPanel'
import QuesListSidebar from './QueTitleLIst/QuesListSidebar'
import QuestionSetting from './QuestionSetting'

export default function Create() {
  return (
    <div className='w-full flex match-navbar'>
      {/* Question List */}
      <QuesListSidebar />
      {/* Ques */}
      <div className='bg-slate-100 w-full px-5 py-5 flex items-center'>
        <CenterPanel />
      </div>
      {/* Edit Question */}
      <QuestionSetting />
    </div>
  )
}
