import { getRepository } from 'typeorm'
import { LinkList } from '$/entity/LinkList'

const linkListRepository = () => getRepository(LinkList)

export const findAllLists = () =>
  linkListRepository()
    .createQueryBuilder('linklist')
    .leftJoinAndSelect('linklist.links', 'link')
    .getMany()

export const findOneList = (listId: LinkList['listId']) =>
  linkListRepository().findOneOrFail({ listId })

export const createLinkList = async (listTitle: LinkList['listTitle']) => {
  const linkLists = await findAllLists()

  const newOrder =
    linkLists.length > 0
      ? Math.max(...linkLists.map((linkList: LinkList) => linkList.listOrder)) +
        1
      : 0
  const newList: Pick<LinkList, 'listOrder' | 'listTitle'> = {
    listOrder: newOrder,
    listTitle
  }
  await linkListRepository().save(newList)
  return await findAllLists()
}
