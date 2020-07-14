import { getRepository } from 'typeorm'
import { LinkList } from '$/entity/LinkList'

const linkListRepository = () => getRepository(LinkList)

export const findAllLists = () => linkListRepository().find()
export const findOneList = (listId: LinkList['listId']) =>
  linkListRepository().findOneOrFail({ listId })
export const createLinkList = async (listTitle: LinkList['listTitle']) => {
  const linkLists = await findAllLists()
  const newId =
    linkLists.length > 0
      ? Math.max(...linkLists.map((linkList: LinkList) => linkList.listId)) + 1
      : 0
  const newOrder =
    linkLists.length > 0
      ? Math.max(...linkLists.map((linkList: LinkList) => linkList.listOrder)) +
        1
      : 0
  const newList = {
    listId: newId,
    listOrder: newOrder,
    listTitle,
    links: []
  }
  await linkListRepository().save(newList)
  return await findAllLists()
}
