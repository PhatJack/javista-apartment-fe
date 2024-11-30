import SettingForm from './components/setting-form'
import BreadCrumb from '@/components/breadcrumb'
import { useDocumentTitle } from 'usehooks-ts'
import { useGetSettingsQuery } from '@/features/setting/settingSlice'

const Index = () => {
  useDocumentTitle('Setting')
  const { data: setting,isLoading,isFetching } = useGetSettingsQuery()

  return (
    <>
      <div className="w-full sm:h-screen flex flex-col bg-zinc-100 overflow-hidden">
        <BreadCrumb paths={[{ label: 'setting' }]} />
        <div className="size-full p-4">
          <div className="size-full p-4 bg-white rounded-md ">
            <div className="size-full flex flex-col gap-4 overflow-hidden">
							<SettingForm setting={setting} isFetching={isFetching} isLoading={isLoading}  />
						</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index
