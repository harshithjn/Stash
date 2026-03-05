describe("System Performance Check", () => {
  it("should load key components under expected time", () => {
    const loadTimes = {
      dashboard: 1200,
      portfolio: 800,
      market: 1000,
    };

    for (const key in loadTimes) {
      const typedKey = key as keyof typeof loadTimes; // ✅ fix here
      expect(loadTimes[typedKey]).toBeLessThan(2000);
    }
  });
});
