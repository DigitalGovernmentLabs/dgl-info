import { getRepository } from 'typeorm'
import { findOneList } from './linkLists'
import { Link } from '$/entity/Link'
import { LinkList } from '$/entity/LinkList'

const linkRepository = () => getRepository(Link)

export const createLink = async (
  link: Pick<Link, 'url' | 'name' | 'description'>,
  listId: LinkList['listId']
) => {
  const linkList = await findOneList(listId)
  const links = linkList.links
  const newId =
    links.length > 0
      ? Math.max(...links.map((link: Link) => link.linkId)) + 1
      : 0
  const newOrder =
    links.length > 0
      ? Math.max(...links.map((link: Link) => link.linkOrder)) + 1
      : 0

  const newLink = new Link()

  newLink.linkId = newId
  newLink.linkOrder = newOrder
  newLink.url = link.url
  newLink.name = link.name
  newLink.description = link.description
  newLink.linkList = linkList

  await linkRepository().save(newLink)
  return await findOneList(listId)
}
