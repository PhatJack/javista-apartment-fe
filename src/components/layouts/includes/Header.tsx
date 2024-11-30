import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DefaultAvatar from '@/assets/default-avatar.jpeg'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { LogOut, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useWindowSize } from 'usehooks-ts'
import MobileMenu from './components/MobileMenu'
import Logo from '@/assets/logo.svg'
import LogoMobile from '@/assets/logoMobile.svg'
import { ApartmentUserRole } from '@/enums'
import { useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { ROUTES } from '@/configs/endpoint'
import Cookies from 'universal-cookie'
import { userLoggedOut } from '@/features/auth/authSlice'
import { sideBarLists } from '@/constant/sidebar'

const Header = () => {
  const { width = 0 } = useWindowSize()
  const location = useLocation()
  const navigate = useNavigate()
  const cookies = new Cookies(null, { path: '/' })
  const user = useAppSelector((state) => state.userReducer.user)
  const dispatch = useAppDispatch()
  const [panelRightOpen, setPanelRightOpen] = useState<boolean>(false)

  const filteredSidebars = useMemo(() => {
    if (!user?.userType) return []

    const { userType, relationships } = user

    // Helper function to check if any relationship role matches the condition
    const hasRole = (role: ApartmentUserRole) =>
      relationships?.some((relationship) => relationship.role === role) ?? false

    // If the user is a RESIDENT
    if (userType === 'RESIDENT') {
      const isOwner = hasRole('OWNER')
      const isUser = hasRole('TENANT')

      if (!isOwner && isUser) {
        // Case 1: User has USER role but not OWNER
        return sideBarLists.filter(
          (sidebar) => Array.isArray(sidebar.role) && sidebar.role.includes('TENANT'),
        )
      } else if (isOwner && !isUser) {
        // Case 2: User has OWNER role but not USER
        return sideBarLists.filter(
          (sidebar) => Array.isArray(sidebar.role) && sidebar.role.includes('OWNER'),
        )
      } else if (isOwner && isUser) {
        // Case 3: User has both OWNER and USER roles
        return sideBarLists.filter(
          (sidebar) =>
            Array.isArray(sidebar.role) &&
            (sidebar.role.includes('OWNER') || sidebar.role.includes('TENANT')),
        )
      }
    }

    // For other user types, filter normally
    return sideBarLists.filter((sidebar) => {
      if (Array.isArray(sidebar.role)) {
        return sidebar.role.includes(userType)
      }
      return sidebar.role === userType
    })
  }, [user?.userType])

  const handleLogout = () => {
    cookies.remove('accessToken')
    dispatch(userLoggedOut())
    navigate('/login', { replace: true })
  }

  const isActiveRoute = (route: string) => {
    if (route === ROUTES.ADMIN.HOME) {
      return location.pathname === ROUTES.ADMIN.HOME
    }
    if (route === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME
    }
    return (
      location.pathname.startsWith(route) && route !== ROUTES.ADMIN.HOME && route !== ROUTES.HOME
    )
  }

  return (
    <header
      className={`${
        panelRightOpen ? 'md:w-[60px]' : 'md:w-[300px]'
      } transition-all duration-300 w-full h-20 md:h-screen sticky top-0 z-40 flex md:flex-row flex-col bg-white`}>
      <div className="w-full h-full flex md:flex-col flex-row md:items-stretch items-center md:justify-start justify-between md:p-0 p-4">
        <div className={`md:w-full h-full md:h-[150px] p-1 md:p-3 md:order-none order-2 relative`}>
          <img
            src={panelRightOpen && width > 768 ? LogoMobile : Logo}
            onClick={() => navigate(`${user?.userType === 'ADMIN' ? '/admin' : '/'}`)}
            loading="lazy"
            alt="Logo website"
            className={`size-full object-contain aspect-square cursor-pointer ${
              panelRightOpen && width > 768 ? 'mt-5' : ''
            }`}
          />
          {width > 768 && (
            <Button
              size={'icon'}
              variant={'secondary'}
              onClick={() => setPanelRightOpen(!panelRightOpen)}
              className="absolute top-3 right-3 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  {panelRightOpen ? <PanelRightClose /> : <PanelRightOpen />}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {panelRightOpen ? 'Open menu' : 'Close menu'}
                </TooltipContent>
              </Tooltip>
            </Button>
          )}
        </div>
        {width <= 768 && <MobileMenu sidebar={filteredSidebars} handleLogout={handleLogout} />}
        {width > 768 && <Separator />}
        <div
          className={`sidebar w-full h-full hidden md:flex flex-col overflow-y-auto ${
            panelRightOpen ? 'gap-2 p-2' : 'gap-2 p-4'
          }`}>
          {filteredSidebars.map((sideBar, index) => (
            <Button
              asChild
              type="button"
              key={index}
              variant={'ghost'}
              size={`${panelRightOpen ? 'icon' : 'lg'}`}
              className={`${!panelRightOpen ? 'gap-2 justify-start px-2' : 'justify-center'} ${
                isActiveRoute(sideBar.to) ? 'bg-primary' : ''
              }`}>
              {panelRightOpen ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={sideBar.to}
                      className={`w-full p-2 flex justify-center items-center rounded-md hover:bg-zinc-100 transition-all ${
                        isActiveRoute(sideBar.to) ? 'bg-primary' : ''
                      }`}>
                      {sideBar.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{sideBar.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link to={sideBar.to}>
                  {sideBar.icon}
                  <span>{sideBar.label}</span>
                </Link>
              )}
            </Button>
          ))}
        </div>
        {width > 768 && <Separator />}
        <div
          className={`w-full p-3 hidden ${
            panelRightOpen ? 'flex-col' : 'flex-row'
          } md:flex items-center gap-2`}>
          <Avatar>
            <AvatarImage src={user?.avatar ?? DefaultAvatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className={`w-full ${panelRightOpen ? 'hidden' : 'flex'} flex-col`}>
            <span className="text-sm font-bold">{user?.fullName}</span>
            <span className="text-xs">{user?.userType}</span>
          </div>
          <div className={`flex justify-end`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => handleLogout()} size={'icon'} variant={'ghost'}>
                  <LogOut />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      {width > 768 ? <Separator orientation="vertical" /> : <Separator orientation="horizontal" />}
    </header>
  )
}

export default Header
