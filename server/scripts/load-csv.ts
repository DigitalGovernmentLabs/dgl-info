#!/usr/bin/env -S ../node_modules/.bin/ts-node -T -r ../node_modules/tsconfig-paths/register.js

/* eslint-disable max-nested-callbacks,complexity */
import "reflect-metadata";

import fs from "fs";
import path from "path";
import parse from "csv-parse";
import { createConnection, getRepository } from "typeorm";
import { FaqGroup } from "$/entity/FaqGroup";
import { Faq } from "$/entity/Faq";
import { sortUniqueKeywords } from "$/utils/keyword";

const getTblFaq = (): Promise<
  Record<
    | "id"
    | "num"
    | "dai"
    | "syou"
    | "key1"
    | "key2"
    | "key3"
    | "key4"
    | "key5"
    | "qtxt"
    | "atxt"
    | "kasyo"
    | "faqnum"
    | "day"
    | "fileday",
    string
  >[]
> => {
  return new Promise(
    (resolve) =>
      // eslint-disable-next-line no-void
      void parse(
        fs.readFileSync(path.resolve(__dirname, "csv/tblfaq.csv")),
        {
          columns: true,
        },
        (_err: any, output: any) => resolve(output),
      ),
  );
};

const getTblFaqTitle = (): Promise<
  Record<"id" | "zyun" | "faqid" | "title" | "faqurl" | "new", string>[]
> => {
  return new Promise(
    (resolve) =>
      // eslint-disable-next-line no-void
      void parse(
        fs.readFileSync(path.resolve(__dirname, "csv/tblfaqtitle.csv")),
        {
          columns: true,
        },
        (_err: any, output: any) => resolve(output),
      ),
  );
};

const normalizeText = (old: string) => {
  return old.replace(/[\n\r]/g, "").replace(/<br>/g, "\n");
};

const isNull = (field: string | null | undefined) =>
  field === null || field === undefined || field === "" || field === "NULL";

// eslint-disable-next-line
const parseDay = (day: string): Date | null => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  if (day.startsWith("平成")) {
    const m = day.match(/.*?(\d+)年.*?(\d+)月.*?(?:(\d+)日.*)?/);
    if (!m) return null;
    d.setUTCFullYear(+m[1]! + 1988);
    d.setUTCMonth(+m[2]! - 1, 1);
    if (m[3]) d.setUTCDate(+m[3]);
    return d;
  }
  if (day.startsWith("令和")) {
    const m = day.match(/.*?(\d*)年.*?(\d+)月.*?(?:(\d+)日.*)?/);
    if (!m) return null;
    d.setUTCFullYear(+(m[1] || "1") + 2018);
    d.setUTCMonth(+m[2]! - 1, 1);
    if (m[3]) d.setUTCDate(+m[3]);
    return d;
  }
  if (day.startsWith("H")) {
    const m = day.match(/.*?(\d+)\..*?(\d+).*/);
    if (!m) return null;
    d.setUTCFullYear(+m[1]! + 1988);
    d.setUTCMonth(+m[2]! - 1, 1);
    if (m[3]) d.setUTCDate(+m[3]);
    return d;
  }
  const pat = /(\d\d\d\d).(\d\d?)(?:.(\d\d?))?/;
  if (day.match(pat)) {
    const m = day.match(pat);
    if (!m) return null;
    d.setUTCFullYear(+m[1]!);
    d.setUTCMonth(+m[2]! - 1, 1);
    if (m[3]) d.setUTCDate(+m[3]);
    return d;
  }
  return null;
};

void (async () => {
  await createConnection();

  const csvFaqGroup = await getTblFaqTitle();
  const csvFaq = await getTblFaq();

  const faqRepository = getRepository(Faq);
  const faqGroupRepository = getRepository(FaqGroup);

  await faqRepository.delete({});
  await faqGroupRepository.delete({});

  const groups: { [oldFaqid: string]: FaqGroup } = {};

  await Promise.all(
    csvFaqGroup.map(async (faqGroupRow) => {
      const faqGroup = faqGroupRepository.create({
        name: faqGroupRow.title,
        description: faqGroupRow.faqurl,
        lastListUpdateDate: new Date(),
        order: +faqGroupRow.zyun + 100,
      });
      await faqGroupRepository.save(faqGroup);
      groups[faqGroupRow.faqid] = faqGroup;
    }),
  );

  await Promise.all(
    csvFaq.map(async (faqRow) => {
      const keywords = [
        faqRow.key1,
        faqRow.key2,
        faqRow.key3,
        faqRow.key4,
        faqRow.key5,
      ].filter((e) => !isNull(e));
      if (!isNull(faqRow.dai)) keywords.push(`#${faqRow.dai}`);
      if (!isNull(faqRow.syou)) keywords.push(`##${faqRow.syou}`);

      const createDate = parseDay(faqRow.day) || new Date();

      const faq = faqRepository.create({
        answer: normalizeText(faqRow.atxt),
        question: normalizeText(faqRow.qtxt),
        group: groups[faqRow.kasyo],
        keywords: sortUniqueKeywords(keywords),
        createDate,
        updateDate: createDate,
      });
      await faqRepository.save(faq);
    }),
  );
})();
/* eslint-enable max-nested-callbacks,complexity */
