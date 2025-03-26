import DashboardPage from "@/components/dashboard";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
interface JWTPayload {
  id: string;
}

const page = async () => {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    const decoded = jwt.verify(token, "$UPERMAN") as JWTPayload;
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
      },
    });
    if (user) {
      return <DashboardPage role={user?.role} />;
    }
  } else {
    redirect("/login");
  }
};

export default page;
