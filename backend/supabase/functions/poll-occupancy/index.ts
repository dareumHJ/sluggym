import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OCCUPANCY_URL = "https://sluggym-backend.onrender.com/occupancy";
const GYM_ID = "cd748d81-b9b3-4c0e-82ae-664265448ea7";

Deno.serve(async (req) => {
  // AUTHENTICATION
  const authHeader = req.headers.get("x-cron-secret");
  if (authHeader !== Deno.env.get("CRON_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 1. FETCH occupancy from backend API
    const response = await fetch(OCCUPANCY_URL, {
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ status: "skipped", reason: `backend_${response.status}` }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    if (data.source !== "api") {
      return new Response(
        JSON.stringify({ status: "skipped", reason: "fallback_response" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const count = data.count;
    if (count === null || count === undefined) {
      return new Response(
        JSON.stringify({ status: "skipped", reason: "no_count" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. INSERT to SUPABASE
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const sampledAt = data.timestamp || new Date().toISOString();

    const { error } = await supabase.from("gym_headcount_history").insert({
      gym_id: GYM_ID,
      count: count,
      source: "sluggym_backend",
      sampled_at: sampledAt,
    });

    if (error) {
      console.error("Supabase insert failed:", error);
      return new Response(
        JSON.stringify({ status: "error", error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ status: "ok", count, sampled_at: sampledAt }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Function error:", e);
    return new Response(
      JSON.stringify({ status: "error", error: String(e) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});