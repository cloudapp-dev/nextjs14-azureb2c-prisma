import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const apikey = process.env.API_KEY;

export async function POST(req: Request) {
  if (req.headers.get("x-api-key") !== apikey) {
    return new NextResponse(
      JSON.stringify({ status: "fail", message: "You are not authorized" }),
      { status: 401 }
    );
  }

  const {
    country,
    city,
    region,
    pathname,
    url,
    nexturl,
    ip,
    mobile,
    platform,
    useragent,
    referer,
  } = await req.json();

  let data = await prisma.tracking.create({
    data: {
      country: country,
      city: city,
      region: region,
      pathname: pathname,
      url: url,
      nexturl: nexturl,
      ip: ip,
      mobile: mobile,
      platform: platform,
      useragent: useragent,
      referer: referer,
    },
  });

  return NextResponse.json({
    data,
  });
}
