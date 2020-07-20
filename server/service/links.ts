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
  const links = await linkRepository().find({
    where: { linkList: { listId } }
  })
  console.log(links)

  const newOrder =
    links.length > 0
      ? Math.max(...links.map((link: Link) => link.linkOrder)) + 1
      : 0
  const newLink = {
    linkOrder: newOrder,
    url: link.url,
    name: link.name,
    description: link.description,
    linkList
  } as Link

  await linkRepository().save(newLink)
}
