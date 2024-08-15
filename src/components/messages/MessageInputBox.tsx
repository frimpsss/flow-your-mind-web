"use client";
import { _ } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const MessageInputBox = ({
  userId,
  questionId,
}: {
  userId: string;
  questionId?: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>();
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  async function sendMessage() {
    try {
      setLoading(true);
      const response = await _.post("/message", {
        username: userId,
        message,
        questionId: questionId?.id,
      });
      if (response?.data?.status) {
        setSubmitted(true);
        toast.success("message sent", { position: "bottom-center" });
      }
    } catch (error) {
      toast.error("error");
    } finally {
      setMessage("");
      setLoading(false);
    }
  }
  const nextSearchParams = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    if (!questionId) {
      nextSearchParams.delete("q");
      router.replace(`${pathname}?${nextSearchParams}`);
    }
  }, []);
  return (
    <div className="lg:max-w-[450px] mx-auto lg:pt-8">
      <div className="text-white px-3   py-4 rounded-t-lg bg-primary  ">
        <p className="font-light">
          {" "}
          {questionId ? questionId?.title : "flow your mind"}
        </p>
      </div>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.currentTarget.value);
        }}
        name=""
        id=""
        rows={1}
        placeholder="Enter text here"
        autoCorrect="false"
        className="w-full pt-4 min-h-[120px] px-3 rounded-b-lg shadow-sm focus:ring-0 outline-none focus:border-primary block  sm:text-sm border-gray-300"
      ></textarea>

      <button
        disabled={loading}
        onClick={sendMessage}
        className="hover:bg-primary/90 bg-primary text-white text-center w-full rounded-lg py-3 mt-5"
      >
        {loading ? "sending..." : "send message"}
      </button>

      {submitted && (
        <div className="mt-12 text-center">
          <p>Want to recieve anonymous messages?👀</p>
          <Link href={"/register"}>
            <p
              // onClick={() => {
              //   router.push("/register");
              // }}
              className="w-full  text-primary cursor-pointer underline text-center py-2 rounded-md"
            >
              Create an account
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MessageInputBox;
