import type { FaqGroup } from "$/entity/FaqGroup";
import { FaqInfo } from "$/types/faq";

export type FaqQuery = {
  startedFrom: number;
  // pagination
  from?: number;
  // group info
  groupId: FaqGroup["id"];
};

export type FaqQueryAnswer = {
  // pagination
  next?: number;
  // 問い合わせのあったもののうち最新
  from?: number;
  // FAQ リスト
  faqList: FaqInfo[];
  /**
   * 最初に問い合わせをした瞬間から更新があったか。
   */
  updated: boolean;
};

export type Methods = {
  get: {
    reqBody: FaqQuery;
    resBody: FaqQueryAnswer;
  };
};
