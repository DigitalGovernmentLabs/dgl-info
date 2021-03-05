import { Faq } from "$/entity/Faq";
import { FaqGroup } from "$/entity/FaqGroup";
import { DateISO8601 } from "$/utils/date";

// Faq Group

export type FaqGroupInfo = Pick<FaqGroup, "id" | "description" | "name"> & {
  faqNumber: number;
};

export type FaqGroupCreate = Pick<FaqGroupInfo, "name"> &
  Partial<Pick<FaqGroupInfo, "description">>;

export type FaqGroupUpdate = Partial<
  Pick<FaqGroupInfo, "name" | "description">
>;

// Faq

export type FaqInfo = Pick<Faq, "id" | "question" | "answer" | "keywords"> & {
  groupId: FaqGroup["id"];
  createDate: DateISO8601 | null;
  updateDate: DateISO8601 | null;
};

export type FaqCreate = Pick<FaqInfo, "question" | "answer" | "groupId">;

export type FaqUpdate = Partial<
  Pick<FaqInfo, "question" | "answer" | "keywords">
>;

export type FaqQuery = {
  groupId: FaqGroupInfo["id"];
};

export type FaqQueryAnswer = {
  faqList: FaqInfo[];
};
