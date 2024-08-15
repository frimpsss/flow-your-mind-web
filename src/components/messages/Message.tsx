"use client";

import { formatDate } from "@/utils";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
const Message = ({
  message,
  time,
  question,
}: {
  message: string;
  time: string;
  question: string | undefined;
}) => {
  return (
    <div className="p-4 ">
      <Link href={"/messages"}>
        <div className="flex items-center gap-1  w-fit hover:bg-primary/5 p-1 rounded duration-500">
          <ArrowLeftIcon className="h-[1rem] text-primary" />
          <p className="text-primary">Back</p>
        </div>
      </Link>

      <div className="p-2 mt-6 rounded-md bg-primary/5">
        <p className="text-slate-500 text-[0.8rem]">{formatDate(time)}</p>
        {question && <p className="pt-2 text-[1.1rem] text-slate-400">Q: {question}</p>}
        {/* <p className="text-slate-500 text-[0.8rem]">Message:</p> */}
        <p className="text-primary text-[1.2rem] mt-2 px-6">{message}</p>
      </div>
    </div>
  );
};

export default Message;
