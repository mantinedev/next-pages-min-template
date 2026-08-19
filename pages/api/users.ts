import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { pickPermissions } from "@/lib/permissions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionClaims } = getAuth(req);
  if (!sessionClaims?.metadata?.permissions?.template?.userAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const client = await clerkClient();

  if (req.method === "GET") {
    const userId = req.query.user;
    if (!userId || Array.isArray(userId)) return res.status(400).json({ error: "Missing user" });

    try {
      const user = await client.users.getUser(userId);
      res
        .status(200)
        .json(pickPermissions(user.publicMetadata?.permissions?.template));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else if (req.method === "POST") {
    const { user: userId, ...permissions } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing user" });

    try {
      const user = await client.users.getUser(userId);
      const updated = await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          permissions: {
            ...user.publicMetadata?.permissions,
            template: pickPermissions(permissions),
          },
        },
      });
      res
        .status(200)
        .json(pickPermissions(updated.publicMetadata?.permissions?.template));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
