import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OperatorLayout } from './OperatorLayout';
import type { OperatorProfile } from '@/hooks/useOperator';

const fields: [keyof OperatorProfile, string][] = [
  ['company_name', 'Company name'],
  ['contact_name', 'Contact person'],
  ['phone', 'Phone'],
  ['email', 'Business email'],
  ['bank_name', 'Bank'],
  ['account_holder', 'Account holder'],
  ['account_number', 'Account number'],
  ['branch_code', 'Branch code'],
];

function ProfileForm({ userId, profile, reload }: { userId: string; profile: OperatorProfile | null; reload: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<Record<string, string>>({});
  useEffect(() => {
    setForm(Object.fromEntries(fields.map(([k]) => [k, String(profile?.[k] ?? '')])));
  }, [profile]);

  const [saved, setSaved] = useState('');
  const save = async () => {
    const isNew = !profile;
    const payload = { ...form, user_id: userId };
    const { error } = profile
      ? await supabase.from('operator_profiles').update(form).eq('user_id', userId)
      : await supabase.from('operator_profiles').insert(payload);
    if (error) return toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    if (isNew || profile?.status === 'pending') {
      await supabase.functions.invoke('send-quote-request', {
        body: {
          guestName: `${form.contact_name || '—'} (${form.company_name})`,
          guestEmail: form.email || '—',
          guestTel: form.phone || '—',
          bookingType: 'Bus Operator Registration — awaiting approval at /operators/admin',
          specialRequests: `Company: ${form.company_name}. Bank: ${form.bank_name}, ${form.account_holder}, acc ${form.account_number}, branch ${form.branch_code}`,
        },
      }).catch(() => {});
    }
    const msg = profile?.status === 'approved'
      ? 'Profile saved.'
      : 'Profile saved and sent to Travel Affordable for approval. You will be able to create quotes once approved.';
    setSaved(msg);
    toast({ title: 'Profile saved', description: msg });
    reload();
  };

  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-navy">Company profile</h1>
          <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">{profile?.status ?? 'not submitted'}</span>
        </div>
        <p className="text-sm text-muted-foreground">Your bank details appear on the client invoice for the bus hire deposit.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([k, label]) => (
            <div key={k}>
              <Label htmlFor={k}>{label}</Label>
              <Input id={k} value={form[k] ?? ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
        </div>
        <Button onClick={save} disabled={!form.company_name}>
          {profile ? 'Save profile' : 'Submit for approval'}
        </Button>
        {saved && <p className="rounded-lg bg-muted p-3 text-sm font-medium text-foreground">{saved}</p>}
      </CardContent>
    </Card>
  );
}

export default function OperatorProfilePage() {
  return <OperatorLayout>{(ctx) => <ProfileForm userId={ctx.user!.id} profile={ctx.profile} reload={ctx.reload} />}</OperatorLayout>;
}
