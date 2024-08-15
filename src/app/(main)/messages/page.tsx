"use client";
import { AllMessages, ShareLink } from "@/components";
import Link from "next/link";

function Page() {
  return (
    <div className="p-4">
      <ShareLink />
      <Link href={"/messages/custom"}>
        <p className="text-primary/75 font-light mt-2 cursor-pointer">
          Wanna ask custom questions?
        </p>
      </Link>
      <div className="h-6"></div>
      <AllMessages />
    </div>
  );
}

export default Page;
