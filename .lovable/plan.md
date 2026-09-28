# Bus Operator Quote Platform — Phase 1

## Goal
A separate bus-operator area where invited bus companies log in, build a full holiday quote (bus hire + curated package + hotel), and earn tiered commission per passenger. The client gets one invoice with two clearly separated deposit sections.

## What operators will see
1. **Sign up / log in** at `/operators` (invite-only: you approve each company before they can quote).
2. **Operator profile**: company name, contact, bank details (for the client's bus deposit), logo.
3. **New quote** (step by step):
   - Client details (name, email, phone, group name)
   - Destination and dates
   - Passengers: adults, children with ages
   - Choose one or more curated packages (tour codes, prices from your existing packages)
   - **Bus hire amount** field (their own transport price)
   - **Hotel**: pick from your list, OR type their own hotel with a nightly rate
   - Full quote total shown instantly, with per-person price
4. **My quotes**: list of saved quotes with status (Draft, Sent, Deposit paid, Completed) and commission earned.
5. **Download invoice** (PDF) to send to their client.

## Own-hotel rule
- Operator types a hotel name and rate.
- If the name matches a hotel on your list and their rate is **higher** than yours, show: "Choose this hotel on our list to get a better rate" with a one-tap switch.
- If their rate is lower, or they tick "superior room type" and describe it, the own hotel is accepted.
- Every own-hotel entry is flagged for your review.

## Commission
- Base bonus R250 per completed trip.
- Per passenger: under 20 = R0, 20–39 = R100 each, 40+ = R150 each.
- Commission is shown on each quote but only counts as "earned" once you mark the trip Completed.

## Client invoice (one document, two deposits)
- Section A — **Managed by [Bus Company]**: bus hire amount, their bank details.
- Section B — **Managed by Travel Affordable**: accommodation + activities, your bank details.
- Clear statement of who is responsible for what, plus the 50% deposit rule and availability disclaimer.
- Complete price and per-person total; no activity line-item breakdown (keeps your existing display rule).

## Your admin view
- Approve/suspend operators.
- See all operator quotes, flagged own-hotel entries, and mark trips Completed.
- Commission totals per operator per month.

## Not in Phase 1
Online payments, lead sharing, volume rewards, operator branding on your public site.

## Technical details
- Lovable Cloud auth (email/password) for operators; `operator_profiles` table; roles in a separate `user_roles` table (`admin`, `operator`) with `has_role()`.
- Tables: `operator_quotes` (client, dates, pax, package ids, bus amount, hotel source/name/rate, totals, commission, status), with RLS so operators see only their own; admins see all.
- Pricing reuses existing package logic (`calculatePackageBaseCost`, R10 rounding). Hotel cost = nightly rate × nights × rooms required.
- Hotel comparison against existing RMS/static hotel lists by normalised name.
- Invoice PDF via existing jsPDF utilities.
- New routes: `/operators`, `/operators/quote/new`, `/operators/quotes`, `/operators/admin`.
- Existing public bus-hire page stays unchanged.
