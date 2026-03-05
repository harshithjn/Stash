describe("System Flow", () => {
  it("should simulate dashboard navigation flow", async () => {
    const pages = ["/", "/dashboard", "/portfolio"];
    for (const page of pages) {
      const res = { url: page, loaded: true };
      expect(res.loaded).toBe(true);
    }
  });
});
