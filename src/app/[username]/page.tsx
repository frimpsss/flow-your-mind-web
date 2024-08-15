import Footer from "@/components/core/Footer";
import Header from "@/components/app/Header";
import MessageInputBox from "@/components/messages/MessageInputBox";
import { _, baseURL } from "@/utils";
import React from "react";
import { redirect } from "next/navigation";
async function getUserId(username: string, questionId?: any) {
  try {
    const response = await _.get(
      `/username/${username}?questionId=${questionId}`
    );
    if (response?.data?.status) {
      return response?.data?.data;
    }
  } catch (error: unknown) {
    throw Error("Link is broken");
  }
}
const Page = async ({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const response = await getUserId(params.username, searchParams?.q);

  return (
    <>
      <Header />
      <div className="p-4">
        <MessageInputBox
          userId={response?.userId}
          questionId={response?.question}
        />
        <Footer />
      </div>
    </>
  );
};

export default Page;
