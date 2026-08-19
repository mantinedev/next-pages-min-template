import { clerkClient } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = await clerkClient();

  const allUsers = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const { data, totalCount } = await client.users.getUserList({ limit, offset });
    allUsers.push(...data);
    offset += limit;
    if (offset >= totalCount) break;
  }

  const users = allUsers.map((user) => ({
    id: user.id,
    name:
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.primaryEmailAddress?.emailAddress ||
      user.id,
    email: user.primaryEmailAddress?.emailAddress ?? "",
    imageUrl: user.imageUrl,
  }));

  return res.status(200).json(users);
}
