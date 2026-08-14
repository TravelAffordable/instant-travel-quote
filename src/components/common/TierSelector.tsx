import { cn } from '@/lib/utils';

export type AccommodationTier = 'budget' | 'standard' | 'mid-range' | 'luxury';

export const ACCOMMODATION_TIERS: { id: AccommodationTier; label: string; hint: string }[] = [
  { id: 'budget', label: 'Budget', hint: 'Comfortable & easy on the pocket' },
  { id: 'standard', label: 'Standard', hint: 'Good hotels, great value' },
  { id: 'mid-range', label: 'Mid-range', hint: 'More space and more comfort' },
  { id: 'luxury', label: 'Luxury', hint: 'Premium resorts and top locations' },
];

interface TierSelectorProps {
  value: AccommodationTier | 'all';
  onChange: (tier: AccommodationTier | 'all') => void;
  availableTiers?: AccommodationTier[];
}

export function TierSelector({ value, onChange, availableTiers }: TierSelectorProps) {
  const tiers = availableTiers
    ? ACCOMMODATION_TIERS.filter((t) => availableTiers.includes(t.id))
    : ACCOMMODATION_TIERS;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange('all')}
        className={cn(
          'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
          value === 'all'
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-border bg-card text-foreground hover:bg-muted',
        )}
      >
        All stays
      </button>
      {tiers.map((tier) => (
        <button
          key={tier.id}
          type="button"
          onClick={() => onChange(tier.id)}
          title={tier.hint}
          className={cn(
            'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            value === tier.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground hover:bg-muted',
          )}
        >
          {tier.label}
        </button>
      ))}
    </div>
  );
}
