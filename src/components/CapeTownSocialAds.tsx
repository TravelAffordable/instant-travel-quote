import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mountain, 
  Wine, 
  Ship, 
  Sun, 
  Camera, 
  MapPin, 
  Clock, 
  Check,
  Sparkles,
  Star,
  Heart,
  Share2,
  MessageCircle,
  Play,
  Music
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Cape Town Package Data
const capePackages = [
  {
    id: 'cpt1',
    name: 'Iconic Tour',
    tagline: 'The Ultimate Cape Town Experience',
    price: 1800,
    kidsPrice: 850,
    duration: '3 nights',
    highlights: [
      'Robben Island Tour',
      'Table Mountain Cableway',
      'Full Day Sightseeing Bus',
      'Canal Boat Cruise'
    ],
    emoji: '🏔️',
    gradient: 'from-sky-500 via-blue-600 to-indigo-700',
    accentColor: 'sky'
  },
  {
    id: 'cpt2',
    name: 'Sunset Explorer',
    tagline: 'Chase the Golden Hour',
    price: 1200,
    kidsPrice: 800,
    duration: '2 nights',
    highlights: [
      '2-Day Sightseeing Tour',
      'Table Mountain Cableway',
      'Signal Hill Sunset',
      'Sundowners Included'
    ],
    emoji: '🌅',
    gradient: 'from-orange-400 via-rose-500 to-purple-600',
    accentColor: 'orange'
  }
];

// Twitter/X Ad Component
const TwitterAd = ({ pkg }: { pkg: typeof capePackages[0] }) => {
  const adRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-4">
      <div 
        ref={adRef}
        className="bg-black rounded-2xl overflow-hidden max-w-lg mx-auto"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Background gradient */}
        <div className={`relative w-full h-full bg-gradient-to-br ${pkg.gradient} p-6 flex flex-col justify-between`}>
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-6xl opacity-20">{pkg.emoji}</div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Header */}
          <div className="relative z-10">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 mb-2">
              Cape Town, South Africa 🇿🇦
            </Badge>
            <h2 className="text-white text-3xl font-bold tracking-tight">{pkg.name}</h2>
            <p className="text-white/80 text-lg">{pkg.tagline}</p>
          </div>
          
          {/* Footer */}
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                <Clock className="w-4 h-4" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pkg.highlights.slice(0, 2).map((h, i) => (
                  <Badge key={i} variant="outline" className="bg-white/10 border-white/30 text-white text-xs">
                    {h}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs uppercase tracking-wide">From</p>
              <p className="text-white text-3xl font-bold">{formatCurrency(pkg.price)}</p>
              <p className="text-white/80 text-sm">per person</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tweet text preview */}
      <div className="bg-muted/50 rounded-lg p-4 max-w-lg mx-auto">
        <p className="text-sm text-muted-foreground mb-2">Suggested tweet:</p>
        <p className="text-foreground">
          {pkg.emoji} {pkg.name} - {pkg.tagline}! 
          <br /><br />
          ✨ {pkg.highlights.join(' • ')}
          <br /><br />
          💰 Only {formatCurrency(pkg.price)} per person for {pkg.duration}
          <br /><br />
          📍 Cape Town, South Africa
          <br />
          #CapeTown #Travel #SouthAfrica #TableMountain #Explore
        </p>
      </div>
    </div>
  );
};

