import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useOperator } from '@/hooks/useOperator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

function AuthForm() {
  const { toast } = useToast();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === 'in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/operators` } });
    setBusy(false);
    if (res.error) return toast({ title: 'Could not continue', description: res.error.message, variant: 'destructive' });
    if (mode === 'up' && !res.data.session) setSent(true);
  };

  if (sent)
    return <p className="text-center text-muted-foreground">Check your email to confirm your account, then sign in.</p>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="op-email">Email</Label>
        <Input id="op-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="op-pass">Password</Label>
        <Input id="op-pass" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {mode === 'in' ? 'Sign in' : 'Create operator account'}
      </Button>
      <button type="button" className="w-full text-sm text-primary underline" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
        {mode === 'in' ? 'New bus company? Apply for an account' : 'Already registered? Sign in'}
      </button>
    </form>
  );
}

const tabs = [
  { to: '/operators', label: 'My profile' },
  { to: '/operators/quote/new', label: 'New quote' },
  { to: '/operators/quotes', label: 'My quotes' },
];

export function OperatorLayout({ children, requireApproved = false, adminOnly = false }: { children: (ctx: ReturnType<typeof useOperator>) => ReactNode; requireApproved?: boolean; adminOnly?: boolean }) {
  const ctx = useOperator();
  const { pathname } = useLocation();

  let body: ReactNode;
  if (ctx.loading) body = <p className="text-center text-muted-foreground">Loading…</p>;
  else if (!ctx.user)
    body = (
      <Card className="mx-auto max-w-md rounded-2xl">
        <CardContent className="p-6">
          <h1 className="mb-1 font-display text-2xl text-navy">Bus Operator Portal</h1>
          <p className="mb-5 text-sm text-muted-foreground">Quote full holidays — bus, hotel and activities — and earn commission per passenger.</p>
          <AuthForm />
        </CardContent>
      </Card>
    );
  else if (adminOnly && !ctx.isAdmin) body = <p className="text-center text-muted-foreground">This page is for Travel Affordable admins only.</p>;
  else if (requireApproved && ctx.profile?.status !== 'approved' && !ctx.isAdmin)
    body = (
      <p className="text-center text-muted-foreground">
        Your account is awaiting approval by Travel Affordable. Complete your <Link className="text-primary underline" to="/operators">profile</Link> in the meantime.
      </p>
    );
  else body = children(ctx);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-16 pt-28">
        {ctx.user && (
          <nav className="mb-6 flex flex-wrap items-center gap-2">
            {[...tabs, ...(ctx.isAdmin ? [{ to: '/operators/admin', label: 'Admin' }] : [])].map((t) => (
              <Link key={t.to} to={t.to} className={cn('rounded-full px-4 py-2 text-sm', pathname === t.to ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground')}>
                {t.label}
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          </nav>
        )}
        {body}
      </main>
      <Footer />
    </div>
  );
}
