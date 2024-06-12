"use client";

import { useEffect } from "react";
import { NextRequest, NextResponse } from "next/server";

interface ViewCountProps {
  slug: string;
}

export const ReportView = ({ slug }: ViewCountProps) => {
  useEffect(() => {
    fetch("/api/viewcount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return null;
};
