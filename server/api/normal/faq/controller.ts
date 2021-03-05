import assert from "assert";
import { getManager, getRepository } from "typeorm";
import { defineController } from "./$relay";
import { Faq } from "$/entity/Faq";
import { FaqInfo, FaqQueryAnswer } from "$/types/faq";
import { toISO8601Nullable } from "$/utils/date";
import { FaqGroup } from "$/entity/FaqGroup";

// NOTE: ページネーション最初は使わず様子見
const PAGENATE_NUM = 100000;

export default defineController(() => ({
  get: async ({ query }) => {
    const { groupId } = query;
    const faqRepository = getRepository(Faq);
    const order = {
      id: "DESC",
    } as const;

    const found = await faqRepository.find({
      order,
      where: {
        group: groupId,
      },
      relations: ["group"],
      take: PAGENATE_NUM,
    });

    const ans: FaqQueryAnswer = {
      faqList: found.map((faq) => {
        const faqInfo: FaqInfo = {
          id: faq.id,
          groupId: faq.group.id,
          question: faq.question,
          answer: faq.answer,
          keywords: faq.keywords,
          createDate: toISO8601Nullable(faq.createDate),
          updateDate: toISO8601Nullable(faq.updateDate),
        };
        return faqInfo;
      }),
    };

    return {
      status: 200,
      body: ans,
    };
  },
  post: async ({ body }) => {
    const { answer, question, groupId } = body;
    let faqGroup = null as FaqGroup | null;
    let faq = null as Faq | null;
    await getManager().transaction("READ COMMITTED", async (entitiyManager) => {
      const faqRepository = entitiyManager.getRepository(Faq);
      const faqGroupRepository = entitiyManager.getRepository(FaqGroup);

      faqGroup = await faqGroupRepository.findOneOrFail(groupId);
      faqGroup.lastListUpdateDate = new Date();
      faq = faqRepository.create({
        group: faqGroup,
        answer,
        question,
        keywords: [],
      });

      await faqRepository.save(faq);
      await faqGroupRepository.save(faqGroup);
    });
    assert(faqGroup, "faqGroup");
    assert(faq, "faq");
    return {
      status: 200,
      body: {
        groupId: faqGroup.id,
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        keywords: faq.keywords,
        updateDate: toISO8601Nullable(faq.updateDate),
        createDate: toISO8601Nullable(faq.createDate),
      },
    };
  },
}));
