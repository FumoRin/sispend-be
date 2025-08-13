import { authUser } from "@/middleware/verifyToken";

export async function GET(request) {
  try {
    const authCheck = await authUser(request);

    if (authCheck.status !== 200) {
      return new Response(
        JSON.stringify(authCheck.body),
        { status: authCheck.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user: authCheck.user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GetMe error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
