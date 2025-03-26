"use server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { cookies } from "next/headers";
import { format, parse } from "date-fns";
import { Sen } from "next/font/google";
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
        maxAge: 3600, // 1 hour
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
export async function getAllBins() {
  const bins = await prisma.bin.findMany();
  console.log(bins);

  return bins;
}

function formatDateTime(date: string, time: string) {
  const [hours, minutes] = time.split(":");
  const dateObj = new Date(date);
  dateObj.setHours(Number.parseInt(hours, 10));
  dateObj.setMinutes(Number.parseInt(minutes, 10));

  return format(dateObj, "EEE dd/MM/yyyy HH:mm:ss");
}

export async function addBinAction(values: {
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
      category: values.category,
      fillLevel: values.fillLevel,
      site: values.site,
      lastReported: String(values.lastReported),
      sensor: values.sensorId,
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
