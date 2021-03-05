import { getRepository } from "typeorm";
import { defineController } from "./$relay";
import { Faq } from "$/entity/Faq";
import { sortKeywords } from "$/utils/keyword";

export default defineController(() => ({
  post: async ({ params: { faqId }, body: { keyword } }) => {
    const faqRepository = getRepository(Faq);
    const faq = await faqRepository.findOneOrFail(faqId, {
      relations: ["group"],
    });
    const keywordSet = new Set(faq.keywords);
    keywordSet.add(keyword);
    faq.keywords = sortKeywords([...keywordSet]);
    await faqRepository.save(faq);
    return {
      status: 200,
      body: {
        keywords: faq.keywords,
      },
    };
  },
  delete: async ({ params: { faqId }, body: { keyword } }) => {
    const faqRepository = getRepository(Faq);
    const faq = await faqRepository.findOneOrFail(faqId, {
      relations: ["group"],
    });
    const keywordSet = new Set(faq.keywords);
    keywordSet.delete(keyword);
    faq.keywords = sortKeywords([...keywordSet]);
    await faqRepository.save(faq);
    return {
      status: 200,
      body: {
        keywords: faq.keywords,
      },
    };
  },
}));
