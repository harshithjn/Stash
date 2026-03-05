describe("Database Operations (Mocked)", () => {
  const db = [{ id: 1, name: "BTC" }];

  it("should insert new record", () => {
    db.push({ id: 2, name: "ETH" });
    expect(db.length).toBe(2);
  });

  it("should fetch existing record", () => {
    const record = db.find((r) => r.id === 1);
    expect(record?.name).toBe("BTC");
  });
});
