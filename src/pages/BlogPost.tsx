import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { getBlogPost, blogPosts } from '@/data/blogPosts';
import { getDestinationPage } from '@/data/destinationPages';
import NotFound from './NotFound';

const SITE_URL = 'https://travelaffordable.co.za';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) return <NotFound />;

  const canonical = `/blog/${post.slug}`;
  const ctaDest = post.ctaDestinationSlug ? getDestinationPage(post.ctaDestinationSlug) : undefined;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.metaDescription,
      image: `${SITE_URL}${post.heroImage}`,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: { '@type': 'Organization', name: 'Travel Affordable' },
      publisher: {
        '@type': 'Organization',
        name: 'Travel Affordable',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.ico` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${canonical}` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}${canonical}` },
      ],
    },
  ];

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        canonical={canonical}
        keywords={post.keywords}
        ogImage={`${SITE_URL}${post.heroImage}`}
        ogType="article"
        jsonLd={jsonLd}
      />
      <Header />

      <article className="pt-20">
        <header className="container mx-auto max-w-3xl px-4 pt-8">
          <Link to="/blog" className="text-sm text-primary hover:underline">
            ← Back to blog
          </Link>
          <span className="mt-4 block text-xs font-medium uppercase tracking-wide text-primary">
            {post.category}
          </span>
          <h1 className="font-display mt-2 text-3xl font-bold text-foreground md:text-5xl">{post.title}</h1>
          <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} read
            </span>
          </div>
        </header>

        <div className="container mx-auto mt-8 max-w-4xl px-4">
          <img
            src={post.heroImage}
            alt={post.title}
            width={1600}
            height={900}
            className="aspect-[16/9] w-full rounded-xl object-cover"
          />
        </div>

        <div className="container mx-auto mt-10 max-w-3xl px-4">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            {post.body.map((section, idx) => (
              <section key={idx} className="mb-8">
                {section.heading && (
                  <h2 className="font-display text-2xl font-semibold text-foreground">{section.heading}</h2>
                )}
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-3 text-foreground/80">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-foreground/80">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {ctaDest && (
            <div className="my-12 rounded-xl border border-border bg-muted/30 p-6 md:p-8">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Ready to book your {ctaDest.name} trip?
              </h3>
              <p className="mt-2 text-foreground/70">
                Get an instant online quote — packages start from R{ctaDest.startingFrom.toLocaleString('en-ZA')} per
                person sharing.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => navigate(`/?destination=${ctaDest.destinationId}#quote`)}>
                  Get Instant Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => navigate(`/destinations/${ctaDest.slug}`)}>
                  View Destination Guide
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Related posts */}
        <section className="container mx-auto max-w-5xl px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-foreground">Related guides</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="group">
                <div className="aspect-[16/10] overflow-hidden rounded-lg">
                  <img
                    src={p.heroImage}
                    alt={p.title}
                    loading="lazy"
                    width={600}
                    height={375}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
