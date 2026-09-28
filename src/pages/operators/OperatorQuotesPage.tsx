import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { rand } from '@/lib/operatorQuote';
import { downloadOperatorInvoice } from '@/lib/operatorInvoice';
import { OperatorLayout } from './OperatorLayout';
import type { OperatorProfile } from '@/hooks/useOperator';

type Quote = Tables<'operator_quotes'>;
const STATUSES = ['draft', 'sent', 'deposit_paid'];

function QuotesList({ userId, profile }: { userId: string; profile: OperatorProfile | null }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const load = () => supabase.from('operator_quotes').select('*').eq('operator_id', userId).order('created_at', { ascending: false }).then(({ data }) => setQuotes(data ?? []));
  useEffect(() => { load(); }, [userId]);

  const setStatus = async (id: string, status: string) => {
    await supabase.from('operator_quotes').update({ status }).eq('id', id);
    load();
  };
  const earned = quotes.filter((q) => q.status === 'completed').reduce((s, q) => s + Number(q.commission), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-2xl text-navy">My quotes</h1>
        <p className="text-sm">Commission earned: <strong className="text-sunset">{rand(earned)}</strong></p>
      </div>
      {quotes.length === 0 && <p className="text-muted-foreground">No quotes yet.</p>}
      {quotes.map((q) => (
        <Card key={q.id} className="rounded-2xl">
          <CardContent className="flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-navy">{q.reference} · {q.client_name}{q.group_name ? ` (${q.group_name})` : ''}</p>
              <p className="text-sm text-muted-foreground">{q.hotel_name} · {q.check_in} → {q.check_out}</p>
              <p className="text-sm">{rand(Number(q.grand_total))} · commission {rand(Number(q.commission))}</p>
            </div>
            {q.status === 'completed' ? (
              <span className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Completed</span>
            ) : (
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={q.status} onChange={(e) => setStatus(q.id, e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            )}
            <Button size="sm" variant="outline" disabled={!profile} onClick={() => profile && downloadOperatorInvoice(q, profile)}>Invoice PDF</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function OperatorQuotesPage() {
  return <OperatorLayout>{(ctx) => <QuotesList userId={ctx.user!.id} profile={ctx.profile} />}</OperatorLayout>;
}
