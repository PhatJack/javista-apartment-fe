import { ROUTES } from '@/configs/endpoint'
import { Flag, NotebookText, Package, Receipt } from 'lucide-react'
import FunctionBoxItem, { FunctionBoxProps } from './function-box-item'
import { memo } from 'react'
const FunctionBoxList = () => {
  const functionLists: FunctionBoxProps[] = [
    {
      icon: <Package size={50} className="text-primary" />,
      to: ROUTES.PACKAGES,
      title: 'Packages',
      description: 'Manage your packages',
    },
    {
      icon: <NotebookText size={50} className="text-primary" />,
      to: ROUTES.SURVEYS,
      title: 'Survey',
      description: 'Take a survey',
    },
    {
      icon: <Flag size={50} className="text-primary" />,
      to: ROUTES.REPORTS,
      title: 'Report',
      description: 'Report an issue',
    },
    {
      icon: <Receipt size={50} className="text-primary" />,
      to: ROUTES.BILLS,
      title: 'Bills',
      description: 'Manage your payment',
    },
  ]

  return functionLists.map((item, index) => (
    <div key={index} className={`size-full`}>
      <FunctionBoxItem
        description={item.description}
        icon={item.icon}
        title={item.title}
        to={item.to}
      />
    </div>
  ))
}

export default memo(FunctionBoxList)
