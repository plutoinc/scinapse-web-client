import { RawPageObjectV2, PageObjectV2 } from "../../api/types/common";

export default function mapPageObject(rawPage: RawPageObjectV2): PageObjectV2 {
  return {
    size: rawPage.size,
    page: rawPage.page,
    first: rawPage.first,
    last: rawPage.last,
    numberOfElements: rawPage.number_of_elements,
    totalElements: rawPage.total_elements,
    totalPages: rawPage.total_pages,
  };
}
