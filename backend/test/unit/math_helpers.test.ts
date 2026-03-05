function calculateROI(invested: number, current: number): number {
  return ((current - invested) / invested) * 100;
}

describe("calculateROI utility", () => {
  it("returns positive ROI for profit", () => {
    expect(calculateROI(1000, 1500)).toBe(50);
  });

  it("returns negative ROI for loss", () => {
    expect(calculateROI(1000, 500)).toBe(-50);
  });

  it("handles no change", () => {
    expect(calculateROI(1000, 1000)).toBe(0);
  });
});
