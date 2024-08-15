"use client";
import Message from "@/components/messages/Message";
import { _ } from "@/utils";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = ({ params }: { params: { id: string } }) => {
  const [message, setMessage] = useState<any>();
  const loading = useState<boolean>();
  async function getMessage() {
    try {
      loading[1](true);
      const res = await _.get(`/message/${params.id}`);
      if (res?.data?.status) {
        setMessage(res?.data?.data);
      }
    } catch (error: any) {
      toast.error(error?.message);
    } finally {
      loading[1](false);
    }
  }

  useEffect(() => {
    getMessage();
  }, []);
  return loading[0] ? (
    <div className="h-[130px] bg-slate-100 rounded-md animate-pulse "></div>
  ) : (
    <Message
      message={message?.message}
      time={message?.timeStamp}
      question={message?.question}
    />
  );
};

export default Page;
