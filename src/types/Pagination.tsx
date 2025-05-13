export type Pagination<T> = {
  items: any
  count: number
  results: T[]
}

export type PaginationParams = {
  page: number
  pageSize: number
  search: string
}
