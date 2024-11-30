export const validateDates = (start: string, end: string): boolean => {
  const startDate = new Date(`${start}-01`)
  const endDate = new Date(`${end}-01`)

  if (startDate > endDate) {
    return false
  }
  return true
}