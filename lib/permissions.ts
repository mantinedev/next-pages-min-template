export const TEMPLATE_PERMISSIONS = {
  admin: {
    title: "Admin",
    description: "The user is able to see access all areas of the app.",
  },
  userAdmin: {
    title: "User Admin",
    description: "The user is able to manage other users' permissions.",
  },
} as const;

export type TemplatePermissions = {
  [K in keyof typeof TEMPLATE_PERMISSIONS]: boolean;
};

const permissionKeys = Object.keys(
  TEMPLATE_PERMISSIONS
) as (keyof TemplatePermissions)[];

export function pickPermissions(
  template: Partial<TemplatePermissions> | undefined
): TemplatePermissions {
  return Object.fromEntries(
    permissionKeys.map((key) => [key, template?.[key] ?? false])
  ) as TemplatePermissions;
}
