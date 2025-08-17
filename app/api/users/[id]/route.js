import prisma from "@/lib/prisma";
import { authUser, verifyOtpToken } from "@/middleware/verifyToken";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Mengambil data user berdasarkan ID
 *     description: Mengambil data user berdasarkan ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: integer
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
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Dimas Faiz"
 *                 email:
 *                   type: string
 *                   example: "dimasfaiz@gmail.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-06-01T10:00:00.000Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid user ID"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "User not found"
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
 *   put:
 *     tags:
 *       - Users
 *     summary: Mengubah data user berdasarkan ID
 *     description: Mengubah data user berdasarkan ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: integer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dimas Faiz"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "dimasfaiz@gmail.com"
 *               password:
 *                 type: string
 *                 example: "passwordrahasia"
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: "user"
 *             required: [name, email, password]
 *     responses:
 *       200:
 *         description: Data user berhasil diubah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid user ID"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Only admin can change user roles"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "User not found"
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
 *   delete:
 *     tags:
 *       - Users
 *     summary: Menghapus data user berdasarkan ID
 *     description: Menghapus data user berdasarkan ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: integer
 *       - name: otpVerifiedToken
 *         in: header
 *         required: false
 *         description: Token verifikasi OTP untuk user non-Admin
 *         schema:
 *           type: string
 *           default: "Bearer "
 *           example: "Bearer <otp-jwt-token>"
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid user ID"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Unauthorized"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "User not found"
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
 *
 */

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("GET User Error:", error);
    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const authCheck = await authUser(request);
    if (authCheck.status !== 200) {
      return Response.json(authCheck.body, { status: authCheck.status });
    }

    const currentUser = authCheck.user;
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { name, email, password, role } = await request.json();

    if (!name && !email && !password) {
      return Response.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    const isAdmin = currentUser.role === "ADMIN";

    if (role && !isAdmin) {
      return Response.json(
        { error: "Only admins can change user roles" },
        { status: 403 }
      );
    }

    if (!isAdmin) {
      const otpVerification = await verifyOtpToken(request);
      if (otpVerification.error) {
        return Response.json(
          { error: otpVerification.error },
          { status: otpVerification.status }
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (isAdmin && role) updateData.role = role;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return Response.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT User Error:", error);

    if (error.code === "P2002") {
      return Response.json({ error: "Email already exists" }, { status: 409 });
    }

    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const authCheck = await authUser(request);
    if (authCheck.status !== 200) {
      return Response.json(authCheck.body, { status: authCheck.status });
    }

    const currentUser = authCheck.user;
    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (currentUser.role !== "ADMIN") {
      const otpVerification = await verifyOtpToken(request);
      if (otpVerification.error) {
        return Response.json(
          { error: otpVerification.error },
          { status: otpVerification.status }
        );
      }
    }

    const userExists = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return Response.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE User Error:", error);

    if (error.code === "P2025") {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
