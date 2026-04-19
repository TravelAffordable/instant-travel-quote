import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts';

const SITE_URL = 'https://travelaffordable.co.za';

const Blog = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Travel Affordable Blog',
    url: `${SITE_URL}/blog`,
    blogPost: blogPosts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.publishedAt,
      url: `${SITE_URL}/blog/${p.slug}`,
      image: `${SITE_URL}${p.heroImage}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Travel Blog | South African Holiday Guides & Tips"
        description="Destination guides, itineraries and travel tips for affordable South African holidays — Durban, Cape Town, Sun City, Harties, Magaliesburg & more."
        canonical="/blog"
        keywords="south africa travel blog, holiday guides, sa travel tips, destination guides"
        jsonLd={jsonLd}
      />
      <Header />

      <section className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          Travel Blog
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Practical destination guides, itineraries and money-saving travel tips written by South Africans who book these
          trips every week.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.heroImage}
                    alt={post.title}
                    loading="lazy"
                    width={800}
                    height={500}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <h2 className="mt-2 font-display text-xl font-semibold text-foreground group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-foreground/70">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.publishedAt).toLocaleDateString('en-ZA', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-primary">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
