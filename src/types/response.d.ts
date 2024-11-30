interface ResponseDataType<T> {
  data: T[]
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
}

interface BaseEntity {
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string
}

type QueryArgs<T,U> = T & Partial<U>;