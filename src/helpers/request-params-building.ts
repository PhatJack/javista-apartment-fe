export const buildQueryString = (params: Record<string, any>) =>
  Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (typeof value === 'object' && 'operator' in value) {
        // For values with an operator (e.g., { operator: 'gt', value: 10 })
        const { operator, value: val } = value
        return `${key}=${operator}:${Array.isArray(val) ? val.join(',') : val}`
      }
      // For regular equality (default is `eq`)
      return `${key}=eq:${Array.isArray(value) ? value.join(',') : value}`
    })
    .join('&')
