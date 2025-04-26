export type Pagination<T> = {
  count: number
  results: T[]
}

export type PaginationParams = {
  page: number
  pageSize: number
  search: string
}
