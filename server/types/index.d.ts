export type Task = {
  id: number;
  label: string;
  done: boolean;
};

export type UserInfo = {
  id: string;
  name: string;
  icon: string;
};

export type LinkList = {
  listId: number;
  listOrder: number;
  listTitle: string;
  links?: Link[];
};

export type Link = {
  linkId: number;
  linkOrder: number;
  url: string;
  name: string;
  description?: string;
};

export type PickLink = Pick<Link, "name" | "url" | "description">;
