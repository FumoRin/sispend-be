import { authUser } from "@/middleware/verifyToken";

/**
 *
 * @swagger
 * /api/users/getMe:
 *   get:
 *     tags:
 *       - Users
 *     summary: Mengambil data user yang sedang login
 *     description: Mengambil data user yang sedang login
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data user terambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Dimas Faiz"
 *                     email:
 *                       type: string
 *                       example: "dimasfaiz@gmail.com"
 *                     role:
 *                       type: string
 *                       example: "user"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-13T15:32:41.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-08-13T15:32:41.000Z"
 *       401:
 *         description: Unauthorized - invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid token"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Internal Server Error"
 */

export async function GET(request) {
  try {
    const authCheck = await authUser(request);

    if (authCheck.status !== 200) {
      return new Response(JSON.stringify(authCheck.body), {
        status: authCheck.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: authCheck.user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
