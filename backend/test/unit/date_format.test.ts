function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

describe("formatDate utility", () => {
  it("formats date as YYYY-MM-DD", () => {
    const d = new Date("2025-11-09T12:00:00Z");
    expect(formatDate(d)).toBe("2025-11-09");
  });
});
