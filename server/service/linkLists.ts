import { getRepository } from 'typeorm'
import { LinkList } from '$/entity/LinkList'

const linkListRepository = () => getRepository(LinkList)

export const findAllLists = () =>
  linkListRepository()
    .createQueryBuilder('linklist')
    .leftJoinAndSelect('linklist.links', 'link')
    .orderBy('linklist.listOrder')
    .addOrderBy('link.linkOrder')
    .getMany()

export const createLinkList = async (listTitle: LinkList['listTitle']) => {
  type MaxObject = { maxOrder?: LinkList['listOrder'] }

  const maxObject: MaxObject = await linkListRepository()
    .createQueryBuilder('linklist')
    .select('MAX(linklist.listOrder)', 'maxOrder')
    .getRawOne()

  const newList: Pick<LinkList, 'listOrder' | 'listTitle'> = {
    listOrder: (maxObject.maxOrder ?? 0) + 1,
    listTitle
  }
  await linkListRepository().save(newList)
}
