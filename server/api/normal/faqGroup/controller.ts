import assert from "assert";
import { getManager, getRepository, Repository } from "typeorm";
import { defineController } from "./$relay";
import { FaqGroup } from "$/entity/FaqGroup";
import { FaqGroupInfo } from "$/types/faq";
import { Faq } from "$/entity/Faq";

const getMaxOrder = async (repo: Repository<FaqGroup>): Promise<number> => {
  const max =
    (
      await repo
        .createQueryBuilder("faq_roup")
        .select("MAX(faq_roup.order)", "max")
        .printSql()
        .execute()
    ).max ?? 0;
  assert(typeof max === "number");
  return max;
};

export default defineController(() => ({
  get: async () => {
    const faqRepository = getRepository(Faq);
    const faqGroupRepository = getRepository(FaqGroup);
    const faqGroupList = await faqGroupRepository.find({
      order: {
        order: "ASC",
      },
    });
    const res: FaqGroupInfo[] = await Promise.all(
      faqGroupList.map(
        async (faqGroup): Promise<FaqGroupInfo> => ({
          id: faqGroup.id,
          name: faqGroup.name,
          description: faqGroup.description,
          faqNumber: await faqRepository.count({ where: { group: faqGroup } }),
        }),
      ),
    );
    return { status: 200, body: res };
  },
  post: async ({ body }) => {
    const { name, description } = body;
    await getManager().transaction("READ COMMITTED", async () => {
      const faqGroupRepository = getRepository(FaqGroup);
      const order = (await getMaxOrder(faqGroupRepository)) + 1;
      const faqGroup = faqGroupRepository.create({ name, description, order });
      await faqGroupRepository.save(faqGroup);
    });
    return { status: 201 };
  },
  patch: async ({ body: { newIdOrder } }) => {
    let error = null as null | string;
    await getManager().transaction("READ COMMITTED", async (entitiyManager) => {
      const faqGroupRepository = entitiyManager.getRepository(FaqGroup);
      const faqGroupList = await faqGroupRepository.find();
      if (faqGroupList.length !== newIdOrder.length) {
        error = "FAQ 一覧が更新されています。リロードして再度お試しください。";
        return;
      }
      const set = new Set([...faqGroupList.map((faqGruop) => faqGruop.id)]);
      newIdOrder.forEach((id) => set.delete(id));
      if (set.size) {
        error = "FAQ 一覧が更新されています。リロードして再度お試しください。";
        return;
      }
      const idToOrder: any = {};
      newIdOrder.forEach((id, i) => (idToOrder[id] = i));
      faqGroupList.forEach((faqGroup) => {
        faqGroup.order = idToOrder[faqGroup.id];
      });
      await faqGroupRepository.save(faqGroupList);
    });
    if (error) {
      return { status: 400, body: { errorMessage: error } };
    }
    return { status: 201 };
  },
}));
