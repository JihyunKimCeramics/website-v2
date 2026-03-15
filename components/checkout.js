import posthog from "posthog-js";

export default async function checkout(cart) {
  try {
    const distinctId = posthog.get_distinct_id() || "anonymous";
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-posthog-distinct-id": distinctId,
      },
      body: JSON.stringify({ cart }),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      console.error("Checkout API error:", payload);
      alert(
        payload?.error?.message ||
          `Failed to create checkout session (${res.status})`
      );
      return;
    }

    const data = await res.json();
    if (!data?.url) {
      console.error("No checkout URL returned:", data);
      alert("No checkout URL returned from server.");
      return;
    }

    window.location.href = data.url;
  } catch (e) {
    console.error("Checkout exception:", e);
    alert(`Sorry, something went wrong starting checkout: ${e.message}`);
  }
}
