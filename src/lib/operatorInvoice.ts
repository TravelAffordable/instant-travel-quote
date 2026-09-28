import { jsPDF } from 'jspdf';
import { packages, destinations } from '@/data/travelData';
import type { Tables } from '@/integrations/supabase/types';
import { computeOperatorQuote, rand } from '@/lib/operatorQuote';

type Quote = Tables<'operator_quotes'>;
type Profile = Tables<'operator_profiles'>;

export function downloadOperatorInvoice(q: Quote, op: Profile) {
  const c = computeOperatorQuote({
    destination: q.destination,
    checkIn: q.check_in ?? '',
    checkOut: q.check_out ?? '',
    adults: q.adults,
    childrenAges: q.children_ages,
    packageIds: q.package_ids,
    busAmount: Number(q.bus_amount),
    hotelRate: Number(q.hotel_rate),
    hotelCapacity: q.hotel_capacity,
    rooms: q.rooms,
  });
  const doc = new jsPDF();
  const W = doc.internal.pageSize.getWidth();
  let y = 20;
  const line = (t: string, size = 10, bold = false, x = 20) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const wrapped = doc.splitTextToSize(t, W - x - 20);
    doc.text(wrapped, x, y);
    y += wrapped.length * (size * 0.45) + 2;
  };
  const dest = destinations.find((d) => d.id === q.destination)?.name ?? q.destination;

  doc.setTextColor(3, 26, 67);
  line(`${op.company_name || 'Bus Operator'} x Travel Affordable`, 16, true);
  doc.setTextColor(60, 60, 60);
  line(`Group Holiday Invoice — Ref ${q.reference}`, 11, true);
  line(`Client: ${q.client_name}${q.group_name ? ` (${q.group_name})` : ''} · ${q.client_email} · ${q.client_phone}`);
  line(`Destination: ${dest} · ${q.check_in} to ${q.check_out} (${c.nights} nights) · ${c.pax} passengers`);
  y += 4;

  line('What your holiday includes', 12, true);
  line(`• Return bus transport by ${op.company_name}`);
  line(`• Accommodation at ${q.hotel_name} — ${c.nights} night(s), ${c.roomsRequired} room(s)`);
  q.package_ids.forEach((id) => {
    const p = packages.find((x) => x.id === id);
    if (p) {
      line(`• ${p.name}`, 10, true);
      p.activitiesIncluded.forEach((a) => line(`   – ${a}`, 9));
    }
  });
  y += 4;

  doc.setDrawColor(245, 168, 0);
  doc.line(20, y, W - 20, y);
  y += 8;
  line(`Complete holiday price: ${rand(c.grandTotal)}  (${rand(c.perPerson)} per person)`, 13, true);
  y += 2;
  line('Your payment is split into two deposits:', 11, true);

  line(`SECTION A — Managed by ${op.company_name}`, 11, true);
  line(`Bus hire: ${rand(c.busTotal)} · 50% deposit: ${rand(c.busTotal / 2)}`);
  line(`Pay to: ${op.account_holder || op.company_name}, ${op.bank_name}, Acc ${op.account_number}, Branch ${op.branch_code}. Ref ${q.reference}`);
  line(`${op.company_name} is responsible for all transport arrangements.`, 9);
  y += 3;

  line('SECTION B — Managed by Travel Affordable', 11, true);
  line(`Accommodation and activities: ${rand(c.travelAffordableTotal)} · 50% deposit: ${rand(c.travelAffordableTotal / 2)}`);
  line('Pay to: Travel Affordable Pty Ltd — banking details supplied on request (info@travelaffordable.co.za). Ref ' + q.reference);
  line('Travel Affordable is responsible for accommodation and all activities.', 9);
  y += 4;

  line('A 50% deposit on each section secures the booking. Prices and availability are confirmed on the day of invoicing and valid for 1 day. Discounts subject to availability.', 9);
  line('Travel Affordable Pty Ltd · The Atrium Building, 5th Street, Sandown · 079 681 3869 · info@travelaffordable.co.za', 9);

  doc.save(`Invoice-${q.reference}.pdf`);
}
