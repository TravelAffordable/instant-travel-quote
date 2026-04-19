import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Calendar, Users, Check, Sparkles } from 'lucide-react';
import { getDestinationPage } from '@/data/destinationPages';
import NotFound from './NotFound';

const SITE_URL = 'https://travelaffordable.co.za';

const DestinationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const data = slug ? getDestinationPage(slug) : undefined;

  if (!data) return <NotFound />;

  const canonical = `/destinations/${data.slug}`;

  // JSON-LD: TouristDestination + Breadcrumb + FAQ
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: data.name,
      description: data.intro,
      image: `${SITE_URL}${data.heroImage}`,
      url: `${SITE_URL}${canonical}`,
      address: { '@type': 'PostalAddress', addressRegion: data.region, addressCountry: 'ZA' },
      includesAttraction: data.highlights.map((h) => ({ '@type': 'TouristAttraction', name: h })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${SITE_URL}/destinations` },
        { '@type': 'ListItem', position: 3, name: data.name, item: `${SITE_URL}${canonical}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${data.name} Holiday Package`,
      image: `${SITE_URL}${data.heroImage}`,
      description: data.intro,
      brand: { '@type': 'Brand', name: 'Travel Affordable' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ZAR',
        price: data.startingFrom,
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}${canonical}`,
      },
    },
  ];

  const goToQuote = () => navigate(`/?destination=${data.destinationId}#quote`);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={data.metaTitle}
        description={data.metaDescription}
        canonical={canonical}
        keywords={data.keywords}
        jsonLd={jsonLd}
      />
      <Header />

      {/* Hero */}
      <section className="relative pt-16">
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <img
            src={data.heroImage}
            alt={`${data.name} holiday packages — ${data.region}`}
            className="absolute inset-0 h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="container relative mx-auto flex h-full flex-col justify-end px-4 pb-10">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <MapPin className="h-4 w-4" />
              <span>{data.region}, South Africa</span>
            </div>
            <h1 className="font-display mt-2 text-4xl font-bold text-foreground md:text-6xl">
              {data.name} Holiday Packages
            </h1>
            <p className="mt-3 max-w-2xl text-base text-foreground/80 md:text-lg">
              From <strong className="text-primary">R{data.startingFrom.toLocaleString('en-ZA')}pp</strong> — instant
              online quotes including accommodation and activities.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" onClick={goToQuote}>
                Get an Instant Quote <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/build-package')}>
                Build Custom Package
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + sidebar */}
      <section className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-3">
        <article className="prose prose-slate max-w-none md:col-span-2 dark:prose-invert">
          <h2 className="text-2xl font-bold text-foreground">About {data.name}</h2>
          <p className="text-foreground/80">{data.intro}</p>

          <h3 className="mt-8 text-xl font-semibold text-foreground">Top highlights</h3>
          <ul className="space-y-2">
            {data.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-foreground/80">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 text-xl font-semibold text-foreground">Why visit</h3>
          <p className="text-foreground/80">{data.whyVisit}</p>

          <h3 className="mt-8 text-xl font-semibold text-foreground">Best time to visit</h3>
          <p className="text-foreground/80">{data.bestTime}</p>

          <h3 className="mt-8 text-xl font-semibold text-foreground">Who it’s for</h3>
          <p className="text-foreground/80">{data.whoFor}</p>
        </article>

        <aside className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground">Quick facts</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{data.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Year-round destination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{data.whoFor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    From R{data.startingFrom.toLocaleString('en-ZA')}pp
                  </span>
                </div>
              </dl>
              <Button className="mt-6 w-full" onClick={goToQuote}>
                Get Instant Quote
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>

      {/* FAQs */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-bold text-foreground">
            {data.name} holiday FAQs
          </h2>
          <div className="mt-6 space-y-4">
            {data.faqs.map((f) => (
              <Card key={f.question}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground">{f.question}</h3>
                  <p className="mt-2 text-foreground/80">{f.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground">Other popular destinations</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {['durban', 'cape-town', 'sun-city', 'hartbeespoort', 'magaliesburg', 'mpumalanga', 'bela-bela', 'umhlanga']
            .filter((s) => s !== data.slug)
            .map((s) => (
              <Link
                key={s}
                to={`/destinations/${s}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
              >
                {s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </Link>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationPage;
