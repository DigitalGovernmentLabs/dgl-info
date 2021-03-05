import { getManager, getRepository } from "typeorm";
import { defineController } from "./$relay";
import { Faq } from "$/entity/Faq";
import { toISO8601Nullable } from "$/utils/date";
import { FaqGroup } from "$/entity/FaqGroup";

export default defineController(() => ({
  get: async ({ params: { faqId } }) => {
    const faqRepository = getRepository(Faq);
    const faq = await faqRepository.findOne(faqId, { relations: ["group"] });
    if (!faq) return { status: 404 };
    return {
      status: 200,
      body: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        keywords: faq.keywords,
        groupId: faq.group.id,
        createDate: toISO8601Nullable(faq.createDate),
        updateDate: toISO8601Nullable(faq.updateDate),
      },
    };
  },
  patch: async ({
    params: { faqId },
    body: { question, answer, keywords },
  }) => {
    const faqRepository = getRepository(Faq);
    const faq = await faqRepository.findOneOrFail(faqId, {
      relations: ["group"],
    });
    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (keywords !== undefined) faq.keywords = keywords;
    await faqRepository.save(faq);
    return {
      status: 200,
      body: {
        id: faq.id,
        groupId: faq.group.id,
        answer: faq.answer,
        question: faq.question,
        keywords: faq.keywords,
        createDate: toISO8601Nullable(faq.createDate),
        updateDate: toISO8601Nullable(faq.updateDate),
      },
    };
  },
  delete: async ({ params: { faqId } }) => {
    await getManager().transaction(
      "READ UNCOMMITTED",
      async (entitiyManager) => {
        const faqRepository = entitiyManager.getRepository(Faq);
        const faqGroupRepository = entitiyManager.getRepository(FaqGroup);

        const faq = await faqRepository.findOneOrFail(faqId, {
          relations: ["group"],
        });
        await faqRepository.softDelete(faqId);
        faq.group.lastListUpdateDate = new Date();

        await faqGroupRepository.save(faq.group);
      },
    );
    return { status: 204 };
  },
}));
