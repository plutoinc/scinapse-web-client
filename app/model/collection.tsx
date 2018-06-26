import { MemberWithCollection } from "./member";

export interface Collection {
  id: number;
  createdBy: MemberWithCollection;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
