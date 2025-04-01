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
    var decoded;
    try {
      decoded = jwt.verify(token, "$UPERMAN") as JWTPayload;
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
        },
        select: {
          id: true,
          name: true,
          role: true,
        },
      });
      if (user) {
        return (
          <DashboardPage
            role={user?.role}
            userId={user.id}
            accountName={user.name}
          />
        );
      }
    } catch (error) {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }
};

export default page;
