// Migrates users.publicMetadata.permissions.template from this app's own
// Clerk registration to the AarAuth Clerk registration, matching users by
// email.
//
// NOTE: this is the shared starter template. Whoever clones this repo for a
// new app should rename "template" / "TEMPLATE_*" throughout this file (and
// lib/permissions.ts) to their app's own name before using it.
//
// Usage:
//   TEMPLATE_CLERK_SECRET_KEY=sk_... AARAUTH_CLERK_SECRET_KEY=sk_... \
//     node scripts/migrate-clerk-permissions.mjs [--dry-run]

import { createClerkClient } from "@clerk/backend";

const sourceKey = process.env.TEMPLATE_CLERK_SECRET_KEY;
const targetKey = process.env.AARAUTH_CLERK_SECRET_KEY;
const dryRun = process.argv.includes("--dry-run");

if (!sourceKey || !targetKey) {
  console.error(
    "Set TEMPLATE_CLERK_SECRET_KEY and AARAUTH_CLERK_SECRET_KEY env vars.",
  );
  process.exit(1);
}

const source = createClerkClient({ secretKey: sourceKey });
const target = createClerkClient({ secretKey: targetKey });

async function getAllUsers(client) {
  const users = [];
  let offset = 0;
  const limit = 500;
  while (true) {
    const { data, totalCount } = await client.users.getUserList({ limit, offset });
    users.push(...data);
    offset += data.length;
    if (offset >= totalCount || data.length === 0) break;
  }
  return users;
}

function pickPermissions(template) {
  return {
    admin: template?.admin ?? false,
    userAdmin: template?.userAdmin ?? false,
  };
}

const [sourceUsers, targetUsers] = await Promise.all([
  getAllUsers(source),
  getAllUsers(target),
]);

const targetByEmail = new Map(
  targetUsers.map((u) => [u.emailAddresses[0]?.emailAddress?.toLowerCase(), u]),
);

let migrated = 0;
let skippedNoPerms = 0;
let skippedNoMatch = 0;

for (const sourceUser of sourceUsers) {
  const email = sourceUser.emailAddresses[0]?.emailAddress?.toLowerCase();
  const template = sourceUser.publicMetadata?.template;

  if (!template) {
    skippedNoPerms++;
    continue;
  }

  const targetUser = email && targetByEmail.get(email);
  if (!targetUser) {
    console.warn(`No AarAuth user for ${email ?? sourceUser.id}, skipping.`);
    skippedNoMatch++;
    continue;
  }

  const permissions = pickPermissions(template);
  console.log(`${email}: ${JSON.stringify(permissions)}`);

  if (!dryRun) {
    await target.users.updateUserMetadata(targetUser.id, {
      publicMetadata: {
        ...targetUser.publicMetadata,
        permissions: {
          ...targetUser.publicMetadata?.permissions,
          template: permissions,
        },
      },
    });
  }
  migrated++;
}

console.log(
  `\n${dryRun ? "[dry run] " : ""}Migrated: ${migrated}, no permissions to migrate: ${skippedNoPerms}, no AarAuth match: ${skippedNoMatch}`,
);
