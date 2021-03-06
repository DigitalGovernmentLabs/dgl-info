import { sortKeywords, sortUniqueKeywords } from "../keyword";

describe("sortKeywords", () => {
  it("should sort", () => {
    expect(sortKeywords(["a", "#a"])).toEqual(["#a", "a"]);
    expect(sortKeywords(["b", "a"])).toEqual(["a", "b"]);
    expect(
      sortKeywords([
        "a",
        "b",
        "#a",
        "#b",
        "b",
        "##c",
        "c",
        "#b",
        "##a",
        "#d",
        "###a",
      ]),
    ).toEqual([
      "#a",
      "#b",
      "#b",
      "#d",
      "##a",
      "##c",
      "###a",
      "a",
      "b",
      "b",
      "c",
    ]);
  });
});

describe("sortUniqueKeywords", () => {
  it("should sort and unique", () => {
    expect(sortUniqueKeywords(["a", "#a", "a", "#a", "a"])).toEqual([
      "#a",
      "a",
    ]);
    expect(
      sortUniqueKeywords([
        "a",
        "b",
        "#a",
        "#b",
        "b",
        "##c",
        "c",
        "#b",
        "##a",
        "#d",
        "###a",
      ]),
    ).toEqual(["#a", "#b", "#d", "##a", "##c", "###a", "a", "b", "c"]);
  });
});
