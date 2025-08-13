import prisma from "@/lib/prisma";
import { authUser, verifyOtpToken } from "@/middleware/verifyToken";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  try {
    const { id } =await params;
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
        createdAt: true
      }
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
    const { id } =await params;
    const userId = parseInt(id);
    
    if (isNaN(userId)) {
      return Response.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const { name, email, password, role } = await request.json();

    if (!name && !email && !password && !role) {
      return Response.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    const isAdmin = currentUser.role === "ADMIN";

    if (!isAdmin) {
      return Response.json(
        { error: "Forbidden - You don't have permission" },
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
      return Response.json(
        { error: "Email already exists" },
        { status: 409 }
      );
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
    const { id } = params;
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
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}