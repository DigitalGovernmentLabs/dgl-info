import { sortKeywords } from "../keyword";

describe("sortKeywords", () => {
  it("should sort", () => {
    expect(
      sortKeywords(["a", "b", "#a", "#b", "##c", "##a", "#d", "###a"]),
    ).toEqual(["#a", "#b", "#d", "##a", "##c", "###a", "a", "b"]);
  });
});
