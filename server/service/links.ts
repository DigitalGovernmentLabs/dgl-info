import { getRepository } from "typeorm";
import { Link } from "$/entity/Link";
import { LinkList } from "$/entity/LinkList";
import { PickLink, Link as TypeLink } from "$/types";

const linkRepository = () => getRepository(Link);

export const createLink = async (
  listId: LinkList["listId"],
  link: PickLink,
) => {
  const maxLinkOrder = await linkRepository()
    .createQueryBuilder("link")
    .select("MAX(link.linkOrder)", "max")
    .where("link.listId = :listId", { listId })
    .getRawOne();

  const newLink: Omit<Link, "linkId"> = {
    linkOrder: typeof maxLinkOrder.max === "number" ? maxLinkOrder.max + 1 : 1,
    url: link.url,
    name: link.name,
    description: link.description,
    listId,
  };

  await linkRepository().save(newLink);
};

export const deleteLink = async (linkId: TypeLink["linkId"]) => {
  await linkRepository().delete({ linkId });
};

export const updateLink = async (
  linkId: TypeLink["linkId"],
  link: TypeLink,
) => {
  const updatedLink = await linkRepository().findOne({ linkId });
  if (!updatedLink) return;

  const { name, url, description } = {
    ...updateLink,
    ...link,
  };

  await linkRepository().save({
    linkId: updatedLink.linkId,
    linkOrder: updatedLink.linkOrder,
    name,
    url,
    description,
  });
};
