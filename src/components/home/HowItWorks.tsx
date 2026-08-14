import { MapPin, Sparkles, BedDouble, Wallet } from 'lucide-react';

const STEPS = [
  { icon: MapPin, title: 'Choose your destination', text: 'Start with where you want to go.' },
  { icon: Sparkles, title: 'Choose your experience', text: 'Activities and tours already packaged for you.' },
  { icon: BedDouble, title: 'Choose where you stay', text: 'Budget, standard, mid-range or luxury.' },
  { icon: Wallet, title: 'See your total price', text: 'One clear holiday price, then book.' },
];

export function HowItWorks() {
  return (
    <section className="bg-muted/60 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Your holiday in four simple steps
          </h2>
          <p className="mt-3 text-muted-foreground">
            No confusing options, no hidden extras — the complicated work is already done.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                Step {i + 1}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
