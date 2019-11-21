import { CommonError } from '../../model/error';
/* ***
******* PAGINATION RESPONSE FIELD INFORMATION *********
- content : array - Data of query
- size : int - The number of the page
- number : int - Current page number
- sort : object -  sort information
- first : bool - True if the response page is the first page
- last : bool - True if the response page is the last page
- numberOfElements : int - The number of data of the current response page
- totalPages : int - The number of the total page.
- totalElements : int - The number of the total element.
*** */

/* ***
******* PAGINATION RESPONSE V2 FIELD INFORMATION *********
- content : array - Data of query
- size : int - The number of the page
- page : int - Current page numbe
- first : bool - True if the response page is the first page
- last : bool - True if the response page is the last page
- number_of_elements : int - The number of data of the current response page
- total_pages : int - The number of the total page.
- total_elements : int - The number of the total element.
*** */

export interface CommonPaginationResponsePart {
  size: number;
  number: number;
  sort: string | null;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  totalPages: number;
  totalElements: number;
}

export interface PaginationResponse extends CommonPaginationResponsePart {
  content: any[];
}

export interface RawPageObjectV2 {
  size: number;
  page: number;
  first: boolean;
  last: boolean;
  number_of_elements: number;
  total_elements: number;
  total_pages: number;
}

export interface PageObjectV2 {
  size: number;
  page: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
}

export interface RawPaginationResponseV2<C> {
  data: {
    content: C;
    page: RawPageObjectV2 | null;
  };
  error: CommonError | null;
}

export interface PaginationResponseV2<C> {
  data: {
    content: C;
    page: PageObjectV2 | null;
  };
  error: CommonError | null;
}

export interface NormalizedDataWithPaginationV2<E> {
  entities: E;
  result: string | string[];
  page: PageObjectV2 | null;
  error: CommonError | null;
}
