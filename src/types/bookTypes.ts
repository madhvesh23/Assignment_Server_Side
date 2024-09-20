export type IFilter = {
  start: string;
  size: string;
  sorting: string;
  filters: string;
  filterModes: string;
  globalFilter: string;
};
export interface IFilterValue {
  id: string;
  value: string;
}
export type BookUser = {
  id?: string;
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  isbn: string;
};
