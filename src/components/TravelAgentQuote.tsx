import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, Users, Calculator, ChevronDown, Check, Plus, Trash2, DollarSign, FileText, Building, Mail, MessageSquare, Hotel } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { calculateChildServiceFees as calculateChildServiceFeesUtil } from '@/lib/childServiceFees';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { addQuoteDataToPDF, QuoteFormData } from '@/lib/pdfQuoteUtils';
import { generateBrochurePDF, buildBrochureHTML, BrochurePageData } from '@/lib/travelAgentBrochure';
import { PDFQuoteUploader } from './PDFQuoteUploader';

interface HotelEntry {
  id: string;
  name: string;
  quoteAmount: string;
  mealPlan: string;
  starRating: string;
}

interface FamilySplit {
  id: string;
  familyName: string;
  adults: number;
  children: number;
  childrenAges: number[];
}

interface QuoteResult {
  packageName: string;
  /** Base package price per adult (display/reference) */
  packagePrice: number;
  /** Total package cost for the whole group (adults + eligible kids tiers) */
  packageTotalCost: number;
  /** Total booking/service fees for the whole group */
  serviceFeeTotal: number;
  /** Convenience value used only for display when we show per-person pricing */
  totalPerPerson: number;
  /** Total group cost for the whole group (hotel + package + fees) */
  totalGroupCost: number;
  groupSize: number;
  activitiesIncluded: string[];
  hotelBreakdown: { name: string; cost: number; costPerPerson: number }[];
  /** Convenience value used only for display when we show per-person pricing */
  serviceFee: number;
}

interface FamilyQuoteResult {
  familyName: string;
  adults: number;
  children: number;
  totalGuests: number;
  totalCost: number;
  costPerPerson: number;
}

interface CompanyDetails {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo: string; // data URL
  vatNumber: string;
  quoteValidDays: number;
  termsAndConditions: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
}

