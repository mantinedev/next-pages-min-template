import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { TEMPLATE_PERMISSIONS, pickPermissions, type TemplatePermissions } from "@/lib/permissions";
import { decodeJwtPayload } from "@/lib/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = getAuth(req);
  const token = await auth.getToken({ template: "template" });
  const permissions = token
    ? decodeJwtPayload<{ permissions?: TemplatePermissions }>(token).permissions
    : undefined;
  if (!permissions?.userAdmin) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const client = await clerkClient();

  if (req.method === "GET") {
    const userId = req.query.user;
    if (Array.isArray(userId)) return res.status(400).json({ error: "Missing user" });

    // No person named: everyone who has at least one of the permissions.
    if (!userId) {
      try {
        const people = [];
        let offset = 0;
        const limit = 500;
        while (true) {
          const { data, totalCount } = await client.users.getUserList({ limit, offset });
          for (const user of data) {
            const picked = pickPermissions(user.publicMetadata?.permissions?.template);
            if (!Object.values(picked).some(Boolean)) continue;
            people.push({
              id: user.id,
              name:
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.primaryEmailAddress?.emailAddress ||
                user.id,
              email: user.primaryEmailAddress?.emailAddress ?? "",
              imageUrl: user.imageUrl,
              permissions: picked,
            });
          }
          offset += limit;
          if (offset >= totalCount) break;
        }
        people.sort((a, b) => a.name.localeCompare(b.name));
        return res.status(200).json(people);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to list users" });
      }
    }

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
    const { user: userId, permission, value, ...rest } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing user" });

    // One permission at a time, from the list: only the flag clicked changes, so a
    // stale page cannot overwrite someone else's change to the other flags.
    const single = typeof permission === "string";
    if (single) {
      if (!(permission in TEMPLATE_PERMISSIONS) || typeof value !== "boolean") {
        return res.status(400).json({ error: "Invalid permission" });
      }
      if (userId === auth.userId && permission === "userAdmin" && value === false) {
        return res.status(400).json({ error: "You can't remove your own User Admin." });
      }
    }

    try {
      const user = await client.users.getUser(userId);
      const next = single
        ? {
            ...pickPermissions(user.publicMetadata?.permissions?.template),
            [permission]: value,
          }
        : pickPermissions(rest);
      const updated = await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          ...user.publicMetadata,
          permissions: {
            ...user.publicMetadata?.permissions,
            template: next,
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
