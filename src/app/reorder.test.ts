import { reorder } from "./reorder";

describe("reorder", () => {
  it("moves item from start to end", () => {
    expect(reorder(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });
  it("moves item from end to start", () => {
    expect(reorder(["a", "b", "c"], 2, 0)).toEqual(["c", "a", "b"]);
  });
  it("no-op if startIndex equals endIndex", () => {
    expect(reorder(["a", "b", "c"], 1, 1)).toEqual(["a", "b", "c"]);
  });
  it("works with empty array", () => {
    expect(reorder([], 0, 0)).toEqual([]);
  });
  it("throws if startIndex out of bounds", () => {
    expect(() => reorder(["a", "b"], -1, 1)).toThrow();
    expect(() => reorder(["a", "b"], 2, 1)).toThrow();
  });
  it("throws if endIndex out of bounds", () => {
    expect(() => reorder(["a", "b"], 0, -1)).toThrow();
    expect(() => reorder(["a", "b"], 0, 2)).toThrow();
  });
  it("works with objects", () => {
    expect(reorder([{ x: 1 }, { x: 2 }], 1, 0)).toEqual([{ x: 2 }, { x: 1 }]);
  });
});
