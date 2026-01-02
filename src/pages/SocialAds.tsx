import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Phone, MessageCircle, Calendar, MapPin, Check, Star, Clock, Send, Twitter, Loader2, Pencil, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdShareButtons from "@/components/AdShareButtons";
import { toast } from "sonner";
import sundownRanch1 from "@/assets/sundown-ranch-1.jpeg";
import sundownRanch2 from "@/assets/sundown-ranch-2.jpeg";
import sundownRanch3 from "@/assets/sundown-ranch-3.jpeg";
import sundownRanch4 from "@/assets/sundown-ranch-4.jpeg";
import sundownRanch5 from "@/assets/sundown-ranch-5.jpeg";
import guesthouseA1 from "@/assets/guesthouse-a-1.png";
import guesthouseA2 from "@/assets/guesthouse-a-2.jpeg";
import guesthouseA3 from "@/assets/guesthouse-a-3.jpg";
import guesthouseA4 from "@/assets/guesthouse-a-4.jpeg";
import guesthouseA5 from "@/assets/guesthouse-a-5.jpg";
import guesthouseA6 from "@/assets/guesthouse-a-6.jpg";

interface EditableField {
  [key: string]: string;
}

const SocialAds = () => {
  const [activeAd, setActiveAd] = useState<'sundown' | 'guesthouse'>('sundown');
  const [customTweet, setCustomTweet] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [editedFields, setEditedFields] = useState<EditableField>({});

  // Refs for capturing ad images
  const heroAdRef = useRef<HTMLDivElement>(null);
  const story1AdRef = useRef<HTMLDivElement>(null);
  const story2AdRef = useRef<HTMLDivElement>(null);
  const facebookAdRef = useRef<HTMLDivElement>(null);
  const compareAdRef = useRef<HTMLDivElement>(null);
  const packageAdRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  // Editable content state - Hero Ad
  const [whatsappNumber, setWhatsappNumber] = useState("0796813869");
  const [heroTitle, setHeroTitle] = useState("SUN CITY\nGETAWAY");
  const [heroBadge, setHeroBadge] = useState("🔥 NEW YEAR SPECIAL");
  const [heroDate, setHeroDate] = useState("Weekends & Midweek");
  const [heroDistanceLabel, setHeroDistanceLabel] = useState("7 MIN FROM");
  const [heroDistanceLocation, setHeroDistanceLocation] = useState("SUN CITY");
  const [heroPriceLabel, setHeroPriceLabel] = useState("FROM ONLY");
  const [heroPriceSubtext, setHeroPriceSubtext] = useState("per person sharing • All-inclusive");
  const [heroCtaText, setHeroCtaText] = useState("WhatsApp Now");
  const [heroBookNowLabel, setHeroBookNowLabel] = useState("📞 Book Now:");

  // Story 1 Ad
  const [storyTitle, setStoryTitle] = useState("SUN CITY\nESCAPE");
  const [storyBadge, setStoryBadge] = useState("⏰ LIMITED SPOTS");
  const [storyNewYearText, setStoryNewYearText] = useState("NEW YEAR");
  const [storyDistanceText, setStoryDistanceText] = useState("7 min from Sun City");
  const [storyInclude1, setStoryInclude1] = useState("Valley of the Waves");
  const [storyInclude2, setStoryInclude2] = useState("Sun City Entrance");
  const [storyInclude3, setStoryInclude3] = useState("Lunch Included");
  const [storyInclude4, setStoryInclude4] = useState("Shuttle Transport");
  const [storyPriceLabel, setStoryPriceLabel] = useState("FROM ONLY");
  const [storyPriceSubtext, setStoryPriceSubtext] = useState("per person • 2 Nights B&B");
  const [storyCtaText, setStoryCtaText] = useState("BOOK NOW →");

  // Story 2 (Safari) Ad
  const [safariTitle, setSafariTitle] = useState("GAME DRIVE\n+ SUN CITY");
  const [safariBadge, setSafariBadge] = useState("🦁 SAFARI SPECIAL");
  const [safariSubtitle, setSafariSubtitle] = useState("PILANESBERG");
  const [safariPackageTitle, setSafariPackageTitle] = useState("SUN4 PACKAGE");
  const [safariInclude1, setSafariInclude1] = useState("2 Nights B&B");
  const [safariInclude2, setSafariInclude2] = useState("Pilanesberg Game Drive");
  const [safariInclude3, setSafariInclude3] = useState("Valley of the Waves");
  const [safariInclude4, setSafariInclude4] = useState("Sun City Entrance");
  const [safariInclude5, setSafariInclude5] = useState("Lunch in Sun City");
  const [safariInclude6, setSafariInclude6] = useState("All Shuttles");
  const [safariPriceLabel, setSafariPriceLabel] = useState("ONLY");
  const [safariPriceSubtext, setSafariPriceSubtext] = useState("per person sharing");
  const [safariTotalLabel, setSafariTotalLabel] = useState("Total for 2:");
  const [safariCtaText, setSafariCtaText] = useState("WhatsApp Now →");

  // Facebook Ad
  const [fbTitle, setFbTitle] = useState("SUN CITY ESCAPE");
  const [fbBadge, setFbBadge] = useState("🎉 NEW YEAR 2026");
  const [fbDistanceText, setFbDistanceText] = useState("7 min from Sun City");
  const [fbDateText, setFbDateText] = useState("Weekends & Midweek");
  const [fbNightsText, setFbNightsText] = useState("2 Nights B&B");
  const [fbPriceLabel, setFbPriceLabel] = useState("PACKAGES FROM");
  const [fbPriceSubtext, setFbPriceSubtext] = useState("per person sharing");

  // Compare Ad
  const [compareBadge, setCompareBadge] = useState("🎯 COMPARE PACKAGES");
  const [compareSubtitle, setCompareSubtitle] = useState("2 Nights B&B");
  const [compareFooter, setCompareFooter] = useState("Weekends available too!");

  // Editable Tweet Templates
  const [tweetTemplate1, setTweetTemplate1] = useState(`🎉 SUN CITY GETAWAY! 🌴\n\n7 min from Sun City\n📅 Weekends & Midweek\n\n✅ Valley of the Waves\n✅ Sun City Entrance\n✅ 2 Nights B&B\n\nFrom R2,830 pp\n\n📲 WhatsApp: 0796813869\n\n#SunCity #Travel`);
  const [tweetTemplate2, setTweetTemplate2] = useState(`🦁 SAFARI + SUN CITY COMBO! 🌅\n\nPilanesberg Game Drive included!\n📍 Sundown Ranch\n\nOnly R3,450 per person\n\n📞 Book: 0796813869\n\n#Safari #SunCity #Pilanesberg`);
  const [tweetTemplate3, setTweetTemplate3] = useState(`⏰ LIMITED SPOTS!\n\nSundown Ranch\n🗓️ Weekends & Midweek\n\n💰 From R2,830 pp\n\nIncludes transport, entrance & more!\n\n📲 0796813869\n\n#SunCity #Travel`);
  const [editingTweet, setEditingTweet] = useState<number | null>(null);

  const [sundownPackages, setSundownPackages] = useState([
    {
      name: "SUN3 - Valley Getaway",
      pricePerPerson: 2830,
      totalFor2: 5660,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Lunch in Sun City",
        "Shuttle to/from Sun City"
      ],
      highlight: "BEST VALUE"
    },
    {
      name: "SUN1 - Cruise Combo",
      pricePerPerson: 3530,
      totalFor2: 7060,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Sun City Maze",
        "2hr Sunday Buffet Cruise",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "MOST POPULAR"
    },
    {
      name: "SUN4 - Safari Weekender",
      pricePerPerson: 3530,
      totalFor2: 7060,
      includes: [
        "2 Nights B&B at Sundown Ranch",
        "Sun City Entrance",
        "Valley of the Waves",
        "Pilanesberg Game Drive",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "ADVENTURE PICK"
    }
  ]);

  const [guesthousePackages, setGuesthousePackages] = useState([
    {
      name: "SUN3 - Valley Getaway",
      pricePerPerson: 2150,
      totalFor2: 4300,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Lunch in Sun City",
        "Shuttle to/from Sun City"
      ],
      highlight: "BUDGET FRIENDLY"
    },
    {
      name: "SUN1 - Cruise Combo",
      pricePerPerson: 2850,
      totalFor2: 5700,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Sun City Maze",
        "2hr Sunday Buffet Cruise",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "GREAT VALUE"
    },
    {
      name: "SUN4 - Safari Weekender",
      pricePerPerson: 2850,
      totalFor2: 5700,
      includes: [
        "2 Nights B&B at Sun City Guesthouse",
        "Sun City Entrance",
        "Valley of the Waves",
        "Pilanesberg Game Drive",
        "Lunch in Sun City",
        "Shuttle included"
      ],
      highlight: "SAFARI SPECIAL"
    }
  ]);

  // Hotel name state
  const [sundownHotelName, setSundownHotelName] = useState('At various hotels and guesthouses 7 minutes from Sun City');
  const [guesthouseHotelName, setGuesthouseHotelName] = useState('Sun City Area Guesthouse A');

  const packages = activeAd === 'sundown' ? sundownPackages : guesthousePackages;
  const setPackages = activeAd === 'sundown' ? setSundownPackages : setGuesthousePackages;
  const hotelName = activeAd === 'sundown' ? sundownHotelName : guesthouseHotelName;
  const setHotelName = activeAd === 'sundown' ? setSundownHotelName : setGuesthouseHotelName;
  const sundownImages = [sundownRanch1, sundownRanch2, sundownRanch3, sundownRanch4, sundownRanch5];
  const guesthouseImages = [guesthouseA1, guesthouseA2, guesthouseA3, guesthouseA4, guesthouseA5, guesthouseA6];
  const hotelImages = activeAd === 'sundown' ? sundownImages : guesthouseImages;

  const tweetTemplates = [
    { value: tweetTemplate1, setter: setTweetTemplate1 },
    { value: tweetTemplate2, setter: setTweetTemplate2 },
    { value: tweetTemplate3, setter: setTweetTemplate3 },
  ];

  const postTweet = async (tweetText: string) => {
    if (!tweetText.trim()) {
      toast.error("Please enter a tweet");
      return;
    }
    if (tweetText.length > 280) {
      toast.error("Tweet exceeds 280 characters");
      return;
    }

    setIsPosting(true);
    try {
      const { data, error } = await supabase.functions.invoke('post-tweet', {
        body: { tweet: tweetText }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success("Tweet posted successfully!");
        setCustomTweet("");
      } else {
        throw new Error(data.error || "Failed to post tweet");
      }
    } catch (error: any) {
      console.error("Tweet error:", error);
      toast.error(error.message || "Failed to post tweet");
    } finally {
      setIsPosting(false);
    }
  };

  const startEditing = (adId: string) => {
    setEditingAd(adId);
    setEditedFields({});
  };

  const cancelEditing = () => {
    setEditingAd(null);
    setEditedFields({});
  };

  const saveEditing = () => {
    setEditingAd(null);
    toast.success("Changes saved!");
  };

  const updatePackageField = (index: number, field: string, value: string | number) => {
    const newPackages = [...packages];
    if (field === 'pricePerPerson') {
      newPackages[index] = { ...newPackages[index], pricePerPerson: Number(value), totalFor2: Number(value) * 2 };
    } else {
      newPackages[index] = { ...newPackages[index], [field]: value };
    }
    setPackages(newPackages);
  };

  const updatePackageInclude = (pkgIndex: number, includeIndex: number, value: string) => {
    const newPackages = [...packages];
    const newIncludes = [...newPackages[pkgIndex].includes];
    newIncludes[includeIndex] = value;
    newPackages[pkgIndex] = { ...newPackages[pkgIndex], includes: newIncludes };
    setPackages(newPackages);
  };

  const EditButton = ({ adId }: { adId: string }) => (
    <Button
      onClick={() => editingAd === adId ? cancelEditing() : startEditing(adId)}
      className={`absolute top-2 right-2 z-20 ${editingAd === adId ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600'} text-black`}
      size="sm"
    >
      {editingAd === adId ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
    </Button>
  );

  const SaveButton = ({ adId }: { adId: string }) => (
    editingAd === adId ? (
      <Button
        onClick={saveEditing}
        className="absolute top-2 right-12 z-20 bg-green-500 hover:bg-green-600 text-white"
        size="sm"
      >
        <Save className="w-4 h-4" />
      </Button>
    ) : null
  );

  // Editable text component
  const EditableText = ({ 
    value, 
    onChange, 
    isEditing, 
    className = "", 
    multiline = false,
    inputClassName = ""
  }: { 
    value: string; 
    onChange: (val: string) => void; 
    isEditing: boolean; 
    className?: string;
    multiline?: boolean;
    inputClassName?: string;
  }) => {
    if (isEditing) {
      if (multiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-black/50 border-amber-400 text-white ${inputClassName}`}
          />
        );
      }
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-black/50 border-amber-400 text-white ${inputClassName}`}
        />
      );
    }
    return <span className={className}>{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-700 p-4">
      {/* Toggle between hotels */}
      <div className="flex justify-center gap-4 mb-6">
        <Button 
          onClick={() => setActiveAd('sundown')}
          className={`${activeAd === 'sundown' ? 'bg-amber-500 text-black' : 'bg-black/30 text-white'}`}
        >
          Sundown Ranch Ads
        </Button>
        <Button 
          onClick={() => setActiveAd('guesthouse')}
          className={`${activeAd === 'guesthouse' ? 'bg-amber-500 text-black' : 'bg-black/30 text-white'}`}
        >
          Guesthouse A Ads
        </Button>
      </div>

      {/* Global Settings */}
      <div className="max-w-md mx-auto mb-6 p-4 bg-black/30 backdrop-blur rounded-xl">
        <h3 className="text-white font-bold mb-2">📱 WhatsApp Number (used in all ads):</h3>
        <Input
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          className="bg-black/40 border-white/20 text-white"
          placeholder="Enter WhatsApp number"
        />
        <h3 className="text-white font-bold mb-2 mt-4">🏨 Hotel Name:</h3>
        <Input
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          className="bg-black/40 border-white/20 text-white"
          placeholder="Enter hotel name"
        />
      </div>

      {/* Individual Ads - Square format for Instagram */}
      <div className="grid gap-8 max-w-6xl mx-auto">
        
        {/* AD 1: Hero Ad - Square Format */}
        <div ref={heroAdRef} className="relative bg-gradient-to-br from-black via-amber-950 to-black rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '1/1', maxWidth: '600px', margin: '0 auto' }}>
          <EditButton adId="hero" />
          <SaveButton adId="hero" />
          <div className="relative h-full">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img 
                src={hotelImages[0]} 
                alt={hotelName}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-6 text-white">
              {/* Top Badge */}
              <div className="flex justify-between items-start">
                {editingAd === 'hero' ? (
                  <Input
                    value={heroBadge}
                    onChange={(e) => setHeroBadge(e.target.value)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm w-48"
                  />
                ) : (
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full font-black text-sm animate-pulse">
                    {heroBadge}
                  </div>
                )}
                <div className="text-right">
                  {editingAd === 'hero' ? (
                    <>
                      <Input
                        value={heroDistanceLabel}
                        onChange={(e) => setHeroDistanceLabel(e.target.value)}
                        className="bg-transparent border-amber-400 text-amber-400 font-bold text-xs w-24 mb-1"
                      />
                      <Input
                        value={heroDistanceLocation}
                        onChange={(e) => setHeroDistanceLocation(e.target.value)}
                        className="bg-transparent border-white text-white font-black text-lg w-24"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-amber-400 font-bold text-xs">{heroDistanceLabel}</div>
                      <div className="text-white font-black text-lg">{heroDistanceLocation}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Middle - Main Message */}
              <div className="text-center space-y-3">
                {editingAd === 'hero' ? (
                  <Textarea
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="text-4xl md:text-5xl font-black text-amber-400 bg-transparent border-amber-400 text-center"
                  />
                ) : (
                  <h1 className="text-4xl md:text-5xl font-black text-amber-400 drop-shadow-lg leading-tight whitespace-pre-line">
                    {heroTitle}
                  </h1>
                )}
                {editingAd === 'hero' ? (
                  <Input
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="text-xl font-bold text-white/90 bg-transparent border-white text-center"
                  />
                ) : (
                  <p className="text-xl font-bold text-white/90">{hotelName}</p>
                )}
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  {editingAd === 'hero' ? (
                    <Input
                      value={heroDate}
                      onChange={(e) => setHeroDate(e.target.value)}
                      className="bg-transparent border-amber-400 text-white text-lg font-semibold w-48"
                    />
                  ) : (
                    <span className="text-lg font-semibold">{heroDate}</span>
                  )}
                </div>
              </div>

              {/* Bottom - Price & CTA */}
              <div className="space-y-4">
                <div className="text-center">
                  {editingAd === 'hero' ? (
                    <Input
                      value={heroPriceLabel}
                      onChange={(e) => setHeroPriceLabel(e.target.value)}
                      className="bg-transparent border-amber-400 text-amber-400 text-sm font-bold w-32 mx-auto mb-1"
                    />
                  ) : (
                    <div className="text-amber-400 text-sm font-bold">{heroPriceLabel}</div>
                  )}
                  {editingAd === 'hero' ? (
                    <Input
                      type="number"
                      value={packages[0].pricePerPerson}
                      onChange={(e) => updatePackageField(0, 'pricePerPerson', e.target.value)}
                      className="text-5xl font-black text-white bg-transparent border-white w-40 mx-auto"
                    />
                  ) : (
                    <div className="text-5xl font-black text-white">
                      R{packages[0].pricePerPerson.toLocaleString()}
                    </div>
                  )}
                  {editingAd === 'hero' ? (
                    <Input
                      value={heroPriceSubtext}
                      onChange={(e) => setHeroPriceSubtext(e.target.value)}
                      className="bg-transparent border-white/50 text-white/80 text-sm w-64 mx-auto"
                    />
                  ) : (
                    <div className="text-white/80 text-sm">{heroPriceSubtext}</div>
                  )}
                </div>
                
                <div className="flex gap-3 justify-center">
                  {editingAd === 'hero' ? (
                    <Input
                      value={heroCtaText}
                      onChange={(e) => setHeroCtaText(e.target.value)}
                      className="bg-green-500 text-white px-6 py-3 rounded-full font-bold text-lg w-48"
                    />
                  ) : (
                    <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 text-lg">
                      <MessageCircle className="w-5 h-5" />
                      {heroCtaText}
                    </div>
                  )}
                </div>
                
                <div className="text-center text-amber-300 text-sm font-semibold">
                  {editingAd === 'hero' ? (
                    <Input
                      value={heroBookNowLabel}
                      onChange={(e) => setHeroBookNowLabel(e.target.value)}
                      className="bg-transparent border-amber-300 text-amber-300 text-sm w-32 inline-block mr-2"
                    />
                  ) : (
                    <span>{heroBookNowLabel} </span>
                  )}
                  {whatsappNumber}
              </div>
            </div>
          </div>
          <AdShareButtons 
            adName="Hero Ad" 
            tweetText={`${heroBadge}\n\n${heroTitle.replace(/\n/g, ' ')}\n${hotelName}\n📅 ${heroDate}\n\n${heroPriceLabel} R${packages[0].pricePerPerson.toLocaleString()}\n${heroPriceSubtext}\n\n📲 WhatsApp: ${whatsappNumber}\n\n#SunCity #Travel #SouthAfrica`}
            adContainerRef={heroAdRef}
          />
        </div>

        {/* AD 2: Package Carousel Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {packages.map((pkg, index) => (
            <div 
              ref={packageAdRefs[index]}
              key={pkg.name}
              className="relative bg-gradient-to-br from-black to-amber-950 rounded-2xl overflow-hidden shadow-xl"
              style={{ aspectRatio: '4/5' }}
            >
              <EditButton adId={`package-${index}`} />
              <SaveButton adId={`package-${index}`} />
              {/* Image Header */}
              <div className="h-1/3 relative">
                <img 
                  src={hotelImages[index % hotelImages.length]} 
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                {editingAd === `package-${index}` ? (
                  <Input
                    value={pkg.highlight}
                    onChange={(e) => updatePackageField(index, 'highlight', e.target.value)}
                    className="absolute top-3 left-3 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black w-32"
                  />
                ) : (
                  <div className="absolute top-3 left-3 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-black">
                    {pkg.highlight}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4 text-white space-y-3 h-2/3 flex flex-col justify-between">
                <div>
                  {editingAd === `package-${index}` ? (
                    <Input
                      value={pkg.name}
                      onChange={(e) => updatePackageField(index, 'name', e.target.value)}
                      className="text-lg font-black text-amber-400 bg-transparent border-amber-400"
                    />
                  ) : (
                    <h3 className="text-lg font-black text-amber-400 leading-tight">{pkg.name}</h3>
                  )}
                  {editingAd === `package-${index}` ? (
                    <Input
                      value={`${hotelName} • 2 Nights B&B`}
                      onChange={(e) => setHotelName(e.target.value.split(' • ')[0])}
                      className="text-xs text-white/70 mt-1 bg-transparent border-white/30"
                    />
                  ) : (
                    <p className="text-xs text-white/70 mt-1">{hotelName} • 2 Nights B&B</p>
                  )}
                  
                  <div className="mt-3 space-y-1">
                    {pkg.includes.slice(0, 5).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        {editingAd === `package-${index}` ? (
                          <Input
                            value={item}
                            onChange={(e) => updatePackageInclude(index, i, e.target.value)}
                            className="text-white/90 bg-transparent border-white/30 h-6 text-xs"
                          />
                        ) : (
                          <span className="text-white/90">{item}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-amber-400 text-xs font-bold">PER PERSON</div>
                      {editingAd === `package-${index}` ? (
                        <Input
                          type="number"
                          value={pkg.pricePerPerson}
                          onChange={(e) => updatePackageField(index, 'pricePerPerson', e.target.value)}
                          className="text-2xl font-black text-white bg-transparent border-amber-400 w-28"
                        />
                      ) : (
                        <div className="text-3xl font-black text-white">R{pkg.pricePerPerson.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-xs">Total for 2</div>
                      <div className="text-lg font-bold text-amber-300">R{pkg.totalFor2.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-500 text-white text-center py-2 rounded-full text-sm font-bold">
                    📲 WhatsApp: {whatsappNumber}
                  </div>
                </div>
              </div>
              <AdShareButtons 
                adName={pkg.name} 
                tweetText={`${pkg.highlight}\n\n${pkg.name}\n${hotelName}\n\n${pkg.includes.slice(0, 4).map(i => `✅ ${i}`).join('\n')}\n\n💰 R${pkg.pricePerPerson.toLocaleString()} per person\n💰 R${pkg.totalFor2.toLocaleString()} total for 2\n\n📲 WhatsApp: ${whatsappNumber}\n\n#SunCity #Travel`}
                adContainerRef={packageAdRefs[index]}
              />
            </div>
          ))}
        </div>
        </div>

        {/* AD 3: Story Format - Vertical */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div 
            ref={story1AdRef}
            className="relative bg-gradient-to-b from-amber-600 via-orange-700 to-black rounded-3xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '9/16', width: '320px' }}
          >
            <EditButton adId="story1" />
            <SaveButton adId="story1" />
            <div className="relative h-full">
              <div className="absolute inset-0">
                <img 
                  src={hotelImages[2]} 
                  alt="Valley of the Waves"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-5 text-white">
                {/* Top */}
                <div className="text-center space-y-2">
                  {editingAd === 'story1' ? (
                    <Input
                      value={storyBadge}
                      onChange={(e) => setStoryBadge(e.target.value)}
                      className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black"
                    />
                  ) : (
                    <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-black inline-block animate-pulse">
                      {storyBadge}
                    </div>
                  )}
                  {editingAd === 'story1' ? (
                    <Input
                      value={storyNewYearText}
                      onChange={(e) => setStoryNewYearText(e.target.value)}
                      className="text-2xl font-black text-amber-300 bg-transparent border-amber-300 text-center"
                    />
                  ) : (
                    <h2 className="text-2xl font-black text-amber-300">{storyNewYearText}</h2>
                  )}
                  {editingAd === 'story1' ? (
                    <Textarea
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      className="text-4xl font-black bg-transparent border-white text-center"
                    />
                  ) : (
                    <h1 className="text-4xl font-black leading-none whitespace-pre-line">{storyTitle}</h1>
                  )}
                </div>

                {/* Middle */}
                <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Calendar className="w-4 h-4" />
                      {editingAd === 'story1' ? (
                        <Input
                          value={heroDate}
                          onChange={(e) => setHeroDate(e.target.value)}
                          className="bg-transparent border-amber-400 text-amber-400 font-bold"
                        />
                      ) : (
                        heroDate
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      {editingAd === 'story1' ? (
                        <Input
                          value={hotelName}
                          onChange={(e) => setHotelName(e.target.value)}
                          className="bg-transparent border-white/50 text-white/90"
                        />
                      ) : (
                        hotelName
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-white/90">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {editingAd === 'story1' ? (
                        <Input
                          value={storyDistanceText}
                          onChange={(e) => setStoryDistanceText(e.target.value)}
                          className="bg-transparent border-white/50 text-white/90"
                        />
                      ) : (
                        storyDistanceText
                      )}
                    </div>
                  </div>

                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      {editingAd === 'story1' ? (
                        <Input value={storyInclude1} onChange={(e) => setStoryInclude1(e.target.value)} className="bg-transparent border-white/30 text-white h-6" />
                      ) : storyInclude1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      {editingAd === 'story1' ? (
                        <Input value={storyInclude2} onChange={(e) => setStoryInclude2(e.target.value)} className="bg-transparent border-white/30 text-white h-6" />
                      ) : storyInclude2}
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      {editingAd === 'story1' ? (
                        <Input value={storyInclude3} onChange={(e) => setStoryInclude3(e.target.value)} className="bg-transparent border-white/30 text-white h-6" />
                      ) : storyInclude3}
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      {editingAd === 'story1' ? (
                        <Input value={storyInclude4} onChange={(e) => setStoryInclude4(e.target.value)} className="bg-transparent border-white/30 text-white h-6" />
                      ) : storyInclude4}
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="space-y-3">
                  <div className="text-center">
                    {editingAd === 'story1' ? (
                      <Input value={storyPriceLabel} onChange={(e) => setStoryPriceLabel(e.target.value)} className="bg-transparent border-amber-400 text-amber-400 text-sm font-bold w-32 mx-auto" />
                    ) : (
                      <div className="text-amber-400 text-sm font-bold">{storyPriceLabel}</div>
                    )}
                    {editingAd === 'story1' ? (
                      <Input
                        type="number"
                        value={packages[0].pricePerPerson}
                        onChange={(e) => updatePackageField(0, 'pricePerPerson', e.target.value)}
                        className="text-5xl font-black bg-transparent border-white w-40 mx-auto"
                      />
                    ) : (
                      <div className="text-5xl font-black">R{packages[0].pricePerPerson.toLocaleString()}</div>
                    )}
                    {editingAd === 'story1' ? (
                      <Input value={storyPriceSubtext} onChange={(e) => setStoryPriceSubtext(e.target.value)} className="bg-transparent border-white/30 text-white/70 text-xs w-48 mx-auto" />
                    ) : (
                      <div className="text-white/70 text-xs">{storyPriceSubtext}</div>
                    )}
                  </div>
                  
                  {editingAd === 'story1' ? (
                    <Input value={storyCtaText} onChange={(e) => setStoryCtaText(e.target.value)} className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg" />
                  ) : (
                    <div className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg">
                      {storyCtaText}
                    </div>
                  )}
                  <div className="text-center text-amber-300 text-sm">
                    WhatsApp: {whatsappNumber}
                  </div>
                </div>
              </div>
            </div>
            <AdShareButtons 
              adName="Story Ad - New Year" 
              tweetText={`${storyBadge}\n\n${storyNewYearText}\n${storyTitle.replace(/\n/g, ' ')}\n\n📅 ${heroDate}\n📍 ${hotelName}\n🕐 ${storyDistanceText}\n\n✅ ${storyInclude1}\n✅ ${storyInclude2}\n✅ ${storyInclude3}\n✅ ${storyInclude4}\n\n${storyPriceLabel} R${packages[0].pricePerPerson.toLocaleString()}\n${storyPriceSubtext}\n\n📲 ${whatsappNumber}\n\n#SunCity #NewYear2026`}
              adContainerRef={story1AdRef}
            />
          </div>

          {/* Story 2 - Safari Focus */}
          <div 
            ref={story2AdRef}
            className="relative bg-gradient-to-b from-green-800 via-emerald-900 to-black rounded-3xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '9/16', width: '320px' }}
          >
            <EditButton adId="story2" />
            <SaveButton adId="story2" />
            <div className="relative h-full">
              <div className="absolute inset-0">
                <img 
                  src={hotelImages[1]} 
                  alt="Safari View"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/60 to-black" />
              </div>

              <div className="relative h-full flex flex-col justify-between p-5 text-white">
                {/* Top */}
                <div className="text-center space-y-2">
                  {editingAd === 'story2' ? (
                    <Input
                      value={safariBadge}
                      onChange={(e) => setSafariBadge(e.target.value)}
                      className="bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-black"
                    />
                  ) : (
                    <div className="bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-black inline-block">
                      {safariBadge}
                    </div>
                  )}
                  {editingAd === 'story2' ? (
                    <Input value={safariSubtitle} onChange={(e) => setSafariSubtitle(e.target.value)} className="text-xl font-black text-green-300 bg-transparent border-green-300 text-center" />
                  ) : (
                    <h2 className="text-xl font-black text-green-300">{safariSubtitle}</h2>
                  )}
                  {editingAd === 'story2' ? (
                    <Textarea
                      value={safariTitle}
                      onChange={(e) => setSafariTitle(e.target.value)}
                      className="text-3xl font-black bg-transparent border-white text-center"
                    />
                  ) : (
                    <h1 className="text-3xl font-black leading-none whitespace-pre-line">{safariTitle}</h1>
                  )}
                </div>

                {/* Middle */}
                <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 space-y-2">
                    {editingAd === 'story2' ? (
                      <Input value={safariPackageTitle} onChange={(e) => setSafariPackageTitle(e.target.value)} className="text-amber-400 font-bold text-center bg-transparent border-amber-400" />
                    ) : (
                      <h3 className="text-amber-400 font-bold text-center">{safariPackageTitle}</h3>
                    )}
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude1} onChange={(e) => setSafariInclude1(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude1}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude2} onChange={(e) => setSafariInclude2(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude2}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude3} onChange={(e) => setSafariInclude3(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude3}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude4} onChange={(e) => setSafariInclude4(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude4}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude5} onChange={(e) => setSafariInclude5(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude5}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-amber-400" />
                        {editingAd === 'story2' ? (
                          <Input value={safariInclude6} onChange={(e) => setSafariInclude6(e.target.value)} className="bg-transparent border-white/30 text-white h-5 text-xs" />
                        ) : safariInclude6}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="space-y-3">
                  <div className="text-center">
                    {editingAd === 'story2' ? (
                      <Input value={safariPriceLabel} onChange={(e) => setSafariPriceLabel(e.target.value)} className="bg-transparent border-green-300 text-green-300 text-sm font-bold w-24 mx-auto" />
                    ) : (
                      <div className="text-green-300 text-sm font-bold">{safariPriceLabel}</div>
                    )}
                    {editingAd === 'story2' ? (
                      <Input
                        type="number"
                        value={packages[2].pricePerPerson}
                        onChange={(e) => updatePackageField(2, 'pricePerPerson', e.target.value)}
                        className="text-5xl font-black bg-transparent border-white w-40 mx-auto"
                      />
                    ) : (
                      <div className="text-5xl font-black">R{packages[2].pricePerPerson.toLocaleString()}</div>
                    )}
                    {editingAd === 'story2' ? (
                      <Input value={safariPriceSubtext} onChange={(e) => setSafariPriceSubtext(e.target.value)} className="bg-transparent border-white/30 text-white/70 text-xs w-40 mx-auto" />
                    ) : (
                      <div className="text-white/70 text-xs">{safariPriceSubtext}</div>
                    )}
                    <div className="text-amber-300 text-sm mt-1">
                      {editingAd === 'story2' ? (
                        <Input value={safariTotalLabel} onChange={(e) => setSafariTotalLabel(e.target.value)} className="bg-transparent border-amber-300 text-amber-300 text-sm w-24 inline-block" />
                      ) : (
                        <span>{safariTotalLabel} </span>
                      )}
                      R{packages[2].totalFor2.toLocaleString()}
                    </div>
                  </div>
                  
                  {editingAd === 'story2' ? (
                    <Input value={safariCtaText} onChange={(e) => setSafariCtaText(e.target.value)} className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg" />
                  ) : (
                    <div className="bg-green-500 text-white text-center py-3 rounded-full font-bold text-lg">
                      {safariCtaText}
                    </div>
                  )}
                  <div className="text-center text-green-300 text-sm">
                    📞 {whatsappNumber}
                  </div>
                </div>
              </div>
            </div>
            <AdShareButtons 
              adName="Story Ad - Safari" 
              tweetText={`${safariBadge}\n\n${safariTitle.replace(/\n/g, ' ')}\n${safariSubtitle}\n\n${safariPackageTitle}:\n✅ ${safariInclude1}\n✅ ${safariInclude2}\n✅ ${safariInclude3}\n✅ ${safariInclude4}\n✅ ${safariInclude5}\n✅ ${safariInclude6}\n\n${safariPriceLabel} R${packages[2].pricePerPerson.toLocaleString()}\n${safariPriceSubtext}\n${safariTotalLabel} R${packages[2].totalFor2.toLocaleString()}\n\n📞 ${whatsappNumber}\n\n#Safari #SunCity #Pilanesberg`}
              adContainerRef={story2AdRef}
            />
          </div>
        </div>

        {/* AD 4: Facebook Wide Format */}
        <div 
          ref={facebookAdRef}
          className="relative bg-gradient-to-r from-black via-amber-950 to-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: '16/9', maxWidth: '800px', margin: '0 auto' }}
        >
          <EditButton adId="facebook" />
          <SaveButton adId="facebook" />
          <div className="relative h-full">
            <div className="absolute inset-0 grid grid-cols-3 gap-1">
              <img src={hotelImages[0]} alt="" className="w-full h-full object-cover opacity-60" />
              <img src={hotelImages[3]} alt="" className="w-full h-full object-cover opacity-60" />
              <img src={hotelImages[4]} alt="" className="w-full h-full object-cover opacity-60" />
            </div>
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative h-full flex items-center justify-between p-8 text-white">
              {/* Left */}
              <div className="space-y-3 max-w-md">
                {editingAd === 'facebook' ? (
                  <Input
                    value={fbBadge}
                    onChange={(e) => setFbBadge(e.target.value)}
                    className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-black w-48"
                  />
                ) : (
                  <div className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-black inline-block">
                    {fbBadge}
                  </div>
                )}
                {editingAd === 'facebook' ? (
                  <Input
                    value={fbTitle}
                    onChange={(e) => setFbTitle(e.target.value)}
                    className="text-4xl md:text-5xl font-black text-amber-400 bg-transparent border-amber-400"
                  />
                ) : (
                  <h1 className="text-4xl md:text-5xl font-black text-amber-400 leading-tight">
                    {fbTitle}
                  </h1>
                )}
                {editingAd === 'facebook' ? (
                  <div className="flex gap-2">
                    <Input
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="text-lg text-white/90 bg-transparent border-white/50"
                    />
                    <Input
                      value={fbDistanceText}
                      onChange={(e) => setFbDistanceText(e.target.value)}
                      className="text-lg text-white/90 bg-transparent border-white/50"
                    />
                  </div>
                ) : (
                  <p className="text-lg text-white/90">{hotelName} • {fbDistanceText}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {editingAd === 'facebook' ? (
                      <Input value={fbDateText} onChange={(e) => setFbDateText(e.target.value)} className="bg-transparent border-white/30 text-white w-32" />
                    ) : fbDateText}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {editingAd === 'facebook' ? (
                      <Input value={fbNightsText} onChange={(e) => setFbNightsText(e.target.value)} className="bg-transparent border-white/30 text-white w-32" />
                    ) : fbNightsText}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="text-center space-y-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-xl p-6">
                  {editingAd === 'facebook' ? (
                    <Input value={fbPriceLabel} onChange={(e) => setFbPriceLabel(e.target.value)} className="bg-transparent border-amber-400 text-amber-400 text-sm font-bold w-40 mx-auto" />
                  ) : (
                    <div className="text-amber-400 text-sm font-bold">{fbPriceLabel}</div>
                  )}
                  {editingAd === 'facebook' ? (
                    <Input
                      type="number"
                      value={packages[0].pricePerPerson}
                      onChange={(e) => updatePackageField(0, 'pricePerPerson', e.target.value)}
                      className="text-5xl font-black text-white bg-transparent border-white w-40 mx-auto"
                    />
                  ) : (
                    <div className="text-5xl font-black text-white">R{packages[0].pricePerPerson.toLocaleString()}</div>
                  )}
                  {editingAd === 'facebook' ? (
                    <Input value={fbPriceSubtext} onChange={(e) => setFbPriceSubtext(e.target.value)} className="bg-transparent border-white/30 text-white/70 text-sm w-40 mx-auto" />
                  ) : (
                    <div className="text-white/70 text-sm">{fbPriceSubtext}</div>
                  )}
                </div>
                <div className="bg-green-500 text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  {whatsappNumber}
                </div>
              </div>
            </div>
          </div>
          <AdShareButtons 
            adName="Facebook Ad" 
            tweetText={`${fbBadge}\n\n${fbTitle}\n${hotelName} • ${fbDistanceText}\n\n📅 ${fbDateText}\n🛏️ ${fbNightsText}\n\n${fbPriceLabel}\nR${packages[0].pricePerPerson.toLocaleString()} ${fbPriceSubtext}\n\n📲 ${whatsappNumber}\n\n#SunCity #NewYear2026 #Travel`}
            adContainerRef={facebookAdRef}
          />
        </div>

        {/* AD 5: Comparison Card */}
        <div ref={compareAdRef} className="relative bg-gradient-to-br from-black to-amber-950 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
          <EditButton adId="compare" />
          <SaveButton adId="compare" />
          <div className="text-center mb-6">
            {editingAd === 'compare' ? (
              <Input
                value={compareBadge}
                onChange={(e) => setCompareBadge(e.target.value)}
                className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-black mb-3"
              />
            ) : (
              <div className="bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-black inline-block mb-3">
                {compareBadge}
              </div>
            )}
            {editingAd === 'compare' ? (
              <Input
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="text-2xl font-black text-white bg-transparent border-white text-center"
              />
            ) : (
              <h2 className="text-2xl font-black text-white">{hotelName}</h2>
            )}
            <p className="text-amber-400">
              {editingAd === 'compare' ? (
                <>
                  <Input
                    value={heroDate}
                    onChange={(e) => setHeroDate(e.target.value)}
                    className="bg-transparent border-amber-400 text-amber-400 w-40 inline-block mr-2"
                  />
                  <Input
                    value={compareSubtitle}
                    onChange={(e) => setCompareSubtitle(e.target.value)}
                    className="bg-transparent border-amber-400 text-amber-400 w-32 inline-block"
                  />
                </>
              ) : (
                `${heroDate} • ${compareSubtitle}`
              )}
            </p>
          </div>

          <div className="space-y-3">
            {packages.map((pkg, index) => (
              <div key={pkg.name} className="bg-black/40 rounded-xl p-4 flex items-center justify-between">
                <div>
                  {editingAd === 'compare' ? (
                    <Input
                      value={pkg.name}
                      onChange={(e) => updatePackageField(index, 'name', e.target.value)}
                      className="text-amber-400 font-bold bg-transparent border-amber-400"
                    />
                  ) : (
                    <h3 className="text-amber-400 font-bold">{pkg.name}</h3>
                  )}
                  {editingAd === 'compare' ? (
                    <div className="flex gap-1 flex-wrap">
                      {pkg.includes.slice(2, 5).map((item, i) => (
                        <Input
                          key={i}
                          value={item}
                          onChange={(e) => updatePackageInclude(index, i + 2, e.target.value)}
                          className="text-white/70 text-sm bg-transparent border-white/30 w-32"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/70 text-sm">{pkg.includes.slice(2, 5).join(' • ')}</p>
                  )}
                </div>
                <div className="text-right">
                  {editingAd === 'compare' ? (
                    <Input
                      type="number"
                      value={pkg.pricePerPerson}
                      onChange={(e) => updatePackageField(index, 'pricePerPerson', e.target.value)}
                      className="text-2xl font-black text-white bg-transparent border-white w-28"
                    />
                  ) : (
                    <div className="text-2xl font-black text-white">R{pkg.pricePerPerson.toLocaleString()}</div>
                  )}
                  <div className="text-amber-400 text-xs">per person</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <div className="bg-green-500 text-white py-3 rounded-full font-bold text-lg">
              📲 WhatsApp: {whatsappNumber}
            </div>
            {editingAd === 'compare' ? (
              <Input
                value={compareFooter}
                onChange={(e) => setCompareFooter(e.target.value)}
                className="text-white/60 text-sm mt-2 bg-transparent border-white/30 text-center"
              />
            ) : (
              <p className="text-white/60 text-sm mt-2">{compareFooter}</p>
            )}
          </div>
          <AdShareButtons 
            adName="Comparison Card" 
            tweetText={`${compareBadge}\n\n${hotelName}\n📅 ${heroDate} • ${compareSubtitle}\n\n${packages.map(p => `${p.name}: R${p.pricePerPerson.toLocaleString()} pp`).join('\n')}\n\n${compareFooter}\n\n📲 WhatsApp: ${whatsappNumber}\n\n#SunCity #Travel #Packages`}
            adContainerRef={compareAdRef}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-white/10 backdrop-blur rounded-xl text-white">
        <h3 className="text-xl font-bold text-amber-400 mb-4">📱 How to Use These Ads:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. <strong>Click the pencil icon</strong> on any ad to edit ALL text, prices, badges, and inclusions</li>
          <li>2. <strong>Screenshot</strong> the ad you want to use</li>
          <li>3. <strong>Square ads (1:1)</strong> - Perfect for Instagram Feed & Facebook Posts</li>
          <li>4. <strong>Story ads (9:16)</strong> - Perfect for Instagram & Facebook Stories</li>
          <li>5. <strong>Wide ads (16:9)</strong> - Perfect for Facebook Cover & Carousel</li>
          <li>6. Post with captions like: "🎉 Ring in 2026 at Sun City! Limited spots - DM or WhatsApp now! 📲"</li>
        </ol>
      </div>

      {/* Twitter Posting Section */}
      <div className="max-w-4xl mx-auto mt-8 p-6 bg-gradient-to-br from-blue-900/50 to-black/50 backdrop-blur rounded-xl text-white border border-blue-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-500 p-2 rounded-full">
            <Twitter className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-400">Post to Twitter/X</h3>
            <p className="text-white/60 text-sm">Post directly to your account</p>
          </div>
        </div>

        {/* Quick Tweet Templates */}
        <div className="space-y-3 mb-6">
          <p className="text-sm text-white/80 font-semibold">Quick Templates:</p>
          <div className="grid gap-3">
            {tweetTemplates.map((template, index) => (
              <div key={index} className="bg-black/40 rounded-lg p-4 border border-white/10">
                {editingTweet === index ? (
                  <Textarea
                    value={template.value}
                    onChange={(e) => template.setter(e.target.value)}
                    className="bg-black/60 border-blue-500/50 text-white placeholder:text-white/40 min-h-[120px] mb-3"
                    maxLength={280}
                  />
                ) : (
                  <p className="text-sm text-white/90 whitespace-pre-line mb-3">{template.value}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${template.value.length > 260 ? 'text-red-400' : 'text-white/50'}`}>
                    {template.value.length}/280 characters
                  </span>
                  <div className="flex gap-2">
                    {editingTweet === index ? (
                      <>
                        <Button
                          onClick={() => setEditingTweet(null)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm"
                          size="sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingTweet(null)}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 text-sm"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setEditingTweet(index)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 text-sm"
                        size="sm"
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    <Button
                      onClick={() => postTweet(template.value)}
                      disabled={isPosting || template.value.length > 280}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
                      size="sm"
                    >
                      {isPosting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Post This
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Tweet */}
        <div className="space-y-3">
          <p className="text-sm text-white/80 font-semibold">Or write your own:</p>
          <Textarea
            value={customTweet}
            onChange={(e) => setCustomTweet(e.target.value)}
            placeholder="Write your custom tweet..."
            className="bg-black/40 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
            maxLength={280}
          />
          <div className="flex items-center justify-between">
            <span className={`text-sm ${customTweet.length > 260 ? 'text-red-400' : 'text-white/50'}`}>
              {customTweet.length}/280 characters
            </span>
            <Button
              onClick={() => postTweet(customTweet)}
              disabled={isPosting || !customTweet.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPosting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post Tweet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialAds;
