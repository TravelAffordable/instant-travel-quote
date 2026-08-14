import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ShotleftDeals() {
  return (
    <section id="deals" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
          <h2 className="text-center font-display text-3xl font-bold text-gold md:text-4xl">
            Shotleft Deals
          </h2>
          <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            Should you be interested in a deal you saw on shot left that may not appear on the website, or
            if you are looking to get assistance without searching the website, please send an email to{' '}
            <a href="mailto:info@travelaffordable.co.za" className="font-semibold text-primary underline">
              info@travelaffordable.co.za
            </a>{' '}
            or WhatsApp{' '}
            <a
              href="https://wa.me/27796813869"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              079 681 3869
            </a>{' '}
            or please fill out this request form (please be aware that the prices you see on shotleft are
            per person not per couple).
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const f = e.currentTarget as HTMLFormElement;
              const data = new FormData(f);
              const body = `Full name: ${data.get('fullName')}%0D%0AEmail: ${data.get('email')}%0D%0ATelephone: ${data.get('telephone')}%0D%0ADeal interested in: ${data.get('deal')}%0D%0ATravel dates: ${data.get('dates')}%0D%0ANumber of people: ${data.get('people')}%0D%0APrice of the deal: ${data.get('price')}`;
              window.location.href = `mailto:info@travelaffordable.co.za?subject=Shotleft Deal Request&body=${body}`;
            }}
            className="mt-6 grid grid-cols-1 gap-3 text-sm md:grid-cols-2"
          >
            <label className="flex items-center gap-2 md:col-span-2">
              <span className="whitespace-nowrap">Full name:</span>
              <Input name="fullName" required maxLength={100} className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Email:</span>
              <Input name="email" type="email" required maxLength={255} className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Telephone:</span>
              <Input name="telephone" type="tel" required maxLength={20} className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Deal:</span>
              <Input name="deal" required maxLength={200} className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Travel dates:</span>
              <Input name="dates" required maxLength={100} placeholder="e.g. 12-15 June 2026" className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">People:</span>
              <Input name="people" type="number" min={1} max={100} required className="h-9 flex-1" />
            </label>
            <label className="flex items-center gap-2">
              <span className="whitespace-nowrap">Price you saw:</span>
              <Input name="price" required maxLength={50} placeholder="e.g. R3 500 pp" className="h-9 flex-1" />
            </label>
            <div className="md:col-span-2">
              <Button type="submit" className="w-full">
                Send Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
