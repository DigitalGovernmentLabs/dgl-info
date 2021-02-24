import { Faq } from "$/entity/Faq";
import { FaqGroup } from "$/entity/FaqGroup";
import { DateISO8601 } from "$/utils/date";

export type FaqInfo = Pick<Faq, "id" | "question" | "answer" | "keywords"> & {
  groupId: FaqGroup["id"];
  createDate: DateISO8601 | null;
  updateDate: DateISO8601 | null;
};

export type FaqGroupInfo = Pick<FaqGroup, "id" | "description" | "name">;

export type FaqGroupCreate = Pick<FaqGroup, "name"> &
  Partial<Pick<FaqGroup, "description">>;

export type FaqGroupUpdate = Partial<Pick<FaqGroup, "name" | "description">>;
