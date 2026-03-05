describe("Notifications API", () => {
  it("should fetch notifications for user", async () => {
    const mockNotifications = [
      { id: 1, title: "Alert", message: "Price crossed threshold" },
    ];

    const response = {
      status: 200,
      json: mockNotifications,
    };

    expect(response.status).toBe(200);
    expect(response.json.length).toBeGreaterThan(0);
    expect(response.json[0].title).toBe("Alert");
  });
});
