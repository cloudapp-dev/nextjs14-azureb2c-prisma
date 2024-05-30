import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "45 s"),
});

export async function POST(req: NextRequest) {
  const authtoken = await getToken({ req });
  const isAdmin = authtoken?.role === "Admin";

  if (!authtoken || !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use a constant string to limit all requests with a single ratelimit
  // Or use a userID, apiKey or ip address for individual limits.
  const identifier = authtoken?.sub || "all";
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    console.log("Unable to process at this time");
    return NextResponse.json({ error: "Quota exceeded" }, { status: 429 });
  }

  // Extract the `messages` from the body of the request
  const { name } = await req.json();

  let data: any = await prisma.roles.findFirst({
    where: { name: name },
  });

  if (data) {
    data["status"] = "present";
  }

  if (!data) {
    data = await prisma.roles.create({
      data: {
        name: name,
      },
    });
    data["status"] = "new";
  }

  return NextResponse.json({
    data,
  });
}
