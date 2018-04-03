/* ***
******* PAGINATION RESPONSE FIELD INFORMATION *********
- content : array - Data of query
- size : int - The number of the page
- number : int - Current page number
- sort : object - Sorting information
- first : bool - True if the response page is the first page
- last : bool - True if the response page is the last page
- numberOfElements : int - The number of data of the current response page
- totalPages : int - The number of the total page.
- totalElements : int - The number of the total element.
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
