import { Toaster } from '@components/ui/toaster'
import { Toaster as Sonner } from '@components/ui/sonner'
import { Outlet } from 'react-router-dom'
const Index = () => {
  return (
    <>
      <div className="w-full h-screen lg:grid lg:grid-cols-2 overflow-hidden">
        <div className="h-full w-full flex items-center justify-center sm:p-12 p-6">
          <Outlet />
        </div>
        <div className="w-full h-full hidden lg:block p-5">
          <img
            src="https://images.unsplash.com/photo-1726715245558-69afa5ded798?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Image"
            className="w-full h-full object-cover dark:brightness-[0.2] dark:grayscale rounded-md aspect-video"
          />
        </div>
      </div>
      <Toaster />
      <Sonner
        richColors
        theme="light"
        toastOptions={{}}
        closeButton
        visibleToasts={4}
      />
    </>
  )
}

export default Index
