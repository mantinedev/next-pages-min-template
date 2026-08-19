import type { TemplatePermissions } from "@/lib/permissions"

export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      permissions: {
        template?: TemplatePermissions
      }
      appAccess?: Record<string, boolean>
      jobTitle?: string
      department?: string
      managerName?: string
    }
  }

  interface UserPublicMetadata {
    permissions?: {
      template?: TemplatePermissions
    }
    appAccess?: Record<string, boolean>
    jobTitle?: string
    department?: string
    managerName?: string
    groups?: string[]
  }
}
