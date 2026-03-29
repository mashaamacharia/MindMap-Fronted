import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to complete registration.',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="space-y-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <Mail className="h-8 w-8 text-charcoal" strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-light tracking-tight text-ink">
          Check your email
        </h1>
        <p className="text-sm text-muted">
          We&apos;ve sent a verification link to
          {email && (
            <>
              <br />
              <span className="font-medium text-ink">{email}</span>
            </>
          )}
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Click the link in the email to verify your account and get started.
        </p>
        <p className="text-sm text-muted">
          Didn&apos;t receive the email? Check your spam folder or{' '}
          <button className="text-ink hover:underline font-medium">
            resend verification
          </button>
        </p>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link href="/auth/login">
          Continue to sign in
          <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.5} />
        </Link>
      </Button>
    </div>
  );
}
