import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, Users, Calculator, ChevronDown, Check, Search, Plus, Trash2, Building2, DollarSign, Star, Wifi, Car, Coffee, Dumbbell, UtensilsCrossed, Waves, SpadeIcon, FileText, Calendar, Building } from 'lucide-react';
import { 
  destinations, 
  packages, 
  getPackagesByDestination,
  type Package
} from '@/data/travelData';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';
import { addBookingDisclaimerToPDF, addQuoteDataToPDF, QuoteFormData } from '@/lib/pdfQuoteUtils';
import { PDFQuoteUploader } from './PDFQuoteUploader';

interface RoomCategory {
  id: string;
  name: string;
  count: number;
}

interface QuoteResult {
  packageName: string;
  packagePrice: number;
  hotelCost: number;
  serviceFee: number;
  totalPerPerson: number;
  totalGroupCost: number;
  groupSize: number;
  activitiesIncluded: string[];
}

// Accounting-compliant document fields
interface CompanyDetails {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  vatNumber: string;
  quoteValidDays: number;
  termsAndConditions: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
}

export function AccommodationProviderQuote() {
  const [destination, setDestination] = useState('');
  const [packageIds, setPackageIds] = useState<string[]>([]);
  const [isPackageDropdownOpen, setIsPackageDropdownOpen] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(25);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState<number[]>([]);
  const [hotelQuoteAmount, setHotelQuoteAmount] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([
    { id: '1', name: '', count: 1 }
  ]);
  const [facilities, setFacilities] = useState<string[]>(['', '', '', '', '']);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [quoteResults, setQuoteResults] = useState<QuoteResult[]>([]);

  // Accounting-compliant fields
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    companyEmail: '',
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
    setQuoteNumber(`QT-${timestamp}-${random}`);
  }, []);

  const availablePackages = destination ? getPackagesByDestination(destination) : [];
  const selectedPackages = packages.filter(p => packageIds.includes(p.id));

  // Reset packages when destination changes
  useEffect(() => {
    setPackageIds([]);
    setHasCalculated(false);
    setQuoteResults([]);
  }, [destination]);

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

  const togglePackageSelection = (pkgId: string) => {
    setPackageIds(prev => 
      prev.includes(pkgId) 
        ? prev.filter(id => id !== pkgId)
        : [...prev, pkgId]
    );
  };


  const addRoomCategory = () => {
    const newId = (roomCategories.length + 1).toString();
    setRoomCategories([...roomCategories, { id: newId, name: '', count: 1 }]);
  };

  const removeRoomCategory = (id: string) => {
    if (roomCategories.length > 1) {
      setRoomCategories(roomCategories.filter(r => r.id !== id));
    }
  };

  const updateRoomCategory = (id: string, field: 'name' | 'count', value: string | number) => {
    setRoomCategories(roomCategories.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const updateFacility = (index: number, value: string) => {
    const newFacilities = [...facilities];
    newFacilities[index] = value;
    setFacilities(newFacilities);
  };

  const updateCompanyDetails = (field: keyof CompanyDetails, value: string | number) => {
    setCompanyDetails(prev => ({ ...prev, [field]: value }));
  };

  const totalRooms = roomCategories.reduce((sum, r) => sum + r.count, 0);
  const totalGuests = adults + children;

  // Calculate service fee using tiered structure
  const calculateServiceFee = (): { adultFees: number; kidsFees: number; totalFees: number } => {
    const totalPeople = adults + childrenAges.length;
    
    // Groups of 25+ use flat rate
    if (totalPeople >= 25) {
      const adultFees = adults * 400;
      let kidsFees = 0;
      const kidFeePerChild = adults >= 2 ? 150 : 300;
      childrenAges.forEach((age) => {
        if (age >= 4 && age <= 16) kidsFees += kidFeePerChild;
      });
      return { adultFees, kidsFees, totalFees: adultFees + kidsFees };
    }

    // Tiered structure for groups 1-24
    let adultFeePerPerson = 0;
    if (adults === 1) adultFeePerPerson = 1000;
    else if (adults >= 2 && adults <= 3) adultFeePerPerson = 850;
    else if (adults >= 4 && adults <= 9) adultFeePerPerson = 800;
    else if (adults >= 10) adultFeePerPerson = 750;
    
    const adultFees = adults * adultFeePerPerson;
    
    let kidsFees = 0;
    const kidFeePerChild = adults >= 2 ? 150 : 300;
    childrenAges.forEach((age) => {
      if (age >= 0 && age <= 3) kidsFees += 0; // Free for under 4
      else if (age >= 4 && age <= 16) kidsFees += kidFeePerChild;
    });

    return {
      adultFees,
      kidsFees,
      totalFees: adultFees + kidsFees,
    };
  };

  const handleCalculate = () => {
    if (!destination || packageIds.length === 0 || !checkIn || !checkOut || !hotelQuoteAmount) {
      toast.error('Please fill in all required fields including hotel quote amount');
      return;
    }

    const hotelAmount = parseFloat(hotelQuoteAmount) || 0;
    const serviceFeeResult = calculateServiceFee();
    const totalServiceFee = serviceFeeResult.totalFees;
    
    const results: QuoteResult[] = selectedPackages.map(pkg => {
      const packagePricePerPerson = pkg.basePrice;
      const hotelCostPerPerson = hotelAmount / totalGuests;
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
      
      // Calculate total: adults pay full package price, kids pay tiered price
      const adultsPackageCost = packagePricePerPerson * adults;
      const totalPackageCost = adultsPackageCost + kidsPackageCost;
      const totalGroupCost = hotelAmount + totalPackageCost + totalServiceFee;
      const totalPerPerson = totalGroupCost / totalGuests;

      return {
        packageName: pkg.name,
        packagePrice: packagePricePerPerson,
        hotelCost: hotelCostPerPerson,
        serviceFee: serviceFeePerPerson,
        totalPerPerson,
        totalGroupCost,
        groupSize: totalGuests,
        activitiesIncluded: pkg.activitiesIncluded || [],
      };
    });

    setQuoteResults(results);
    setHasCalculated(true);
    toast.success('Quote calculated successfully!');
  };

  const downloadQuotePDF = (result: QuoteResult) => {
    const doc = new jsPDF();
    const destinationName = destinations.find(d => d.id === destination)?.name || destination;
    const nights = checkIn && checkOut 
      ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
      : 0;
    const quoteDate = new Date().toLocaleDateString('en-ZA');
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + companyDetails.quoteValidDays);
    const validUntilStr = validUntil.toLocaleDateString('en-ZA');
    const totalServiceFee = calculateServiceFee().totalFees;

    // Determine if we should hide per person pricing
    // Hide per person price if: group is 10 or less AND there are children
    const hidePerPersonPrice = totalGuests <= 10 && children > 0;

    // Header with company branding
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('QUOTATION', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Quote #: ${quoteNumber}`, 20, 30);
    doc.text(`Date: ${quoteDate}`, 20, 37);
    doc.text(`Valid Until: ${validUntilStr}`, 120, 30);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    let yPos = 55;

    // Company Details (From)
    if (companyDetails.companyName) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('FROM:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 6;
      doc.text(companyDetails.companyName, 20, yPos);
      if (companyDetails.companyAddress) { yPos += 5; doc.text(companyDetails.companyAddress, 20, yPos); }
      if (companyDetails.companyPhone) { yPos += 5; doc.text(`Tel: ${companyDetails.companyPhone}`, 20, yPos); }
      if (companyDetails.companyEmail) { yPos += 5; doc.text(`Email: ${companyDetails.companyEmail}`, 20, yPos); }
      if (companyDetails.vatNumber) { yPos += 5; doc.text(`VAT No: ${companyDetails.vatNumber}`, 20, yPos); }
      yPos += 10;
    }

    // Client Details (To)
    if (companyDetails.clientName || companyDetails.clientCompany) {
      doc.setFont('helvetica', 'bold');
      doc.text('TO:', 120, 55);
      doc.setFont('helvetica', 'normal');
      let clientY = 61;
      if (companyDetails.clientName) { doc.text(companyDetails.clientName, 120, clientY); clientY += 5; }
      if (companyDetails.clientCompany) { doc.text(companyDetails.clientCompany, 120, clientY); clientY += 5; }
      if (companyDetails.clientEmail) { doc.text(companyDetails.clientEmail, 120, clientY); }
    }

    yPos = Math.max(yPos, 85);

    // Accommodation Details
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, 180, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ACCOMMODATION DETAILS', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Always show hotel name prominently
    doc.setFont('helvetica', 'bold');
    doc.text(`Hotel: ${hotelName || 'Not specified'}`, 20, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 6;
    
    doc.text(`Destination: ${destinationName}`, 20, yPos);
    yPos += 6;
    doc.text(`Check-in: ${checkIn}  |  Check-out: ${checkOut}  |  ${nights} Night${nights !== 1 ? 's' : ''}`, 20, yPos);
    yPos += 6;
    doc.text(`Group Size: ${adults} Adults${children > 0 ? `, ${children} Children` : ''} (${totalGuests} Total)`, 20, yPos);
    yPos += 10;

    // Room Categories
    const filledRooms = roomCategories.filter(r => r.name.trim());
    if (filledRooms.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Room Categories:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      filledRooms.forEach(room => {
        doc.text(`• ${room.name}: ${room.count} room${room.count !== 1 ? 's' : ''}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }

    // Facilities
    const filledFacilities = facilities.filter(f => f.trim());
    if (filledFacilities.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Hotel Facilities:', 20, yPos);
      yPos += 6;
      doc.setFont('helvetica', 'normal');
      filledFacilities.forEach(facility => {
        doc.text(`• ${facility}`, 25, yPos);
        yPos += 5;
      });
      yPos += 5;
    }

    // Package Inclusions with descriptions (no pricing breakdown)
    yPos += 3;
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, 180, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PACKAGE INCLUSIONS', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Accommodation line item with nights
    doc.setTextColor(34, 139, 34);
    doc.text(`✓   Accommodation - ${nights} Night${nights !== 1 ? 's' : ''} at ${hotelName || destinationName}`, 25, yPos);
    yPos += 6;
    
    // Activity Package line item with description
    doc.text(`✓   ${result.packageName} - ${nights} Night${nights !== 1 ? 's' : ''} Experience`, 25, yPos);
    yPos += 6;
    
    // Show each activity as a line item
    if (result.activitiesIncluded && result.activitiesIncluded.length > 0) {
      result.activitiesIncluded.forEach(activity => {
        if (yPos < 220) {
          // Wrap long activity descriptions to fit the space
          const maxWidth = 160;
          const activityText = `     • ${activity}`;
          const splitActivity = doc.splitTextToSize(activityText, maxWidth);
          splitActivity.forEach((line: string) => {
            if (yPos < 220) {
              doc.text(line, 25, yPos);
              yPos += 5;
            }
          });
        }
      });
    }

    // Service fee line item if applicable
    if (totalGuests >= 25) {
      doc.text('✓   Booking & Coordination Service', 25, yPos);
      yPos += 6;
    }

    doc.setTextColor(0, 0, 0);
    yPos += 8;

    // Pricing Summary (no breakdown, just totals)
    doc.setFillColor(240, 240, 240);
    doc.rect(15, yPos - 5, 180, 8, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRICING SUMMARY', 20, yPos);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Group details
    doc.text(`Group Size: ${adults} Adults${children > 0 ? ` + ${children} Children` : ''} (${totalGuests} guests)`, 25, yPos);
    yPos += 6;
    doc.text(`Duration: ${nights} Night${nights !== 1 ? 's' : ''}`, 25, yPos);
    yPos += 10;

    doc.line(20, yPos, 190, yPos);
    yPos += 8;

    // Show per person price only if group > 10 OR if adults only (no children)
    if (!hidePerPersonPrice) {
      doc.setFont('helvetica', 'bold');
      doc.text('PRICE PER PERSON', 25, yPos);
      doc.text(formatCurrency(result.totalPerPerson), 160, yPos);
      yPos += 8;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL GROUP COST', 25, yPos);
    doc.text(formatCurrency(result.totalGroupCost), 160, yPos);
    yPos += 12;

    // VAT Note
    if (companyDetails.vatNumber) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('* All prices include VAT where applicable', 20, yPos);
      yPos += 8;
    }


    // Terms & Conditions
    if (companyDetails.termsAndConditions) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Terms & Conditions:', 20, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      const splitTerms = doc.splitTextToSize(companyDetails.termsAndConditions, 170);
      doc.text(splitTerms, 20, yPos);
      yPos += splitTerms.length * 4 + 5;
    }

    // Add booking disclaimer
    addBookingDisclaimerToPDF(doc, yPos);

    // Embed quote data for future editing
    const quoteData: QuoteFormData = {
      quoteType: 'accommodation-provider',
      destination,
      checkIn,
      checkOut,
      adults,
      children,
      childrenAges,
      packageIds,
      hotelName,
      hotelQuoteAmount,
      roomCategories,
      facilities,
      companyDetails,
      quoteNumber,
    };
    addQuoteDataToPDF(doc, quoteData);

    const fileName = `Quote_${quoteNumber}_${result.packageName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('PDF downloaded successfully!');
  };

  // Handle loading quote data from uploaded PDF
  const handleQuoteLoaded = (data: QuoteFormData) => {
    if (data.destination) setDestination(data.destination);
    if (data.checkIn) setCheckIn(data.checkIn);
    if (data.checkOut) setCheckOut(data.checkOut);
    if (data.adults) setAdults(data.adults);
    if (data.children !== undefined) setChildren(data.children);
    if (data.childrenAges) setChildrenAges(data.childrenAges);
    if (data.packageIds) setPackageIds(data.packageIds);
    if (data.hotelName) setHotelName(data.hotelName);
    if (data.hotelQuoteAmount) setHotelQuoteAmount(data.hotelQuoteAmount);
    if (data.roomCategories) setRoomCategories(data.roomCategories);
    if (data.facilities) setFacilities(data.facilities);
    if (data.companyDetails) setCompanyDetails(data.companyDetails);
    if (data.quoteNumber) setQuoteNumber(data.quoteNumber + '-EDIT');
    
    setHasCalculated(false);
    setQuoteResults([]);
  };

  const today = new Date().toISOString().split('T')[0];
  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  const destinationName = destinations.find(d => d.id === destination)?.name || destination;

  return (
    <section id="hotel-provider" className="py-16 bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 mb-4">
            <Hotel className="w-4 h-4" />
            <span className="text-sm font-semibold">For Hotels & Accommodation Providers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Add Our Curated Activity Packages to Your Guest Quotation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance your hotel quotes by including our exciting activity packages. Perfect for group bookings and corporate events.
          </p>
        </div>

        {/* Quote Form */}
        <div className="max-w-4xl mx-auto">
          {/* PDF Upload Section */}
          <PDFQuoteUploader 
            onQuoteLoaded={handleQuoteLoaded} 
            expectedQuoteType="accommodation-provider" 
          />
          
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

              {/* Hotel Name & Quote Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Hotel Name (Optional)</Label>
                  <Input
                    type="text"
                    value={hotelName}
                    onChange={e => setHotelName(e.target.value)}
                    placeholder="e.g. Grand Hotel Resort"
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Total Hotel Quote Amount (R) *
                  </Label>
                  <Input
                    type="number"
                    value={hotelQuoteAmount}
                    onChange={e => setHotelQuoteAmount(e.target.value)}
                    placeholder="Total accommodation cost"
                    min={0}
                    className="h-11 bg-white border-gray-200"
                  />
                </div>
              </div>

              {/* Room Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Room Categories</Label>
                <p className="text-xs text-muted-foreground">
                  Add room types and quantities for your quote
                </p>
                <div className="space-y-2">
                  {roomCategories.map((room, index) => (
                    <div key={room.id} className="flex items-center gap-3">
                      <Input
                        type="text"
                        value={room.name}
                        onChange={e => updateRoomCategory(room.id, 'name', e.target.value)}
                        placeholder="e.g. Deluxe Double Room"
                        className="flex-1 h-10 bg-white border-gray-200"
                      />
                      <Select 
                        value={room.count.toString()} 
                        onValueChange={v => updateRoomCategory(room.id, 'count', parseInt(v))}
                      >
                        <SelectTrigger className="w-24 h-10 bg-white border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px] bg-white">
                          {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {roomCategories.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoomCategory(room.id)}
                          className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRoomCategory}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Room Category
                </Button>
              </div>

              {/* Hotel Facilities */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Hotel Facilities & Amenities</Label>
                <p className="text-xs text-muted-foreground">
                  Add up to 5 key facilities to highlight in the quote
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {facilities.map((facility, index) => (
                    <Input
                      key={index}
                      type="text"
                      value={facility}
                      onChange={e => updateFacility(index, e.target.value)}
                      placeholder={`Facility ${index + 1}`}
                      className="h-10 bg-white border-gray-200"
                    />
                  ))}
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Select Activity Package/s *</Label>
                <p className="text-xs text-muted-foreground mb-1">
                  Choose one or more activity packages to include in your guest quote
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

              {/* Row 3: Group Size */}
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
                  <Label className="text-sm font-medium text-gray-700">Total Rooms</Label>
                  <div className="h-11 bg-gray-50 border border-gray-200 rounded-md flex items-center px-3 text-gray-700 font-medium">
                    {totalRooms} room{totalRooms !== 1 ? 's' : ''}
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

              {/* Service Fee Info */}

              {/* Accounting Compliant Fields */}
              <div className="border-t pt-5 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <Label className="text-base font-semibold text-gray-800">Quotation Document Details</Label>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Complete these fields for an accounting-compliant quotation document
                </p>

                {/* Company Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your Company Details (Supplier)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-600">Company Name</Label>
                      <Input
                        type="text"
                        value={companyDetails.companyName}
                        onChange={e => updateCompanyDetails('companyName', e.target.value)}
                        placeholder="Your Hotel / Company Name"
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
                    <Label className="text-sm text-gray-600">Company Address</Label>
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
                        placeholder="bookings@yourhotel.com"
                        className="h-10 bg-white border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Client Details (Recipient)</span>
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
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                <Calculator className="w-5 h-5" />
                Calculate Guest Quote
              </Button>
            </div>
          </div>
        </div>

        {/* Quote Results */}
        {hasCalculated && quoteResults.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Guest Quote Results
            </h3>
            <div className="grid gap-6">
              {quoteResults.map((result, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    {/* Quote Header with Reference */}
                    <div className="flex justify-between items-start mb-4">
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

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                      {/* Quote Details */}
                      <div className="flex-1 space-y-4">
                        {/* Room Categories Summary */}
                        {roomCategories.some(r => r.name.trim()) && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Rooms: </span>
                            {roomCategories.filter(r => r.name.trim()).map(r => `${r.name} (${r.count})`).join(', ')}
                          </div>
                        )}

                        {/* Facilities */}
                        {facilities.some(f => f.trim()) && (
                          <div className="flex flex-wrap gap-2">
                            {facilities.filter(f => f.trim()).map((facility, i) => (
                              <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                                <Star className="w-3 h-3" />
                                {facility}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Package Inclusions - matching custom hotel quote style */}
                        <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                          <p className="text-sm font-semibold text-gray-700 mb-3">Package Inclusions:</p>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2 text-green-600 text-sm">
                              <Check className="w-4 h-4 shrink-0" />
                              <span>Accommodation</span>
                            </p>
                            {result.activitiesIncluded && result.activitiesIncluded.map((activity, i) => (
                              <p key={i} className="flex items-center gap-2 text-green-600 text-sm">
                                <Check className="w-4 h-4 shrink-0" />
                                <span>{activity}</span>
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Accommodation (per person)</span>
                            <span className="font-medium">{formatCurrency(result.hotelCost)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Activity Package (per person)</span>
                            <span className="font-medium">{formatCurrency(result.packagePrice)}</span>
                          </div>
                          {result.serviceFee > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Service Fee (per person)</span>
                              <span className="font-medium">{formatCurrency(result.serviceFee)}</span>
                            </div>
                          )}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between text-base font-bold">
                              <span>Total Per Person</span>
                              <span className="text-emerald-600">{formatCurrency(result.totalPerPerson)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-1">
                              <span>Total Group Cost</span>
                              <span className="text-emerald-600">{formatCurrency(result.totalGroupCost)}</span>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <Button
                          onClick={() => downloadQuotePDF(result)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          Download PDF Quote
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const inclusionsText = result.activitiesIncluded && result.activitiesIncluded.length > 0
                              ? `\n\n✅ INCLUSIONS:\n• Accommodation\n${result.activitiesIncluded.map(a => `• ${a}`).join('\n')}`
                              : '';
                            const message = `*QUOTATION*\nRef: ${quoteNumber}\n\n*${result.packageName}*\n\nDestination: ${destinationName}\nDates: ${checkIn} - ${checkOut}\nGuests: ${result.groupSize}${inclusionsText}\n\n💰 PRICING:\nTotal Per Person: ${formatCurrency(result.totalPerPerson)}\nTotal Group Cost: ${formatCurrency(result.totalGroupCost)}`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          Share via WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const inclusionsText = result.activitiesIncluded && result.activitiesIncluded.length > 0
                              ? `\n\nINCLUSIONS:\n• Accommodation\n${result.activitiesIncluded.map(a => `• ${a}`).join('\n')}`
                              : '';
                            const subject = `Quotation ${quoteNumber} - ${result.packageName} - ${destinationName}`;
                            const body = `QUOTATION\nReference: ${quoteNumber}\n\n${result.packageName}\n\nDestination: ${destinationName}\nDates: ${checkIn} - ${checkOut}\nGuests: ${result.groupSize}${inclusionsText}\n\nPRICING:\nTotal Per Person: ${formatCurrency(result.totalPerPerson)}\nTotal Group Cost: ${formatCurrency(result.totalGroupCost)}`;
                            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
                          }}
                          className="gap-2"
                        >
                          Share via Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
