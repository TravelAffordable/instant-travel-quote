import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { rand } from '@/lib/operatorQuote';
import { downloadOperatorInvoice } from '@/lib/operatorInvoice';
import { OperatorLayout } from './OperatorLayout';

type Quote = Tables<'operator_quotes'>;
type Profile = Tables<'operator_profiles'>;

function Admin() {
  const [ops, setOps] = useState<Profile[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const load = async () => {
    const [{ data: o }, { data: q }] = await Promise.all([
      supabase.from('operator_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('operator_quotes').select('*').order('created_at', { ascending: false }),
    ]);
    setOps(o ?? []);
    setQuotes(q ?? []);
  };
  useEffect(() => { load(); }, []);

  const setOpStatus = async (id: string, status: string) => { await supabase.from('operator_profiles').update({ status }).eq('id', id); load(); };
  const complete = async (id: string) => { await supabase.from('operator_quotes').update({ status: 'completed' }).eq('id', id); load(); };
  const opOf = (uid: string) => ops.find((o) => o.user_id === uid);
  const month = new Date().toISOString().slice(0, 7);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="font-display text-2xl text-navy">Bus operators</h1>
        {ops.map((o) => {
          const monthComm = quotes.filter((q) => q.operator_id === o.user_id && q.status === 'completed' && q.updated_at.startsWith(month)).reduce((s, q) => s + Number(q.commission), 0);
          return (
            <Card key={o.id} className="rounded-2xl">
              <CardContent className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="font-semibold">{o.company_name} <span className="text-xs capitalize text-muted-foreground">({o.status})</span></p>
                  <p className="text-sm text-muted-foreground">{o.contact_name} · {o.email} · {o.phone} · this month {rand(monthComm)}</p>
                </div>
                {o.status !== 'approved' && <Button size="sm" onClick={() => setOpStatus(o.id, 'approved')}>Approve</Button>}
                {o.status !== 'suspended' && <Button size="sm" variant="outline" onClick={() => setOpStatus(o.id, 'suspended')}>Suspend</Button>}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl text-navy">All operator quotes</h2>
        {quotes.map((q) => {
          const op = opOf(q.operator_id);
          return (
            <Card key={q.id} className={q.flagged ? 'rounded-2xl border-destructive' : 'rounded-2xl'}>
              <CardContent className="flex flex-wrap items-center gap-3 p-4">
                <div className="flex-1">
                  <p className="font-semibold">{q.reference} · {op?.company_name} · {q.client_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {q.hotel_name} @ {rand(Number(q.hotel_rate))}/night{q.flagged ? ' · OWN HOTEL — review' : ''}{q.superior_room ? ` · superior: ${q.superior_room_notes}` : ''}
                  </p>
                  <p className="text-sm">{rand(Number(q.grand_total))} · commission {rand(Number(q.commission))} · <span className="capitalize">{q.status.replace('_', ' ')}</span></p>
                </div>
                {q.status !== 'completed' && <Button size="sm" onClick={() => complete(q.id)}>Mark completed</Button>}
                {op && <Button size="sm" variant="outline" onClick={() => downloadOperatorInvoice(q, op)}>Invoice</Button>}
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

export default function OperatorAdminPage() {
  return <OperatorLayout adminOnly>{() => <Admin />}</OperatorLayout>;
}
