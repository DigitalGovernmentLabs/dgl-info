import { getRepository } from "typeorm";
import { defineController } from "./$relay";
import { FaqGroup } from "$/entity/FaqGroup";

export default defineController(() => ({
  get: async ({ params: { faqGroupId } }) => {
    const faqGroupRepository = getRepository(FaqGroup);
    const faqGruop = await faqGroupRepository.findOne(faqGroupId);
    if (!faqGruop) return { status: 404 };
    return {
      status: 200,
      body: {
        id: faqGruop.id,
        name: faqGruop.name,
        description: faqGruop.description,
      },
    };
  },
  patch: async ({ params: { faqGroupId }, body: { name, description } }) => {
    const faqGroupRepository = getRepository(FaqGroup);
    await faqGroupRepository.update(faqGroupId, {
      name,
      description,
    });
    return { status: 204 };
  },
  delete: async ({ params: { faqGroupId } }) => {
    const faqGroupRepository = getRepository(FaqGroup);
    await faqGroupRepository.delete(faqGroupId);
    return { status: 204 };
  },
}));
