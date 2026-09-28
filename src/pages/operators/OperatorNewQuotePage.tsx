import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { destinations, getHotelsByDestination, getPackagesByDestination } from '@/data/travelData';
import { computeOperatorQuote, findListedHotel, rand } from '@/lib/operatorQuote';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OperatorLayout } from './OperatorLayout';

const sel = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';

function QuoteBuilder({ userId }: { userId: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [f, setF] = useState({
    clientName: '', clientEmail: '', clientPhone: '', groupName: '',
    destination: 'durban', checkIn: '', checkOut: '', adults: 20, childrenAges: '' as string,
    packageIds: [] as string[], busCode: '', busAmount: 0,
    hotelSource: 'list' as 'list' | 'own', hotelId: '', ownName: '', ownRate: 0, ownCapacity: 2,
    superior: false, superiorNotes: '', rooms: 1,
  });
  const set = (p: Partial<typeof f>) => setF((s) => ({ ...s, ...p }));

  const pkgs = getPackagesByDestination(f.destination);
  const listHotels = getHotelsByDestination(f.destination).filter((h) => !/affordable option|beachfront$/i.test(h.name));
  const ages = f.childrenAges.split(',').map((a) => parseInt(a.trim(), 10)).filter((n) => !isNaN(n));
  const listed = listHotels.find((h) => h.id === f.hotelId);
  const match = f.hotelSource === 'own' ? findListedHotel(f.ownName, f.destination) : undefined;
  const betterOnList = !!match && f.ownRate > match.pricePerNight && !f.superior;

  const hotelName = f.hotelSource === 'list' ? listed?.name ?? '' : f.ownName;
  const hotelRate = f.hotelSource === 'list' ? listed?.pricePerNight ?? 0 : f.ownRate;
  const hotelCapacity = f.hotelSource === 'list' ? listed?.capacity ?? 2 : f.ownCapacity;

  const c = useMemo(
    () => computeOperatorQuote({ destination: f.destination, checkIn: f.checkIn, checkOut: f.checkOut, adults: f.adults, childrenAges: ages, packageIds: f.packageIds, busAmount: f.busAmount, hotelRate, hotelCapacity, rooms: f.rooms }),
    [f, hotelRate, hotelCapacity, ages.join(',')],
  );

  const canSave = f.clientName && f.checkIn && c.nights > 0 && f.packageIds.length > 0 && hotelName && hotelRate > 0 && !betterOnList;

  const save = async () => {
    const { error } = await supabase.from('operator_quotes').insert({
      operator_id: userId, client_name: f.clientName, client_email: f.clientEmail, client_phone: f.clientPhone, group_name: f.groupName,
      destination: f.destination, check_in: f.checkIn, check_out: f.checkOut, adults: f.adults, children_ages: ages,
      package_ids: f.packageIds, bus_hire_code: f.busCode, bus_amount: f.busAmount, hotel_source: f.hotelSource,
      hotel_name: hotelName, hotel_rate: hotelRate, hotel_capacity: hotelCapacity, rooms: c.roomsRequired,
      superior_room: f.superior, superior_room_notes: f.superiorNotes, flagged: f.hotelSource === 'own',
      package_total: c.packageTotal, accommodation_total: c.accommodationTotal, grand_total: c.grandTotal, commission: c.commission,
    });
    if (error) return toast({ title: 'Could not save quote', description: error.message, variant: 'destructive' });
    toast({ title: 'Quote saved' });
    navigate('/operators/quotes');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="rounded-2xl">
        <CardContent className="space-y-6 p-6">
          <h1 className="font-display text-2xl text-navy">New group quote</h1>

          <section className="grid gap-3 sm:grid-cols-2">
            <div><Label>Client name *</Label><Input value={f.clientName} onChange={(e) => set({ clientName: e.target.value })} /></div>
            <div><Label>Group name</Label><Input value={f.groupName} onChange={(e) => set({ groupName: e.target.value })} /></div>
            <div><Label>Client email</Label><Input type="email" value={f.clientEmail} onChange={(e) => set({ clientEmail: e.target.value })} /></div>
            <div><Label>Client phone</Label><Input value={f.clientPhone} onChange={(e) => set({ clientPhone: e.target.value })} /></div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Destination</Label>
              <select className={sel} value={f.destination} onChange={(e) => set({ destination: e.target.value, packageIds: [], hotelId: '' })}>
                {destinations.filter((d) => !d.international).map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div><Label>Check-in *</Label><Input type="date" value={f.checkIn} onChange={(e) => set({ checkIn: e.target.value })} /></div>
            <div><Label>Check-out *</Label><Input type="date" value={f.checkOut} onChange={(e) => set({ checkOut: e.target.value })} /></div>
            <div><Label>Adults</Label><Input type="number" min={1} value={f.adults} onChange={(e) => set({ adults: Number(e.target.value) })} /></div>
            <div className="sm:col-span-2"><Label>Children ages (comma separated)</Label><Input placeholder="e.g. 5, 9, 14" value={f.childrenAges} onChange={(e) => set({ childrenAges: e.target.value })} /></div>
          </section>

          <section>
            <Label>Curated packages *</Label>
            <div className="mt-2 space-y-2">
              {pkgs.map((p) => (
                <label key={p.id} className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
                  <Checkbox checked={f.packageIds.includes(p.id)} onCheckedChange={(v) => set({ packageIds: v ? [...f.packageIds, p.id] : f.packageIds.filter((x) => x !== p.id) })} />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div><Label>Bus hire code</Label><Input value={f.busCode} onChange={(e) => set({ busCode: e.target.value })} /></div>
            <div><Label>Bus hire amount (R) *</Label><Input type="number" min={0} value={f.busAmount} onChange={(e) => set({ busAmount: Number(e.target.value) })} /></div>
          </section>

          <section className="space-y-3">
            <Label>Hotel</Label>
            <div className="flex gap-2">
              <Button type="button" variant={f.hotelSource === 'list' ? 'default' : 'outline'} onClick={() => set({ hotelSource: 'list' })}>From our list</Button>
              <Button type="button" variant={f.hotelSource === 'own' ? 'default' : 'outline'} onClick={() => set({ hotelSource: 'own' })}>My own hotel</Button>
            </div>
            {f.hotelSource === 'list' ? (
              <select className={sel} value={f.hotelId} onChange={(e) => set({ hotelId: e.target.value })}>
                <option value="">Choose a hotel…</option>
                {listHotels.map((h) => <option key={h.id} value={h.id}>{h.name}{h.capacity ? ` (${h.capacity}-sleeper)` : ''}</option>)}
              </select>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3"><Label>Hotel name</Label><Input value={f.ownName} onChange={(e) => set({ ownName: e.target.value })} /></div>
                <div><Label>Rate per room per night (R)</Label><Input type="number" min={0} value={f.ownRate} onChange={(e) => set({ ownRate: Number(e.target.value) })} /></div>
                <div><Label>Sleeps per room</Label><Input type="number" min={1} value={f.ownCapacity} onChange={(e) => set({ ownCapacity: Number(e.target.value) })} /></div>
                <label className="flex items-center gap-2 text-sm sm:col-span-3">
                  <Checkbox checked={f.superior} onCheckedChange={(v) => set({ superior: !!v })} /> Superior room type to the one on our list
                </label>
                {f.superior && <div className="sm:col-span-3"><Label>Describe the room</Label><Input value={f.superiorNotes} onChange={(e) => set({ superiorNotes: e.target.value })} /></div>}
                {betterOnList && match && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm sm:col-span-3">
                    Choose this hotel on our list to get a better rate.{' '}
                    <button type="button" className="font-semibold underline" onClick={() => set({ hotelSource: 'list', hotelId: match.id })}>Use {match.name} from our list</button>
                  </div>
                )}
              </div>
            )}
            <div className="w-40"><Label>Rooms</Label><Input type="number" min={1} value={f.rooms} onChange={(e) => set({ rooms: Number(e.target.value) })} /></div>
          </section>
        </CardContent>
      </Card>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Card className="rounded-2xl">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Complete group holiday</p>
            <p className="font-display text-3xl text-sunset">{rand(c.grandTotal)}</p>
            <p className="text-sm text-muted-foreground">{rand(c.perPerson)} per person · {c.pax} passengers · {c.nights} nights · {c.roomsRequired} rooms</p>
            <div className="space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between"><span>Bus deposit to you (50%)</span><span>{rand(c.busTotal / 2)}</span></div>
              <div className="flex justify-between"><span>Travel Affordable deposit (50%)</span><span>{rand(c.travelAffordableTotal / 2)}</span></div>
            </div>
            <div className="rounded-lg bg-primary/10 p-3 text-sm">Your commission on completion: <strong>{rand(c.commission)}</strong></div>
            <Button className="w-full" disabled={!canSave} onClick={save}>Save quote</Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export default function OperatorNewQuotePage() {
  return <OperatorLayout requireApproved>{(ctx) => <QuoteBuilder userId={ctx.user!.id} />}</OperatorLayout>;
}
