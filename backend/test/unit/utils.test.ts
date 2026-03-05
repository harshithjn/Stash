import { createClient } from "../../src/lib/supabase/supabaseClient";

describe("Supabase Client", () => {
  test("should create client successfully", () => {
    const client = createClient();
    expect(client).toBeDefined();
  });
});