// Facebook Ad Component
const FacebookAd = ({ pkg }: { pkg: typeof capePackages[0] }) => {
  return (
    <div className="space-y-4">
      <Card className="max-w-lg mx-auto overflow-hidden border-0 shadow-xl">
        {/* Hero Image Area */}
        <div 
          className={`relative bg-gradient-to-br ${pkg.gradient} p-8`}
          style={{ minHeight: '280px' }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="relative z-10 h-full flex flex-col justify-end pt-32">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Cape Town, South Africa</span>
            </div>
            <h2 className="text-white text-4xl font-bold mb-2">{pkg.name}</h2>
            <p className="text-white/90 text-xl">{pkg.tagline}</p>
          </div>
        </div>
        
        <CardContent className="p-6 bg-card">
          {/* Price banner */}
          <div className="flex items-center justify-between mb-6 p-4 bg-primary/10 rounded-xl">
            <div>
              <p className="text-sm text-muted-foreground">Package Price</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(pkg.price)}</p>
              <p className="text-sm text-muted-foreground">per person • {pkg.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Kids from</p>
              <p className="text-xl font-semibold text-primary">{formatCurrency(pkg.kidsPrice)}</p>
            </div>
          </div>
          
          {/* Highlights */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-lg">What's Included:</h3>
            <div className="grid grid-cols-2 gap-2">
              {pkg.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA */}
          <Button className="w-full h-12 text-lg font-semibold" size="lg">
            Book Now - Save Your Spot!
          </Button>
          
          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 mt-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              4.9 Rating
            </span>
            <span>•</span>
            <span>500+ Happy Travelers</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Instagram Story Ad Component
const InstagramStoryAd = ({ pkg }: { pkg: typeof capePackages[0] }) => {
  return (
    <div className="space-y-4">
      <div 
        className="max-w-xs mx-auto rounded-3xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: '9/16' }}
      >
        <div className={`relative w-full h-full bg-gradient-to-br ${pkg.gradient}`}>
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/50 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white/50 blur-3xl" />
          </div>
          
          {/* Story progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            <div className="h-1 flex-1 bg-white/50 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-white rounded-full" />
            </div>
            <div className="h-1 flex-1 bg-white/30 rounded-full" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col p-6 pt-12">
            {/* Top section */}
            <div className="text-center mb-8">
              <p className="text-white/80 text-sm uppercase tracking-widest mb-2">Discover</p>
              <div className="text-7xl mb-4">{pkg.emoji}</div>
              <h2 className="text-white text-3xl font-bold">{pkg.name}</h2>
            </div>
            
            {/* Middle - highlights with icons */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {pkg.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium">{h}</span>
                </div>
              ))}
            </div>
            
            {/* Bottom CTA */}
            <div className="mt-auto space-y-4">
              <div className="bg-white rounded-2xl p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">From only</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(pkg.price)}</p>
                <p className="text-sm text-muted-foreground">per person • {pkg.duration}</p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-white">
                <span className="text-sm font-medium">Swipe up to book</span>
                <div className="animate-bounce">↑</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Instagram Feed Post Ad
const InstagramFeedAd = ({ pkg }: { pkg: typeof capePackages[0] }) => {
  return (
    <div className="space-y-4">
      <div className="max-w-lg mx-auto rounded-lg overflow-hidden bg-card border shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 p-3 border-b">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pkg.gradient} flex items-center justify-center`}>
            <Mountain className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">cape_town_travel</p>
            <p className="text-xs text-muted-foreground">Cape Town, South Africa</p>
          </div>
          <Badge variant="secondary" className="text-xs">Sponsored</Badge>
        </div>
        
        {/* Image */}
        <div 
          className={`relative bg-gradient-to-br ${pkg.gradient}`}
          style={{ aspectRatio: '1/1' }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <div className="text-8xl mb-6">{pkg.emoji}</div>
            <h2 className="text-white text-4xl font-bold mb-2">{pkg.name}</h2>
            <p className="text-white/90 text-xl mb-6">{pkg.tagline}</p>
            
            <div className="bg-white/95 backdrop-blur rounded-2xl p-6 mt-4 w-full max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">Price from</span>
                <Badge className={`bg-gradient-to-r ${pkg.gradient} text-white border-0`}>
                  {pkg.duration}
                </Badge>
              </div>
              <p className="text-4xl font-bold text-foreground">{formatCurrency(pkg.price)}</p>
              <p className="text-muted-foreground text-sm">per person</p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
              <MessageCircle className="w-6 h-6 cursor-pointer" />
              <Share2 className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
          <p className="text-sm">
            <span className="font-semibold">2,847 likes</span>
          </p>
          <p className="text-sm mt-1">
            <span className="font-semibold">cape_town_travel</span>{' '}
            {pkg.tagline} {pkg.emoji} Book your Cape Town adventure today! 
            {pkg.highlights.map(h => ` ✓ ${h}`).join('')}
            <span className="text-blue-500"> #CapeTown #TableMountain #Travel</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// TikTok Ad Component
const TikTokAd = ({ pkg }: { pkg: typeof capePackages[0] }) => {
  return (
    <div className="space-y-4">
      <div 
        className="max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black relative"
        style={{ aspectRatio: '9/16' }}
      >
        <div className={`relative w-full h-full bg-gradient-to-br ${pkg.gradient}`}>
          {/* Video play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-10 h-10 text-white fill-white" />
            </div>
          </div>
          
          {/* TikTok UI elements */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="text-white text-sm font-medium">Following | For You</div>
            <div className="text-white">🔍</div>
          </div>
          
          {/* Right sidebar */}
          <div className="absolute right-3 bottom-32 space-y-6 text-white text-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${pkg.gradient} border-2 border-white`} />
              <div className="w-5 h-5 -mt-2 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">+</div>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8" />
              <span className="text-xs">24.5K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8" />
              <span className="text-xs">892</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-8 h-8" />
              <span className="text-xs">1.2K</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-spin-slow">
              <Music className="w-5 h-5" />
            </div>
          </div>
          
          {/* Bottom content */}
          <div className="absolute bottom-4 left-4 right-16 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold">@cape_town_travel</span>
              <Badge className="bg-sky-500 text-white border-0 text-xs">Travel</Badge>
            </div>
            <p className="text-sm mb-3">
              {pkg.emoji} {pkg.name} - {pkg.tagline}! Only {formatCurrency(pkg.price)} per person! 
              #CapeTown #Travel #FYP
            </p>
            
            {/* Price tag */}
            <div className="inline-block bg-white/95 rounded-xl px-4 py-2">
              <p className="text-black font-bold text-lg">{formatCurrency(pkg.price)}</p>
              <p className="text-xs text-gray-600">per person • {pkg.duration}</p>
            </div>
            
            {/* Music */}
            <div className="flex items-center gap-2 mt-3">
              <Music className="w-4 h-4" />
              <span className="text-xs">♫ Original Sound - Epic Travel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const CapeTownSocialAds = () => {
  const [selectedPackage, setSelectedPackage] = useState(0);
  const pkg = capePackages[selectedPackage];

  const copyCaption = (platform: string) => {
    let caption = '';
    switch (platform) {
      case 'twitter':
        caption = `${pkg.emoji} ${pkg.name} - ${pkg.tagline}!\n\n✨ ${pkg.highlights.join(' • ')}\n\n💰 Only ${formatCurrency(pkg.price)} per person for ${pkg.duration}\n\n📍 Cape Town, South Africa\n#CapeTown #Travel #SouthAfrica #TableMountain`;
        break;
      case 'facebook':
        caption = `🌍 Discover the Magic of Cape Town!\n\n${pkg.emoji} ${pkg.name}\n${pkg.tagline}\n\n✅ What's Included:\n${pkg.highlights.map(h => `• ${h}`).join('\n')}\n\n💰 From ${formatCurrency(pkg.price)} per person\n👶 Kids from ${formatCurrency(pkg.kidsPrice)}\n📅 ${pkg.duration}\n\n📞 Book now via WhatsApp!`;
        break;
      case 'instagram':
        caption = `${pkg.emoji} ${pkg.name}\n\n${pkg.tagline} ✨\n\n📍 Cape Town, South Africa\n💰 From ${formatCurrency(pkg.price)} per person\n📅 ${pkg.duration}\n\nWhat's included:\n${pkg.highlights.map(h => `✓ ${h}`).join('\n')}\n\n.\n.\n.\n#CapeTown #TableMountain #RobbenIsland #SouthAfrica #TravelSA #ExploreSA #CapeTownTravel #AfricaTravel #BucketList`;
        break;
      case 'tiktok':
        caption = `${pkg.emoji} POV: You booked the ${pkg.name} package! ${formatCurrency(pkg.price)} per person gets you ${pkg.highlights.slice(0, 2).join(' & ')}! 🔥 #CapeTown #Travel #FYP #SouthAfrica #TableMountain`;
        break;
    }
    navigator.clipboard.writeText(caption);
    toast.success(`${platform} caption copied!`);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Cape Town Social Media Ads</h2>
          <p className="text-muted-foreground">Ready-to-post ads for all platforms</p>
        </div>
        
        {/* Package Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {capePackages.map((p, i) => (
            <Button
              key={p.id}
              variant={selectedPackage === i ? 'default' : 'outline'}
              onClick={() => setSelectedPackage(i)}
              className="gap-2"
            >
              <span className="text-xl">{p.emoji}</span>
              {p.name} - {formatCurrency(p.price)}
            </Button>
          ))}
        </div>
        
        {/* Platform Tabs */}
        <Tabs defaultValue="twitter" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto mb-8">
            <TabsTrigger value="twitter">Twitter/X</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
          </TabsList>
          
          <TabsContent value="twitter" className="space-y-4">
            <TwitterAd pkg={pkg} />
            <div className="flex justify-center">
              <Button onClick={() => copyCaption('twitter')} variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Copy Twitter Caption
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="facebook" className="space-y-4">
            <FacebookAd pkg={pkg} />
            <div className="flex justify-center">
              <Button onClick={() => copyCaption('facebook')} variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Copy Facebook Caption
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="instagram" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">Story Ad</h3>
                <InstagramStoryAd pkg={pkg} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-center mb-4">Feed Post</h3>
                <InstagramFeedAd pkg={pkg} />
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => copyCaption('instagram')} variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Copy Instagram Caption
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="tiktok" className="space-y-4">
            <TikTokAd pkg={pkg} />
            <div className="flex justify-center">
              <Button onClick={() => copyCaption('tiktok')} variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Copy TikTok Caption
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CapeTownSocialAds;
