import AuthLayout from "@/features/auth/components/auth-layout";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

export default Layout;
