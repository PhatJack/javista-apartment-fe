import { ROUTES } from '@/configs/endpoint'
import { ApartmentUserRole, UserRole } from '@/enums'
import {
  ChartNoAxesCombined,
  Cog,
  Flag,
  HandPlatter,
  House,
  MessageCircleQuestion,
  NotebookText,
  Package,
  Receipt,
  TableCellsMerge,
  UsersRound,
} from 'lucide-react'

export interface SideBarProps {
  label: string
  icon: React.ReactNode
  to: string
  role?: (UserRole | ApartmentUserRole)[]
}

export const sideBarLists: SideBarProps[] = [
  {
    label: 'Home',
    icon: <House />,
    to: ROUTES.HOME,
    role: ['OWNER', 'TENANT'],
  },
  {
    label: 'Packages',
    icon: <Package />,
    to: ROUTES.PACKAGES,
    role: ['TENANT'],
  },
  {
    label: 'Surveys',
    icon: <NotebookText />,
    to: ROUTES.SURVEYS,
    role: ['TENANT'],
  },
  {
    label: 'Reports',
    icon: <Flag />,
    to: ROUTES.REPORTS,
    role: ['TENANT'],
  },
  {
    label: 'Bills',
    icon: <Receipt />,
    to: ROUTES.BILLS,
    role: ['OWNER'],
  },
  {
    label: 'Home',
    icon: <House />,
    to: ROUTES.ADMIN.HOME,
    role: ['ADMIN'],
  },
  {
    label: 'Apartments Management',
    icon: <TableCellsMerge />,
    to: ROUTES.ADMIN.APARTMENTS,
    role: ['ADMIN'],
  },
  {
    label: 'Users Management',
    icon: <UsersRound />,
    to: ROUTES.ADMIN.USERS,
    role: ['ADMIN'],
  },
  {
    label: 'Services Management',
    icon: <HandPlatter />,
    to: ROUTES.ADMIN.SERVICES,
    role: ['ADMIN'],
  },
  {
    label: 'Packages Management',
    icon: <Package />,
    to: ROUTES.ADMIN.PACKAGES,
    role: ['ADMIN'],
  },
  {
    label: 'Bills Management',
    icon: <Receipt />,
    to: ROUTES.ADMIN.BILLS,
    role: ['ADMIN'],
  },
  {
    label: 'Surveys Management',
    icon: <NotebookText />,
    to: ROUTES.ADMIN.SURVEYS,
    role: ['ADMIN'],
  },
  {
    label: 'Reports Management',
    icon: <Flag />,
    to: ROUTES.ADMIN.REPORTS,
    role: ['ADMIN'],
  },
  {
    label: 'Ask For Support',
    icon: <MessageCircleQuestion />,
    to: ROUTES.CHAT,
    role: ['TENANT'],
  },
  {
    label: 'Setting Admin',
    icon: <Cog />,
    to: ROUTES.ADMIN.SETTINGS,
    role: ['ADMIN'],
  },
  {
    label: 'Statistics Management',
    icon: <ChartNoAxesCombined />,
    to: ROUTES.ADMIN.STATISTICS,
    role: ['ADMIN'],
  },
  {
    label: 'Chat',
    icon: <MessageCircleQuestion />,
    to: ROUTES.ADMIN.CHAT,
    role: ['ADMIN'],
  },
]
