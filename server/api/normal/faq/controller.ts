import { getRepository, LessThanOrEqual } from "typeorm";
import { defineController } from "./$relay";
import type { FaqQueryAnswer } from ".";
import { Faq } from "$/entity/Faq";
import { FaqInfo } from "$/types/faq";
import { toISO8601 } from "$/utils/date";

const PAGENATE_NUM = 100;

export default defineController(() => ({
  get: async ({ body }) => {
    const { from, startedFrom, groupId } = body;
    const faqRepository = getRepository(Faq);
    const order = {
      id: "DESC",
    } as const;

    const latest = await faqRepository.find({
      order,
      take: 1,
    });
    const latestId = latest[0]?.id;

    const updated = startedFrom !== latestId;

    const found = await faqRepository.find({
      order,
      where: {
        id: LessThanOrEqual(from),
        group: groupId,
      },
      take: PAGENATE_NUM + 1,
    });

    const last = found.pop();
    if (!last) {
      const ans: FaqQueryAnswer = {
        faqList: [],
        updated,
      };
      return {
        status: 200,
        body: ans,
      };
    }

    const ans: FaqQueryAnswer = {
      next: last.id,
      from: latestId,
      updated,
      faqList: found.map((faq) => {
        const faqInfo: FaqInfo = {
          id: faq.id,
          groupId: faq.group.id,
          question: faq.question,
          answer: faq.answer,
          keywords: faq.keywords,
          createDate: faq.createDate && toISO8601(faq.createDate),
          updateDate: faq.updateDate && toISO8601(faq.updateDate),
        };
        return faqInfo;
      }),
    };

    return {
      status: 200,
      body: ans,
    };
  },
}));
