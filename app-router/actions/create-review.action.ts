"use server";

import { revalidateTag } from "next/cache";

export async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!bookId || !content || !author)
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력 해주세요.",
    };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          author,
          bookId,
        }),
      }
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    revalidateTag(`reviews-${bookId}`);
    return {
      status: true,
      error: "",
    };
  } catch (err) {
    return {
      status: false,
      error: `리뷰 저장에 실패했습니다. ${err}`,
    };
  }
}
