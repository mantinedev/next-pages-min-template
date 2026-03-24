export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      jobTitle?: string;
      department?: string;
      admin?: boolean;
      user_admin?: boolean;
    };
  }
}
