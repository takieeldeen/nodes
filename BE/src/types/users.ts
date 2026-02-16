export type UserStatus = "active" | "suspended" | "pending" | "deleted";

export type UserRole = "user" | "admin" | "owner";

export type AuthProvider = "local" | "google";

export type User = {
  id: number;
  name: string | null;
  email: string;
  image_url: string | null;

  password: string | null;
  password_changed_at: string | null;
  password_reset_expires: string | null;

  provider: string | null;
  provider_id: string | null;

  status: UserStatus;

  is_email_verified: boolean;
  email_verified_at: string | null;

  current_balance: number;

  last_login_at: string | null;
  failed_login_attempts: number;
  account_locked_until: string | null;

  verification_token: string | null;
  verification_token_expiration: string | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
