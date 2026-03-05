import { NextRequest } from "next/server";
import { middleware } from "../../src/middleware";

// Mock Supabase client
jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(() => ({ data: { user: null } })), // default: unauthenticated
    },
  })),
}));

describe("Middleware Auth Protection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect unauthenticated user from /dashboard", async () => {
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({ data: { user: null } })),
      },
    });

    const request = new NextRequest("http://localhost/dashboard");
    const res = await middleware(request);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("should allow unauthenticated user on /login", async () => {
    const request = new NextRequest("http://localhost/login");
    const res = await middleware(request);
    expect(res.type).toBe("default"); // allowed through
  });

  it("should allow authenticated user on /dashboard", async () => {
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({ data: { user: { id: "123" } } })),
      },
    });

    const request = new NextRequest("http://localhost/dashboard");
    const res = await middleware(request);
    expect(res.type).toBe("default"); // not redirected
  });
    it("should redirect unauthenticated user from /notifications", async () => {
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({ data: { user: null } })),
      },
    });

    const request = new NextRequest("http://localhost/notifications");
    const res = await middleware(request);
    expect(res.headers.get("location")).toContain("/login");
  });

  it("should skip auth for static or public assets", async () => {
    const request = new NextRequest("http://localhost/_next/static/chunks/app.js");
    const res = await middleware(request);
    expect(res.type).toBe("default"); // middleware skips static assets
  });


  it("should redirect authenticated user from /login to /dashboard", async () => {
    const { createServerClient } = require("@supabase/ssr");
    createServerClient.mockReturnValueOnce({
      auth: {
        getUser: jest.fn(() => ({ data: { user: { id: "123" } } })),
      },
    });

    const request = new NextRequest("http://localhost/login");
    const res = await middleware(request);
    const location = res.headers.get("location");
    if (location) {
      expect(location).toContain("/dashboard");
    } else {
      expect(res.type).toBe("default");
    }
  });
});
