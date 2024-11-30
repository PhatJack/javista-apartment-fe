import FunctionBox, {
  FunctionBoxProps,
} from '@/pages/user/home/components/function-box-item'
import RecentReports from './components/recent-reports'
import { useAppSelector } from '@/store'
import {
  BellDot,
  Flag,
  HomeIcon,
  NotebookText,
  Package,
  Receipt,
  Settings2,
	UserCog2,
} from 'lucide-react'
import { ROUTES } from '@/configs/endpoint'
import { useDocumentTitle } from 'usehooks-ts'

const Home = () => {
	useDocumentTitle('Admin Home')

  const functionLists: FunctionBoxProps[] = [
    {
      icon: <Package size={50} className="text-primary" />,
      to: ROUTES.ADMIN.PACKAGES,
      title: 'Packages',
      description: 'Manage your packages',
    },
    {
      icon: <NotebookText size={50} className="text-primary" />,
      to: ROUTES.ADMIN.SURVEYS,
      title: 'Survey',
      description: 'Take a survey',
    },
    {
      icon: <Flag size={50} className="text-primary" />,
      to: ROUTES.ADMIN.REPORTS,
      title: 'Report',
      description: 'Report an issue',
    },
    {
      icon: <Receipt size={50} className="text-primary" />,
      to: ROUTES.ADMIN.BILLS,
      title: 'Bills',
      description: 'Manage your payment',
    },
    {
      icon: <HomeIcon size={50} className="text-primary" />,
      to: ROUTES.ADMIN.APARTMENTS,
      title: 'Apartments',
      description: 'Manage your payment',
    },
    {
      icon: <Settings2 size={50} className="text-primary" />,
      to: ROUTES.ADMIN.SETTINGS,
      title: 'Setting',
      description: 'Manage your payment',
    },
		{
      icon: <UserCog2 size={50} className="text-primary" />,
      to: ROUTES.ADMIN.USERS,
      title: 'Users',
      description: 'Manage user accounts',
    },
  ]
  const user = useAppSelector((state) => state.userReducer.user)

  return (
    <div className="size-full flex justify-center items-center bg-zinc-100 lg:h-screen p-4 overflow-hidden">
      <div className="size-full flex flex-col gap-4">
        <div className="w-full flex justify-between items-center bg-white rounded-md px-4 py-3">
          <p className="text-lg font-medium">
            Hello, Adminastrator{' '}
            <span className="text-primary">{user?.fullName}</span>
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-block p-1 rounded-sm cursor-pointer transition-all hover:bg-primary hover:text-white">
              <BellDot />
            </span>
          </div>
        </div>
        <div className="w-full h-full flex lg:flex-row flex-col gap-4 overflow-hidden">
          <div className="lg:w-1/3 w-full">
            <RecentReports />
          </div>
          <div className="lg:w-2/3 w-full grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-rows-3 gap-4">
            {functionLists.map((item, index) => (
              <div key={index} className={`size-full`}>
                <FunctionBox
                  description={item.description}
                  icon={item.icon}
                  title={item.title}
                  to={item.to}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
