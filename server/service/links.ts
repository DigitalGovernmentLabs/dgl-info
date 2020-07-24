import { getRepository } from 'typeorm'
import { findOneList } from './linkLists'
import { Link } from '$/entity/Link'
import { LinkList } from '$/entity/LinkList'
import { PartialLink } from '$/types'

const linkRepository = () => getRepository(Link)

export const createLink = async (
  link: Pick<Link, 'url' | 'name' | 'description'>,
  listId: LinkList['listId']
) => {
  const linkList = await findOneList(listId)
  const links = await linkRepository().find({
    where: { linkList: { listId } }
  })

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

export const removeLink = async (linkId: Link['linkId']) => {
  const link = await linkRepository().findOne({ linkId })
  if (link) await linkRepository().remove(link)
}

// eslint-disable-next-line complexity
export const updateLink = async (
  linkId: Link['linkId'],
  partialLink: PartialLink
) => {
  const link = await linkRepository().findOne({ linkId })
  if (!link) return

  link.name = partialLink.name ?? link.name
  link.url = partialLink.url ?? link.url
  link.description = partialLink.description ?? link.description

  await linkRepository().save(link)
}
