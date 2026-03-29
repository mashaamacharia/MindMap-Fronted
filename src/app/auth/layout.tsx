/**
 * Auth Layout
 * Centered auth shell using AuthShell component
 */

import { AuthShell } from '@/components/layout';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthShell>{children}</AuthShell>;
}
