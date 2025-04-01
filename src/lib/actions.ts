"use server";

import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";
import { format, parse } from "date-fns";
import { redirect } from "next/navigation";

export async function loginAction(values: { email: string; password: string }) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: values.email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "No user found with this email",
      };
    }

    const hashedPassword = crypto
      .createHmac("sha256", user.salt)
      .update(values.password)
      .digest("hex");

    if (hashedPassword === user.password) {
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "$UPERMAN",
        {
          expiresIn: "1h",
        }
      );

      // Set the token as an HTTP-only cookie
      (await cookies()).set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7200, // 1 hour
        path: "/",
      });

      return {
        success: true,
        message: "Login successful",
      };
    } else {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function register(values: {
  name: string;
  email: string;
  password: string;
}) {
  const user = await prisma.user.findFirst({
    where: {
      email: values.email,
    },
  });
  if (user) {
    return {
      message: "user already exsits",
    };
  } else {
    const salt = crypto.randomBytes(64).toString("hex");
    const hashPassword = crypto
      .createHmac("sha256", salt)
      .update(values.password)
      .digest("hex");
    try {
      const userInDb = await prisma.user.create({
        data: {
          ...values,
          password: hashPassword,
          salt,
        },
      });
      return { success: true, data: userInDb, error: {} };
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export async function logoutAction() {
  // Remove the token cookie
  (await cookies()).delete("token");
  redirect("/login");
}

export async function getAllBins(role: string, userId: string) {
  var bins;
  if (role == "ADMIN") {
    bins = await prisma.bin.findMany({
      orderBy: {
        fillLevel: "desc",
      },
      include: {
        binOwner: true,
      },
    });
  } else {
    bins = await prisma.bin.findMany({
      where: {
        binOwnerId: userId,
      },
      include: {
        binOwner: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        fillLevel: "desc",
      },
    });
  }
  return bins;
}

export async function addBinAction(values: {
  binOwner: string;
  reportDate: string;
  reportTime: string;
  fillLevel: number;
  category: string;
  site: string;
  sensorId: string;
}) {
  const res = await prisma.bin.create({
    data: {
      lastReported: formatDateTime(values.reportDate, values.reportTime),
      fillLevel: values.fillLevel,
      category: values.category,
      sensor: values.sensorId,
      site: values.site,
      binOwnerId: values.binOwner,
    },
  });
  if (res) {
    return {
      success: true,
      bin: res,
    };
  } else {
    return {
      success: false,
      bin: [],
    };
  }
}

export async function binUpdateAction(values: {
  binOwner: string;
  lastReported: String;
  fillLevel: number;
  category: string;
  site: string;
  sensorId: string;
  id: String;
}) {
  const bin = await prisma.bin.update({
    where: {
      id: String(values.id),
    },
    data: {
      binOwnerId: values.binOwner,
      category: values.category,
      fillLevel: values.fillLevel,
      site: values.site,
      lastReported: String(values.lastReported),
      sensor: values.sensorId,
    },
  });

  await prisma.activity.create({
    data: {
      binId: String(values.id),
      fillLevel: values.fillLevel,
    },
  });

  if (bin) {
    return {
      success: true,
      bin,
    };
  } else {
    return {
      success: false,
    };
  }
}

export async function deleteBinAction(id: String) {
  await prisma.activity.deleteMany({
    where: {
      binId: String(id),
    },
  });
  const bin = await prisma.bin.delete({
    where: {
      id: String(id),
    },
  });
  if (bin) {
    return {
      success: true,
    };
  } else {
    return {
      success: false,
    };
  }
}

export async function getAllBinOwners() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    console.log(users, "users");

    return {
      success: true,
      binOwners: users,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      binOwners: null,
    };
  }
}

function formatDateTime(date: string, time: string) {
  const [hours, minutes] = time.split(":");
  const dateObj = new Date(date);
  dateObj.setHours(Number.parseInt(hours, 10));
  dateObj.setMinutes(Number.parseInt(minutes, 10));

  return format(dateObj, "EEE dd/MM/yyyy HH:mm:ss");
}