import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface GetawayTotalProps {
  destinationName: string;
  heroImage?: string;
  packageTitle?: string;
  packageCode?: string;
  duration?: string;
  dates?: string;
  travellers: string;
  accommodationName?: string;
  roomLabel?: string;
  experienceTotal: number;
  accommodationTotal: number;
  guests: number;
  ctaLabel: string;
  onCta?: () => void;
  ctaDisabled?: boolean;
  childPriceOnRequest?: boolean;
  className?: string;
}

const rand = (n: number) => `R${Math.round(n).toLocaleString('en-ZA')}`;

export function GetawayTotal({
  destinationName,
  heroImage,
  packageTitle,
  packageCode,
  duration,
  dates,
  travellers,
  accommodationName,
  roomLabel,
  experienceTotal,
  accommodationTotal,
  guests,
  ctaLabel,
  onCta,
  ctaDisabled,
  childPriceOnRequest,
  className,
}: GetawayTotalProps) {
  const total = experienceTotal + accommodationTotal;
  const perPerson = Math.round(total / Math.max(1, guests));

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-premium)] ring-1 ring-border/60',
        className,
      )}
    >
      <div className="bg-burgundy-dark px-6 py-5">
        <p className="font-display text-lg font-bold uppercase tracking-wide text-white">
          Your {destinationName} getaway
        </p>
      </div>

      {heroImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={heroImage} alt={destinationName} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}

      <div className="space-y-5 p-6">
        <dl className="space-y-4 text-sm">
          {packageTitle && (
            <div>
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Experience
              </dt>
              <dd className="font-medium text-foreground">
                {packageCode ? `${packageCode} — ` : ''}
                {packageTitle}
              </dd>
              {duration && <dd className="text-xs text-muted-foreground">{duration}</dd>}
            </div>
          )}
          {dates && (
            <div>
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Dates
              </dt>
              <dd className="font-medium text-foreground">{dates}</dd>
            </div>
          )}
          <div>
            <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Travellers
            </dt>
            <dd className="font-medium text-foreground">{travellers}</dd>
          </div>
          <div>
            <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Accommodation
            </dt>
            <dd className="font-medium text-foreground">
              {accommodationName ?? 'Choose your stay'}
            </dd>
            {accommodationName && roomLabel && (
              <dd className="text-xs text-muted-foreground">{roomLabel}</dd>
            )}
          </div>
        </dl>

        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Experience</span>
            <span className="font-medium text-foreground">{rand(experienceTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accommodation</span>
            <span className="font-medium text-foreground">
              {accommodationTotal > 0 ? rand(accommodationTotal) : '—'}
            </span>
          </div>
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <div className="flex items-end justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Total pp
            </span>
            <span className="font-display text-xl font-bold text-burgundy">{rand(perPerson)}</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-burgundy">
              Total booking
            </span>
            <span className="font-display text-3xl font-bold text-burgundy">{rand(total)}</span>
          </div>
        </div>

        {onCta && (
          <Button
            onClick={onCta}
            disabled={ctaDisabled}
            className="h-14 w-full rounded-xl bg-burgundy text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white hover:bg-burgundy-dark"
          >
            {ctaLabel}
          </Button>
        )}

        {childPriceOnRequest && (
          <p className="rounded-xl bg-cream p-3 text-xs text-burgundy">
            Children's pricing for this experience is confirmed by our team and included with your booking
            confirmation.
          </p>
        )}
      </div>
    </div>
  );
}

/** Mobile persistent price bar. */
export function GetawayTotalBar({
  total,
  perPerson,
  ctaLabel,
  onCta,
  disabled,
}: {
  total: number;
  perPerson: number;
  ctaLabel: string;
  onCta?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-burgundy-dark/20 bg-card/98 px-4 py-3 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur lg:hidden">
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Total booking
          </p>
          <p className="font-display text-xl font-bold leading-tight text-burgundy">
            R{Math.round(total).toLocaleString('en-ZA')}
          </p>
          <p className="text-[0.65rem] text-muted-foreground">
            R{Math.round(perPerson).toLocaleString('en-ZA')} pp
          </p>
        </div>
        {onCta && (
          <Button
            onClick={onCta}
            disabled={disabled}
            className="h-12 flex-1 rounded-xl bg-burgundy text-[0.68rem] font-bold uppercase tracking-[0.14em] text-white hover:bg-burgundy-dark"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
