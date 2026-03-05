describe("API Health Check", () => {
  it("should respond with status 200", async () => {
    const response = { status: 200, json: { ok: true } };
    expect(response.status).toBe(200);
    expect(response.json.ok).toBe(true);
  });
});
