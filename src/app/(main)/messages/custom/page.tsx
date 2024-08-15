"use client";
import { ShareLink } from "@/components";
import { _ } from "@/utils";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [custs, setCusts] = useState([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  async function getAllCustoms() {
    try {
      setIsFetching(true);
      const res = await _.get("/messages/custom-questions");

      if (res?.data?.status) {
        setCusts(res?.data?.data);
        // console.log();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  }

  async function createMessage() {
    try {
      const resp = await _.post("/message/custom-question", {
        title: message,
      });
      if (resp?.data?.status) {
        toast.success("Question created", { position: "bottom-center" });
      }
      getAllCustoms();
    } catch (error) {
      toast.error("error");
    } finally {
      setMessage("");
      setLoading(false);
    }
  }
  useEffect(() => {
    getAllCustoms();
  }, []);
  return (
    <div className="p-4">
      <Link href={"/messages"}>
        <div className="flex items-center gap-1  w-fit hover:bg-primary/5 p-1 rounded duration-500 mb-4">
          <ArrowLeftIcon className="h-[1rem] text-primary" />
          <p className="text-primary">Back</p>
        </div>
      </Link>
      <h4 className="text-primary font-semibold text-[1.5rem]">
        Custom questions
      </h4>

      <div>
        <div className="text-white px-3 mt-4   py-4 rounded-t-lg bg-primary  ">
          <p className="font-light">Enter your question</p>
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
          className="w-full pt-4 min-h-[70px] px-3 rounded-b-lg shadow-sm focus:ring-0 outline-none focus:border-primary block  sm:text-sm border-gray-300"
        ></textarea>

        <button
          disabled={loading}
          onClick={createMessage}
          className="hover:bg-primary/90 bg-primary text-white text-center w-full rounded-lg py-3 mt-5"
        >
          {loading ? "sending..." : "Create question"}
        </button>
      </div>

      <div className="mt-6">
        <h6 className="mb-4 text-primary">Your questions</h6>
        <div className="col-span-1 grid gap-6">
          {isFetching ? (
            <div className="animate-pulse grid grid-cols-1 gap-4">
              {[1, 2, 3, 4].map((e, i) => {
                return (
                  <div
                    key={i}
                    className="h-[140px] bg-slate-100 rounded-md"
                  ></div>
                );
              })}
            </div>
          ) : (
            custs?.map((item: any, key) => (
              <div>
                <h4 className="text-slate-400 text-[1.1rem] font-normal mb-2">
                  Q- {item?.title}
                </h4>
                <ShareLink key={key} qid={item?.id} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