function BrochurePreview({ html }: { html: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [innerH, setInnerH] = useState(0);

  useLayoutEffect(() => {
    const recalc = () => {
      if (!wrapRef.current || !innerRef.current) return;
      const w = wrapRef.current.clientWidth;
      const s = Math.min(1, w / 794);
      setScale(s);
      setInnerH(innerRef.current.scrollHeight);
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [html]);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white" style={{ height: innerH * scale }}>
      <div
        ref={innerRef}
        style={{ width: 794, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export function TravelAgentQuote() {
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(25);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [quoteResults, setQuoteResults] = useState<QuoteResult[]>([]);
  
  // Flag to prevent useEffect from clearing data during PDF load
  const [isLoadingFromPDF, setIsLoadingFromPDF] = useState(false);
  
  // Multiple hotels support (up to 8)
  const [hotels, setHotels] = useState<HotelEntry[]>([
    { id: '1', name: '', quoteAmount: '', mealPlan: '', starRating: '' }
  ]);
  
  // Family split support
  const [enableFamilySplit, setEnableFamilySplit] = useState(false);
  const [families, setFamilies] = useState<FamilySplit[]>([]);
  const [familyQuoteResults, setFamilyQuoteResults] = useState<{ packageName: string; families: FamilyQuoteResult[] }[]>([]);

  // Accounting-compliant fields
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
    companyWebsite: '',
    companyLogo: '',
    vatNumber: '',
    quoteValidDays: 14,
    termsAndConditions: 'Quote valid for specified period. 50% deposit required to confirm booking. Balance due 14 days before travel. Prices subject to availability.',
    clientName: '',
    clientCompany: '',
    clientEmail: '',
  });

  const [quoteNumber, setQuoteNumber] = useState('');

  // Generate quote number on mount
  useEffect(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    setQuoteNumber(`TA-${timestamp}-${random}`);
  }, []);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];
  const selectedPackages = packages.filter(p => packageIds.includes(p.id));

  // Reset packages when destination changes (but not during PDF load)
  useEffect(() => {
    if (isLoadingFromPDF) {
      setIsLoadingFromPDF(false);
      return;
    }
    setPackageIds([]);
    setHasCalculated(false);
    setQuoteResults([]);
    setFamilyQuoteResults([]);
  }, [destination, isLoadingFromPDF]);

  // Auto-set checkout to day after check-in
  useEffect(() => {
    if (checkIn) {
      const checkInDate = new Date(checkIn);
      checkInDate.setDate(checkInDate.getDate() + 2);
      const formatted = checkInDate.toISOString().split('T')[0];
      if (!checkOut || new Date(checkOut) <= new Date(checkIn)) {
        setCheckOut(formatted);
      }
    }
  }, [checkIn]);

  // Update children ages array when children count changes
  useEffect(() => {
    setChildrenAges(prev => {
      if (children > prev.length) {
        return [...prev, ...Array(children - prev.length).fill(5)];
      }
      return prev.slice(0, children);
    });
  }, [children]);

  // Initialize families when family split is enabled
  useEffect(() => {
    if (enableFamilySplit && families.length === 0 && children > 0) {
      setFamilies([{ id: '1', familyName: 'Family 1', adults: 2, children: children, childrenAges: childrenAges }]);
    }
  }, [enableFamilySplit, children, childrenAges, families.length]);

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };


  // Hotel management
  const addHotel = () => {
    if (hotels.length < 8) {
      const newId = (hotels.length + 1).toString();
      setHotels([...hotels, { id: newId, name: '', quoteAmount: '', mealPlan: '' }]);
    }
  };

  const removeHotel = (id: string) => {
    if (hotels.length > 1) {
      setHotels(hotels.filter(h => h.id !== id));
    }
  };

  const updateHotel = (id: string, field: 'name' | 'quoteAmount' | 'mealPlan', value: string) => {
    setHotels(hotels.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  // Family management
  const addFamily = () => {
    const newId = (families.length + 1).toString();
    setFamilies([...families, { id: newId, familyName: `Family ${families.length + 1}`, adults: 2, children: 0, childrenAges: [] }]);
  };

  const removeFamily = (id: string) => {
    if (families.length > 1) {
      setFamilies(families.filter(f => f.id !== id));
    }
  };

  const updateFamily = (id: string, field: keyof FamilySplit, value: any) => {
    setFamilies(families.map(f => {
      if (f.id === id) {
        if (field === 'children') {
          const newChildren = parseInt(value) || 0;
          const newAges = newChildren > f.childrenAges.length 
            ? [...f.childrenAges, ...Array(newChildren - f.childrenAges.length).fill(5)]
            : f.childrenAges.slice(0, newChildren);
          return { ...f, children: newChildren, childrenAges: newAges };
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const updateFamilyChildAge = (familyId: string, childIndex: number, age: number) => {
    setFamilies(families.map(f => {
      if (f.id === familyId) {
        const newAges = [...f.childrenAges];
        newAges[childIndex] = age;
        return { ...f, childrenAges: newAges };
      }
      return f;
    }));
  };

  const updateCompanyDetails = (field: keyof CompanyDetails, value: string | number) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const totalGuests = adults + children;
  const filledHotels = hotels.filter(h => h.name.trim() && h.quoteAmount);
  const totalHotelCost = filledHotels.reduce((sum, h) => sum + (parseFloat(h.quoteAmount) || 0), 0);

  // Internal flat adult service fee — never shown to clients
  const calculateServiceFee = (): { adultFees: number; kidsFees: number; totalFees: number } => {
    const adultFees = adults * 600;
    const kidsFees = calculateChildServiceFeesUtil(adults, childrenAges);
    return { adultFees, kidsFees, totalFees: adultFees + kidsFees };
  };

  // Internal commission tracking (never shown to clients/agents)
  const calculateCommission = (): number => {
    const perAdult = adults > 20 ? 200 : 100;
    return perAdult * adults;
  };

  const handleCalculate = () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (filledHotels.length === 0) {
      toast.error('Please add at least one hotel with a quote amount');
      return;
    }

    const serviceFeeResult = calculateServiceFee();
    const totalServiceFee = serviceFeeResult.totalFees;

    const results: QuoteResult[] = selectedPackages.map(pkg => {
      const packagePricePerPerson = pkg.basePrice;
      const hotelCostPerPerson = totalHotelCost / totalGuests;
      const serviceFeePerPerson = totalGuests > 0 ? totalServiceFee / totalGuests : 0;

      // Calculate kids package cost with tiered pricing
      let kidsPackageCost = 0;
      if (children > 0 && childrenAges.length > 0) {
        childrenAges.forEach(age => {
          if (age >= 4 && age <= 16) {
            if (pkg.kidsPriceTiers && pkg.kidsPriceTiers.length > 0) {
              const tier = pkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
              if (tier) {
                kidsPackageCost += tier.price;
              } else if (pkg.kidsPrice) {
                kidsPackageCost += pkg.kidsPrice;
              }
            } else if (pkg.kidsPrice) {
              kidsPackageCost += pkg.kidsPrice;
            }
          }
        });
      }

      // Adults pay full package price; kids only pay if age-tiered pricing applies
      const adultsPackageCost = packagePricePerPerson * adults;
      const totalPackageCost = adultsPackageCost + kidsPackageCost;

      // IMPORTANT: totalGroupCost must reflect the same logic everywhere
      const totalGroupCost = totalHotelCost + totalPackageCost + totalServiceFee;
      const totalPerPerson = totalGuests > 0 ? totalGroupCost / totalGuests : 0;

      const hotelBreakdown = filledHotels.map(h => ({
        name: h.name,
        cost: parseFloat(h.quoteAmount) || 0,
        costPerPerson: (parseFloat(h.quoteAmount) || 0) / totalGuests,
      }));

      return {
        packageName: pkg.name,
        packagePrice: packagePricePerPerson,
        packageTotalCost: totalPackageCost,
        serviceFeeTotal: totalServiceFee,
        totalPerPerson,
        totalGroupCost,
        groupSize: totalGuests,
        activitiesIncluded: pkg.activitiesIncluded || [],
        hotelBreakdown,
        serviceFee: serviceFeePerPerson,
      };
    });

    setQuoteResults(results);

    // Calculate family splits if enabled
    if (enableFamilySplit && families.length > 0) {
      const familyResults = selectedPackages.map(pkg => {
        const packagePricePerPerson = pkg.basePrice;
        const serviceFeePerPerson = totalGuests > 0 ? totalServiceFee / totalGuests : 0;
        
        const familyBreakdown: FamilyQuoteResult[] = families.map(family => {
          const familySize = family.adults + family.children;
          const familyHotelCost = (totalHotelCost / totalGuests) * familySize;
          
          // Calculate kids package cost with tiered pricing for this family
          let familyKidsPackageCost = 0;
          if (family.children > 0 && family.childrenAges.length > 0) {
            family.childrenAges.forEach(age => {
              if (age >= 4 && age <= 16) {
                if (pkg.kidsPriceTiers && pkg.kidsPriceTiers.length > 0) {
                  const tier = pkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
                  if (tier) {
                    familyKidsPackageCost += tier.price;
                  } else if (pkg.kidsPrice) {
                    familyKidsPackageCost += pkg.kidsPrice;
                  }
                } else if (pkg.kidsPrice) {
                  familyKidsPackageCost += pkg.kidsPrice;
                }
              }
            });
          }
          
          const familyAdultsPackageCost = packagePricePerPerson * family.adults;
          const familyPackageCost = familyAdultsPackageCost + familyKidsPackageCost;
          const familyServiceFee = serviceFeePerPerson * familySize;
          const totalCost = familyHotelCost + familyPackageCost + familyServiceFee;

          return {
            familyName: family.familyName,
            adults: family.adults,
            children: family.children,
            totalGuests: familySize,
            totalCost,
            costPerPerson: totalCost / familySize,
          };
        });

        return {
          packageName: pkg.name,
          families: familyBreakdown,
        };
      });

      setFamilyQuoteResults(familyResults);
    }

    setHasCalculated(true);
    toast.success('Quote calculated successfully!');
  };

  const downloadQuotePDF = async (result: QuoteResult) => {
    try {
      const destinationName = destinations.find(d => d.id === destination)?.name || destination;
      const destObj = destinations.find(d => d.id === destination);
      const destRegion = (destObj as any)?.region || (destObj as any)?.province || '';
      const nights = checkIn && checkOut
        ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      const quoteDate = new Date().toISOString();
      const validUntilDate = new Date();
      validUntilDate.setDate(validUntilDate.getDate() + companyDetails.quoteValidDays);
      const validUntil = validUntilDate.toISOString();

      // Build inclusion list from result + meal plan
      const baseInclusions: string[] = [];
      baseInclusions.push(`Accommodation ${nights} Night${nights !== 1 ? 's' : ''}`);
      // Build one brochure page per hotel option
      const pages: BrochurePageData[] = filledHotels.map((hotel, idx) => {
        const hotelCost = parseFloat(hotel.quoteAmount) || 0;
        const totalGroupForHotel = hotelCost + result.packageTotalCost + result.serviceFeeTotal;

        // Per-hotel inclusions: add meal plan if set
        const inclusions: string[] = [];
        inclusions.push(`Accommodation ${nights} Night${nights !== 1 ? 's' : ''}`);
        if (hotel.mealPlan && hotel.mealPlan !== 'none') {
          const mealPlanText =
            hotel.mealPlan === 'breakfast' ? 'Breakfast' :
            hotel.mealPlan === 'lunch' ? 'Lunch' :
            hotel.mealPlan === 'dinner' ? 'Dinner' :
            hotel.mealPlan === 'half-board' ? 'Breakfast and Dinner' :
            hotel.mealPlan === 'full-board' ? 'Full Board' : '';
          if (mealPlanText) inclusions.push(mealPlanText);
        }
        (result.activitiesIncluded || []).forEach(a => inclusions.push(a));

        return {
          quoteNumber,
          quoteDate,
          validUntil,
          checkIn,
          checkOut,
          nights,
          adults,
          children,
          destinationName,
          destinationRegion: destRegion,
          hotel: {
            name: hotel.name,
            optionLabel: `Option ${idx + 1}`,
          },
          inclusions,
          totalGroupCost: roundToNearest10(totalGroupForHotel),
          totalGuests,
          agent: {
            companyName: companyDetails.companyName,
            companyAddress: companyDetails.companyAddress,
            companyPhone: companyDetails.companyPhone,
            companyEmail: companyDetails.companyEmail,
            companyWebsite: companyDetails.companyWebsite,
            companyLogo: companyDetails.companyLogo,
          },
        } satisfies BrochurePageData;
      });

      if (pages.length === 0) {
        toast.error('Add at least one hotel option with a quote amount first.');
        return;
      }

      toast.loading('Generating brochure PDF...', { id: 'pdf-gen' });
      const pdf = await generateBrochurePDF(pages);

      // Embed quote data for future editing
      const quoteData: QuoteFormData = {
        quoteType: 'travel-agent',
        destination,
        checkIn,
        checkOut,
        adults,
        children,
        childrenAges,
        packageIds,
        hotels,
        companyDetails,
        enableFamilySplit,
        families,
        quoteNumber,
      };
      addQuoteDataToPDF(pdf, quoteData);

      const fileName = `TravelAgent_Quote_${quoteNumber}_${result.packageName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (err) {
      console.error('PDF generation failed', err);
      toast.error('Could not generate PDF. Please try again.', { id: 'pdf-gen' });
    }
  };


  // Handle loading quote data from uploaded PDF
  const handleQuoteLoaded = (data: QuoteFormData) => {
    // Set flag to prevent useEffect from clearing packageIds
    setIsLoadingFromPDF(true);
    
    if (data.destination) setDestination(data.destination);
    if (data.checkIn) setCheckIn(data.checkIn);
    if (data.checkOut) setCheckOut(data.checkOut);
    if (data.adults) setAdults(data.adults);
    if (data.children !== undefined) setChildren(data.children);
    if (data.childrenAges) setChildrenAges(data.childrenAges);
    if (data.packageIds) setPackageIds(data.packageIds);
    if (data.hotels) setHotels(data.hotels.map((h: any) => ({ ...h, mealPlan: h.mealPlan || '' })));
    if (data.companyDetails) setCompanyDetails({ companyWebsite: '', companyLogo: '', ...data.companyDetails } as CompanyDetails);
    if (data.enableFamilySplit !== undefined) setEnableFamilySplit(data.enableFamilySplit);
    if (data.families) setFamilies(data.families);
    if (data.quoteNumber) setQuoteNumber(data.quoteNumber + '-EDIT');
    
    setHasCalculated(false);
    setQuoteResults([]);
    setFamilyQuoteResults([]);
  };

  const generateShareContent = (result: QuoteResult) => {
    const destinationName = destinations.find(d => d.id === destination)?.name || destination;
    const nights = checkIn && checkOut 
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;
    const hidePerPersonPrice = totalGuests <= 10 && children > 0;

    const hotelsText = filledHotels.map((hotel, idx) => {
      const hotelCost = parseFloat(hotel.quoteAmount) || 0;

      // Keep share totals aligned with the main pricing logic
      const totalGroupForHotel = hotelCost + result.packageTotalCost + result.serviceFeeTotal;
      const totalPerPersonForHotel = totalGuests > 0 ? totalGroupForHotel / totalGuests : 0;

      return `\n📍 ${hotel.name}\n${!hidePerPersonPrice ? `   Per Person: ${formatCurrency(totalPerPersonForHotel)}\n` : ''}   Total: ${formatCurrency(totalGroupForHotel)}`;
    }).join('\n');

    const inclusionsText = result.activitiesIncluded && result.activitiesIncluded.length > 0
      ? `\n\n✅ INCLUSIONS:\n• Accommodation (${nights} nights)\n${result.activitiesIncluded.map(a => `• ${a}`).join('\n')}`
      : '';

    let familyText = '';
    if (enableFamilySplit) {
      const familyResult = familyQuoteResults.find(fr => fr.packageName === result.packageName);
      if (familyResult) {
        familyText = '\n\n👨‍👩‍👧‍👦 FAMILY BREAKDOWN:' + familyResult.families.map(f => 
          `\n${f.familyName}: ${formatCurrency(f.totalCost)}`
        ).join('');
      }
    }

    return {
      subject: `Travel Quote ${quoteNumber} - ${result.packageName} - ${destinationName}`,
      body: `*TRAVEL AGENT QUOTATION*\nRef: ${quoteNumber}\n\n*${result.packageName}*\n\nDestination: ${destinationName}\nDates: ${checkIn} - ${checkOut} (${nights} nights)\nGuests: ${result.groupSize}${inclusionsText}\n\n🏨 ACCOMMODATION OPTIONS:${hotelsText}${familyText}`
    };
  };

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  const destinationName = destinations.find(d => d.id === destination)?.name || destination;

  return (
    <section id="travel-agent" className="py-16 bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <PDFQuoteUploader 
            onQuoteLoaded={handleQuoteLoaded} 
            expectedQuoteType="travel-agent" 
          />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-800 mb-4">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm font-semibold">For Travel Agents</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Add Our Curated Activity Packages to Your Client Quotes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create comprehensive quotes for your clients with multiple hotel options. Perfect for comparing rates and offering flexible packages.
          </p>
        </div>

        {/* Quote Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="space-y-5">
              {/* Row 1: Destination, Check In, Check Out */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Destination *</Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-11 bg-white border-gray-200">
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">South Africa</div>
                      {destinations.filter(d => !d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">International</div>
                      {destinations.filter(d => d.international).map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}, {d.country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check In *</Label>
                  <Input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    min={today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Check Out *</Label>
                  <Input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    min={checkIn || today}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Hotels Section (Multiple) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Hotels *</Label>
                    <p className="text-xs text-muted-foreground">Add up to 8 hotels to compare in your quote</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {hotels.length}/8 hotels
                  </span>
                </div>
                
                <div className="space-y-3">
                  {hotels.map((hotel, index) => (
                    <div key={hotel.id} className="p-3 bg-gray-50 rounded-lg border space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            type="text"
                            value={hotel.name}
                            onChange={e => updateHotel(hotel.id, 'name', e.target.value)}
                            placeholder="Hotel name"
                            className="h-10 bg-white border-gray-200"
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">R</span>
                            <Input
                              type="number"
                              value={hotel.quoteAmount}
                              onChange={e => updateHotel(hotel.id, 'quoteAmount', e.target.value)}
                              placeholder="Quote amount"
                              min={0}
                              className="h-10 bg-white border-gray-200"
                            />
                          </div>
                        </div>
                        {hotels.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHotel(hotel.id)}
                            className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="ml-11">
                        <Select value={hotel.mealPlan} onValueChange={(value) => updateHotel(hotel.id, 'mealPlan', value)}>
                          <SelectTrigger className="h-10 bg-white border-gray-200 w-full md:w-64">
                            <SelectValue placeholder="Select meal plan (optional)" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="none">No meals included</SelectItem>
                            <SelectItem value="breakfast">Breakfast only</SelectItem>
                            <SelectItem value="lunch">Lunch only</SelectItem>
                            <SelectItem value="dinner">Dinner only</SelectItem>
                            <SelectItem value="half-board">Half Board (Breakfast & Dinner)</SelectItem>
                            <SelectItem value="full-board">Full Board (All Meals)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>

                {hotels.length < 8 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addHotel}
                    className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Hotel
                  </Button>
                )}
              </div>


              {/* Package Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Activity Package/s *</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Choose one or more activity packages to include in your client quote
                </p>
                <Popover open={isPackageDropdownOpen} onOpenChange={setIsPackageDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!destination}
                      className="w-full h-11 justify-between bg-white border-gray-200 text-left font-normal"
                    >
                      <span className="truncate">
                        {packageIds.length === 0 
                          ? (destination ? 'Select packages...' : 'Select destination first')
                          : `${packageIds.length} package${packageIds.length > 1 ? 's' : ''} selected`}
                      </span>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full min-w-[300px] p-2 bg-white" align="start">
                    <div className="space-y-1 max-h-[300px] overflow-y-auto">
                      {availablePackages.map(pkg => (
                        <div
                          key={pkg.id}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                            packageIds.includes(pkg.id) ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => togglePackageSelection(pkg.id)}
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                            packageIds.includes(pkg.id) ? 'bg-primary border-primary' : 'border-gray-300'
                          }`}>
                            {packageIds.includes(pkg.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.duration} • From R{pkg.basePrice}/person</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Group Size */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Adults *</Label>
                  <Input
                    type="number"
                    value={adults === 0 ? '' : adults}
                    onChange={e => setAdults(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    min={1}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Children</Label>
                  <Input
                    type="number"
                    value={children === 0 ? '' : children}
                    onChange={e => setChildren(e.target.value === '' ? 0 : parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label className="text-sm font-medium text-gray-700">Total Guests</Label>
                  <div className="h-11 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 text-gray-700 font-medium">
                    {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Child Age Selection */}
              {children > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Child Ages (0-17 years)</Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: children }, (_, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Child {i + 1}:</span>
                        <Select 
                          value={childrenAges[i]?.toString() || '5'} 
                          onValueChange={v => {
                            const newAges = [...childrenAges];
                            newAges[i] = parseInt(v);
                            setChildrenAges(newAges);
                          }}
                        >
                          <SelectTrigger className="h-9 w-20 bg-white border-gray-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] bg-white">
                            {Array.from({ length: 18 }, (_, age) => age).map(age => (
                              <SelectItem key={age} value={age.toString()}>{age} yrs</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Family Split Option - only show when there are children */}
              {children > 0 && (
                <div className="border-t pt-5 mt-5">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox 
                      id="family-split" 
                      checked={enableFamilySplit}
                      onCheckedChange={(checked) => setEnableFamilySplit(checked as boolean)}
                    />
                    <Label htmlFor="family-split" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Split quote by families (for different payment responsibilities)
                    </Label>
                  </div>

                  {enableFamilySplit && (
                    <div className="space-y-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs text-purple-700">
                        Define how the group should be split for billing purposes
                      </p>
                      
                      {families.map((family, index) => (
                        <div key={family.id} className="bg-white rounded-lg p-4 border border-purple-200">
                          <div className="flex items-center justify-between mb-3">
                            <Input
                              type="text"
                              value={family.familyName}
                              onChange={e => updateFamily(family.id, 'familyName', e.target.value)}
                              className="h-9 w-48 bg-white border-gray-200 font-medium"
                              placeholder="Family name"
                            />
                            {families.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFamily(family.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">Adults</Label>
                              <Input
                                type="number"
                                value={family.adults}
                                onChange={e => updateFamily(family.id, 'adults', parseInt(e.target.value) || 0)}
                                min={1}
                                className="h-9 bg-white border-gray-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">Children</Label>
                              <Input
                                type="number"
                                value={family.children}
                                onChange={e => updateFamily(family.id, 'children', e.target.value)}
                                min={0}
                                className="h-9 bg-white border-gray-200"
                              />
                            </div>
                          </div>

                          {family.children > 0 && (
                            <div className="mt-3">
                              <Label className="text-xs text-gray-600">Child Ages</Label>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Array.from({ length: family.children }, (_, i) => (
                                  <Select 
                                    key={i}
                                    value={family.childrenAges[i]?.toString() || '5'} 
                                    onValueChange={v => updateFamilyChildAge(family.id, i, parseInt(v))}
                                  >
                                    <SelectTrigger className="h-8 w-16 bg-white border-gray-200 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] bg-white">
                                      {Array.from({ length: 18 }, (_, age) => age).map(age => (
                                        <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addFamily}
                        className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        <Plus className="w-4 h-4" />
                        Add Another Family
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Service Fee Info */}

              {/* Accounting Compliant Fields */}
              <div className="border-t pt-5 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <Label className="text-base font-semibold text-gray-800">Quotation Document Details</Label>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Complete these fields for an accounting-compliant quotation document
                </p>

                {/* Company Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your Agency Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Agency Name</Label>
                      <Input
                        type="text"
                        value={companyDetails.companyName}
                        onChange={e => updateCompanyDetails('companyName', e.target.value)}
                        placeholder="Your Travel Agency Name"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">VAT Number</Label>
                      <Input
                        type="text"
                        value={companyDetails.vatNumber}
                        onChange={e => updateCompanyDetails('vatNumber', e.target.value)}
                        placeholder="e.g. 4123456789"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Agency Address</Label>
                    <Input
                      type="text"
                      value={companyDetails.companyAddress}
                      onChange={e => updateCompanyDetails('companyAddress', e.target.value)}
                      placeholder="Street Address, City, Postal Code"
                      className="h-10 bg-white border-gray-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Phone Number</Label>
                      <Input
                        type="tel"
                        value={companyDetails.companyPhone}
                        onChange={e => updateCompanyDetails('companyPhone', e.target.value)}
                        placeholder="e.g. +27 21 123 4567"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Email Address</Label>
                      <Input
                        type="email"
                        value={companyDetails.companyEmail}
                        onChange={e => updateCompanyDetails('companyEmail', e.target.value)}
                        placeholder="bookings@youragency.com"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Website</Label>
                      <Input
                        type="text"
                        value={companyDetails.companyWebsite}
                        onChange={e => updateCompanyDetails('companyWebsite', e.target.value)}
                        placeholder="www.youragency.com"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Agency Logo (shown on PDF)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => updateCompanyDetails('companyLogo', String(reader.result || ''));
                            reader.readAsDataURL(file);
                          }}
                          className="h-10 bg-white border-gray-200"
                        />
                        {companyDetails.companyLogo && (
                          <button
                            type="button"
                            onClick={() => updateCompanyDetails('companyLogo', '')}
                            className="text-xs text-red-600 hover:underline"
                          >Remove</button>
                        )}
                      </div>
                      {companyDetails.companyLogo && (
                        <img src={companyDetails.companyLogo} alt="Logo preview" className="h-10 mt-1 object-contain bg-white border rounded p-1" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Client Details</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Client Name</Label>
                      <Input
                        type="text"
                        value={companyDetails.clientName}
                        onChange={e => updateCompanyDetails('clientName', e.target.value)}
                        placeholder="Contact Person Name"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Client Company</Label>
                      <Input
                        type="text"
                        value={companyDetails.clientCompany}
                        onChange={e => updateCompanyDetails('clientCompany', e.target.value)}
                        placeholder="Client Company Name"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Client Email</Label>
                    <Input
                      type="email"
                      value={companyDetails.clientEmail}
                      onChange={e => updateCompanyDetails('clientEmail', e.target.value)}
                      placeholder="client@company.com"
                      className="h-10 bg-white border-gray-200"
                    />
                  </div>
                </div>

                {/* Quote Validity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Quote Valid For (Days)</Label>
                    <Select 
                      value={companyDetails.quoteValidDays.toString()} 
                      onValueChange={v => updateCompanyDetails('quoteValidDays', parseInt(v))}
                    >
                      <SelectTrigger className="h-10 bg-white border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                        <SelectItem value="21">21 Days</SelectItem>
                        <SelectItem value="30">30 Days</SelectItem>
                        <SelectItem value="60">60 Days</SelectItem>
                        <SelectItem value="90">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Quote Reference Number</Label>
                    <div className="h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 text-gray-700 font-mono text-sm">
                      {quoteNumber}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={handleCalculate}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Client Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Quote Results */}
        {hasCalculated && quoteResults.length > 0 && (
          <div className="max-w-6xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Client Quote Results
            </h3>
            <div className="grid gap-8">
              {quoteResults.map((result, index) => {
                const familyResult = familyQuoteResults.find(fr => fr.packageName === result.packageName);
                const shareContent = generateShareContent(result);
                const destObj = destinations.find(d => d.id === destination);
                const destRegion = (destObj as any)?.region || (destObj as any)?.province || '';
                const quoteDate = new Date().toISOString();
                const validUntilDate = new Date();
                validUntilDate.setDate(validUntilDate.getDate() + companyDetails.quoteValidDays);
                const validUntil = validUntilDate.toISOString();

                const pages: BrochurePageData[] = filledHotels.map((hotel, idx) => {
                  const hotelCost = parseFloat(hotel.quoteAmount) || 0;
                  const totalGroupForHotel = hotelCost + result.packageTotalCost + result.serviceFeeTotal;
                  const inclusions: string[] = [];
                  inclusions.push(`Accommodation ${nights} Night${nights !== 1 ? 's' : ''}`);
                  if (hotel.mealPlan && hotel.mealPlan !== 'none') {
                    const mealPlanText =
                      hotel.mealPlan === 'breakfast' ? 'Breakfast' :
                      hotel.mealPlan === 'lunch' ? 'Lunch' :
                      hotel.mealPlan === 'dinner' ? 'Dinner' :
                      hotel.mealPlan === 'half-board' ? 'Breakfast and Dinner' :
                      hotel.mealPlan === 'full-board' ? 'Full Board' : '';
                    if (mealPlanText) inclusions.push(mealPlanText);
                  }
                  (result.activitiesIncluded || []).forEach(a => inclusions.push(a));

                  return {
                    quoteNumber,
                    quoteDate,
                    validUntil,
                    checkIn,
                    checkOut,
                    nights,
                    adults,
                    children,
                    destinationName,
                    destinationRegion: destRegion,
                    hotel: { name: hotel.name, optionLabel: `Option ${idx + 1}` },
                    inclusions,
                    totalGroupCost: roundToNearest10(totalGroupForHotel),
                    totalGuests,
                    agent: {
                      companyName: companyDetails.companyName,
                      companyAddress: companyDetails.companyAddress,
                      companyPhone: companyDetails.companyPhone,
                      companyEmail: companyDetails.companyEmail,
                      companyWebsite: companyDetails.companyWebsite,
                      companyLogo: companyDetails.companyLogo,
                    },
                  } satisfies BrochurePageData;
                });

                return (
                  <Card key={index} className="overflow-hidden border-purple-200">
                    <CardContent className="p-4 md:p-6">
                      {/* Quote Header */}
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{result.packageName}</h4>
                          <p className="text-sm text-gray-600">
                            {destinationName} • {nights} Night{nights !== 1 ? 's' : ''} • {result.groupSize} Guests
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Quote Ref:</p>
                          <p className="text-sm font-mono font-medium text-gray-700">{quoteNumber}</p>
                        </div>
                      </div>

                      {/* Brochure previews — one per hotel option */}
                      <div className="grid gap-6">
                        {pages.map((p, i) => (
                          <BrochurePreview key={i} html={buildBrochureHTML(p)} />
                        ))}
                      </div>

                      {/* Family Breakdown */}
                      {familyResult && familyResult.families.length > 0 && (
                        <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100 mt-6">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Family Breakdown:</p>
                          <div className="space-y-2">
                            {familyResult.families.map((family, i) => (
                              <div key={i} className="flex items-center justify-between bg-white rounded-lg p-2 border">
                                <div>
                                  <span className="font-medium text-gray-800">{family.familyName}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    ({family.adults}A{family.children > 0 ? ` + ${family.children}C` : ''})
                                  </span>
                                </div>
                                <span className="font-bold text-amber-600">{formatCurrency(family.totalCost)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-6 justify-end">
                        <Button
                          onClick={() => downloadQuotePDF(result)}
                          className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Download PDF Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open(`https://wa.me/?text=${encodeURIComponent(shareContent.body)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Share via WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            window.open(`mailto:?subject=${encodeURIComponent(shareContent.subject)}&body=${encodeURIComponent(shareContent.body)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Share via Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
