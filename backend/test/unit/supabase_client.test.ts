import { createClient } from "../../src/lib/supabase/supabaseClient";

describe("Supabase Client", () => {
  it("should create client successfully", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy-key";

    const client = createClient();
    expect(client).toBeDefined();
  });
});
