import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { AlignLeft, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Logo from '@/assets/logo.svg'
import { useAppSelector } from '@/store'
import { SideBarProps } from '@/constant/sidebar'
import DefaultaAvatar from '@/assets/default-avatar.jpeg'

interface MobileMenuProps {
  sidebar: SideBarProps[]
  handleLogout: () => void
}

export default function MobileMenu({ sidebar, handleLogout }: MobileMenuProps) {
  const user = useAppSelector((state) => state.userReducer.user)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} size={'icon'}>
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent aria-describedby={undefined} side={'left'}>
        <div className="w-full h-full flex flex-col gap-2">
          <SheetHeader>
            <SheetTitle aria-hidden="true">
              <span className="text-lg font-bold sr-only">Zity</span>
            </SheetTitle>
            <div className="w-fit md:w-full h-[120px] sm:p-3 sm:order-none order-2">
              <img
                src={Logo}
                loading="lazy"
                alt="Logo website"
                className="w-full h-full object-contain aspect-square"
              />
            </div>
          </SheetHeader>
          <div className="w-full h-full flex flex-col gap-2">
            {sidebar.map((sideBar, index) => (
              <SheetClose key={index} asChild>
                <Button
                  asChild
                  type="button"
                  variant={'ghost'}
                  size={'lg'}
                  className={`gap-2 justify-start px-2 ${
                    (sideBar.to === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(sideBar.to)) && 'bg-primary'
                  }`}>
                  <Link to={sideBar.to}>
                    {sideBar.icon}
                    {sideBar.label}
                  </Link>
                </Button>
              </SheetClose>
            ))}
          </div>
          <div className="w-full mt-5 flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.avatar ?? DefaultaAvatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col">
              <span className="text-sm font-bold">{user?.fullName}</span>
              <span className="text-xs">{user?.userType}</span>
            </div>
            <div className="flex justify-end">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleLogout()} size={'icon'} variant={'ghost'}>
                    <LogOut />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Log out</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
