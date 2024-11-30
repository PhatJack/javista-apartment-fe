import { useDocumentTitle } from 'usehooks-ts'

import { useAppSelector } from '@/store'
import {
  useLazyGetApartmentQuery,
  useLazyGetApartmentsQuery,
} from '@/features/apartment/apartmentSlice'
import { useEffect, useState } from 'react'
import { ApartmentFormSchema } from '@/schema/apartment.validate'
import FirstLogin from '../firstLogin'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import FunctionBoxList from './components/function-box-list'
import ColumnDisplayInformation from './components/column-display-information'
import ColumnDisplayTable from './components/column-display-table'
import { Skeleton } from '@/components/ui/skeleton'
import { useLazyGetBillsQuery } from '@/features/bill/billSlice'
import { useGetSettingsQuery } from '@/features/setting/settingSlice'
import IsBillOverdue from '../isBillOverdue'
import IsHouseDisrupted from '../isHouseDisrupted'
const Index = () => {
  useDocumentTitle('Home')
  const date = new Date() // Current date
  const [getApartment, { isLoading }] = useLazyGetApartmentQuery()
  const [getBills, { isLoading: isLoadingBills }] = useLazyGetBillsQuery()
  const { data: setting, isLoading: isLoadingSetting } = useGetSettingsQuery()
  const [apartmentData, setApartmentData] = useState<ApartmentFormSchema | undefined>(undefined)
  const [isOverdue, setIsOverdue] = useState<boolean>(false)
  const [isHouseDisrupted, setIsHouseDisrupted] = useState<boolean>(false)
  const [houses, setHouses] = useState<string[]>([])
  const [selectedHouse, setSelectedHouse] = useState<string>(houses[0])
  const user = useAppSelector((state) => state.userReducer.user)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
  }
  const formattedDate = date.toLocaleDateString('en-US', options)
  useEffect(() => {
    if (user) {
      const housesList = user.relationships?.map((item) => item.apartmentId) as string[]
      const isHouseDisrupted = user.relationships?.some(
        (item) => item.apartment?.status === 'DISRUPTION',
      )
      if (isHouseDisrupted) {
        setIsHouseDisrupted(true)
      }
      const housesSet = new Set(housesList)
      setHouses([...housesSet])

      if (housesSet.size > 0 && !selectedHouse) {
        setSelectedHouse([...housesSet][0])
      }
    }
  }, [user])
  useEffect(() => {
    const handleGetBills = async () => {
      if (user) {
        try {
          const payload = await getBills({
            Relationship_UserId: user.id,
            page: 1,
          }).unwrap()
          const hasUnpaidBills = payload.data.some((bill) => bill.status === 'UNPAID')
          const isSystemOverdue = setting?.systemStatus === 'OVERDUE'

          console.log('Has Unpaid Bills:', hasUnpaidBills)
          console.log('Is System Overdue:', isSystemOverdue)

          if (hasUnpaidBills && isSystemOverdue) {
            setIsOverdue(true)
          }
        } catch (error) {
          console.error('Error fetching bills:', error)
        }
      }
    }
    handleGetBills()
  }, [user, setting])
  useEffect(() => {
    const handleGetApartment = async () => {
      if (user && selectedHouse) {
        await getApartment({
          id: selectedHouse,
        })
          .unwrap()
          .then((payload) => {
            setApartmentData(payload)
          })
          .catch(() => {})
      }
    }
    handleGetApartment()
  }, [user, selectedHouse])

  return (
    <>
      <div className="w-full h-full min-h-screen md:h-screen p-4 bg-zinc-100 flex flex-col space-y-4 overflow-hidden">
        <p className="font-medium">{formattedDate}</p>
        <div className="w-full flex justify-between items-center">
          <p className="text-3xl font-bold">Hello, {`${user ? user?.fullName : 'loading...'}`}</p>
          <Select value={selectedHouse} onValueChange={(value) => setSelectedHouse(value)}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select house" />
            </SelectTrigger>
            <SelectContent>
              {houses.map((house, index) => (
                <SelectItem key={index} value={house}>
                  {house}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="size-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="w-full lg:col-span-1 lg:row-span-3 lg:row-start-1 lg:col-start-1 bg-white rounded-md border border-zinc-200 p-4 flex">
            {isLoading && isLoadingBills && isLoadingSetting ? (
              <div className="size-full bg-gray-100 animate-pulse">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </div>
            ) : (
              <ColumnDisplayInformation
                user={user}
                apartmentData={apartmentData}
                selectedHouse={selectedHouse}
              />
            )}
          </div>
          <div className="w-full lg:col-span-3 lg:row-span-3 lg:row-start-1 lg:col-start-2 bg-white rounded-md border border-zinc-200 p-4 flex">
            {isLoading && isLoadingBills && isLoadingSetting ? (
              <div className="size-full bg-gray-100 animate-pulse">
                <Skeleton className="w-full h-10 rounded-none" />
                <Skeleton className="w-full h-10 rounded-none" />
                <Skeleton className="w-full h-10 rounded-none" />
                <Skeleton className="w-full h-10 rounded-none" />
              </div>
            ) : (
              <ColumnDisplayTable apartmentData={apartmentData} />
            )}
          </div>
          {user &&
            user?.userType === 'RESIDENT' &&
            user.relationships?.some((user) => user.role == 'OWNER') && (
              <div className="w-full grid grid-cols-1 min-[600px]:grid-cols-2 md:grid-cols-4 gap-4 col-span-1 md:col-span-2 lg:col-span-4">
                <FunctionBoxList />
              </div>
            )}
        </div>
      </div>
      {user && user.isFirstLogin && <FirstLogin />}
      {user && isOverdue && <IsBillOverdue />}
      {user && isHouseDisrupted && <IsHouseDisrupted />}
    </>
  )
}

export default Index
