import fs from 'fs'
import { LinkList } from '$/types'

const filename = 'linkLists.json'

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, '[]', 'utf-8')
}

const readFile = async (): Promise<LinkList[]> =>
  JSON.parse(await fs.promises.readFile(filename, 'utf-8'))
const writeFile = async (newList: LinkList[]) =>
  await fs.promises.writeFile(filename, JSON.stringify(newList), 'utf-8')

export const linkListRepository = {
  getLinkLists: () => readFile(),
  createLinkLists: async (listTitle: string) => {
    const linkLists = await readFile()
    const newId =
      linkLists.length > 0
        ? Math.max(...linkLists.map((linkList: LinkList) => linkList.listId)) +
          1
        : 0
    const newOrder =
      linkLists.length > 0
        ? Math.max(
            ...linkLists.map((linkList: LinkList) => linkList.listOrder)
          ) + 1
        : 0
    const newList = {
      listId: newId,
      listOrder: newOrder,
      listTitle,
      links: []
    }
    linkLists.push(newList)
    writeFile(linkLists)
    return linkLists
  }
}
