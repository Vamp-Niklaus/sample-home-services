import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ContactPayload {
  request_id?: string;
  name?: string;
  email?: string;
  message?: string;
  website?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const payload: ContactPayload = await req.json();

    // Honeypot check
    if (payload.website && payload.website.trim() !== "") {
      return new Response(
        JSON.stringify({ error: "Invalid submission detected." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate request_id (UUID)
    if (!payload.request_id || !UUID_REGEX.test(payload.request_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing request_id (UUID required)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate name: 2–80 chars
    const name = payload.name?.trim() || "";
    if (name.length < 2 || name.length > 80) {
      return new Response(
        JSON.stringify({ error: "Name must be between 2 and 80 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email: <= 254 chars
    const email = payload.email?.trim() || "";
    if (!EMAIL_REGEX.test(email) || email.length > 254) {
      return new Response(
        JSON.stringify({ error: "A valid email address is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message: 10–1000 chars
    const message = payload.message?.trim() || "";
    if (message.length < 10 || message.length > 1000) {
      return new Response(
        JSON.stringify({ error: "Message must be between 10 and 1000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const windmillUrl = Deno.env.get("WINDMILL_URL");
    const windmillToken = Deno.env.get("WINDMILL_TOKEN");

    if (!windmillUrl || !windmillToken) {
      return new Response(
        JSON.stringify({ error: "Server configuration error: missing Windmill credentials." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Forward to Windmill Flow
    const wmResponse = await fetch(windmillUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${windmillToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_id: payload.request_id,
        name,
        email,
        message,
      }),
    });

    if (!wmResponse.ok) {
      const errText = await wmResponse.text();
      return new Response(
        JSON.stringify({ error: "Upstream processing failure", details: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const wmResult = await wmResponse.json();

    if (wmResult.stored === true) {
      return new Response(
        JSON.stringify({ request_id: payload.request_id, status: "received" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Storage verification failed." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (_err) {
    return new Response(
      JSON.stringify({ error: "Malformed request payload" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
