import BreadCrumb from '@/components/breadcrumb'
import ChatList from './components/chat-list'
import ChatContainer from './components/chat-container'
import { useParams } from 'react-router-dom'
import Logo from '@/assets/logo.svg'
const Index = () => {
  const { id } = useParams()

  return (
    <div className="bg-zinc-100 sm:h-screen size-full flex flex-col">
      <BreadCrumb
        paths={[
          {
            label: 'Chat',
						to: '/admin/chat',
          },
          ...(id ? [{ label: id }] : []),
        ]}
      />
      <div className="p-4 h-full flex gap-4 overflow-hidden">
        <div className="sm:w-2/5 lg:w-1/4 w-full bg-white rounded-md overflow-hidden p-3">
          <ChatList />
        </div>
        <div className="bg-white rounded-md sm:w-3/5 lg:w-3/4 w-full overflow-hidden">
          {/* Chat messages section */}
					{
						!id ? (
							<div className="size-full flex flex-col space-y-2 justify-center items-center">
								<img src={Logo} alt="logo" className='size-44 object-cover' />
								<p className="text-zinc-500 font-medium text-lg uppercase">Select a chat to start</p>
							</div>
						) : (
							<ChatContainer />
						)
					}
        </div>
      </div>
    </div>
  )
}

export default Index
