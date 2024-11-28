import { NextApiRequest, NextApiResponse } from "next";

// 요청 받을때 마다 페이지를 다시 생성도 가능 (On-Demand ISR)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await res.revalidate(`/`);
    return res.json({ revalidate: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("revalidation failed");
  }
}
