import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import { formatCurrency, roundToNearest10 } from '@/lib/utils';

interface CustomQuote {
  hotelName: string;
  hotelTier?: string;
  recommendation?: string;
  roomType?: string;
  bedConfig?: string;
  mealPlan?: string;
  stayDetails?: string;
  totalCost: number;
  packageId: string;
  packageName: string;
  checkInDate?: string;
  checkOutDate?: string;
}

interface KidsPriceTier {
  minAge: number;
  maxAge: number;
  price: number;
}

interface PackageInfo {
  id: string;
  name: string;
  basePrice: number;
  kidsPrice?: number;
  kidsPriceTiers?: KidsPriceTier[];
  activitiesIncluded: string[];
}

interface CustomQuoteActionsProps {
  quotes: CustomQuote[];
  packages: PackageInfo[];
  adults: number;
  children: number;
  childrenAges: string;
  checkIn: string;
  checkOut: string;
  destination: string;
  guestName?: string;
  guestTel?: string;
  guestEmail?: string;
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-ZA', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export function CustomQuoteActions({
  quotes,
  packages,
  adults,
  children,
  childrenAges,
  checkIn,
  checkOut,
  destination,
  guestName = '',
  guestTel = '',
  guestEmail = '',
}: CustomQuoteActionsProps) {
  const [selectedQuotes, setSelectedQuotes] = useState<Set<number>>(new Set());

  const toggleQuoteSelection = (index: number) => {
    setSelectedQuotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedQuotes(new Set(quotes.map((_, i) => i)));
  };

  const clearSelection = () => {
    setSelectedQuotes(new Set());
  };

  const getQuotesToExport = () => {
    if (selectedQuotes.size === 0) return quotes;
    return quotes.filter((_, index) => selectedQuotes.has(index));
  };

  const calculateQuoteDetails = (quote: CustomQuote) => {
    const selectedPkg = packages.find(p => p.id === quote.packageId);
    const nightsCount = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );

    const packageCostPerAdult = selectedPkg?.basePrice || 0;
    const totalPackageCost = packageCostPerAdult * adults;

    let serviceFeePerAdult = 1000;
    if (adults >= 10) serviceFeePerAdult = 750;
    else if (adults >= 4) serviceFeePerAdult = 800;
    else if (adults >= 2) serviceFeePerAdult = 850;
    const totalServiceFees = serviceFeePerAdult * adults;

    const kidsAges = childrenAges
      .split(',')
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a) && a >= 4 && a <= 16);
    
    let kidsPackageCost = 0;
    let kidsFees = 0;
    const kidFeePerChild = adults >= 2 ? 150 : 300;
    if (selectedPkg && kidsAges.length > 0) {
      kidsAges.forEach(age => {
        if (selectedPkg.kidsPriceTiers && selectedPkg.kidsPriceTiers.length > 0) {
          const tier = selectedPkg.kidsPriceTiers.find(t => age >= t.minAge && age <= t.maxAge);
          if (tier) {
            kidsPackageCost += tier.price;
          } else if (selectedPkg.kidsPrice) {
            kidsPackageCost += selectedPkg.kidsPrice;
          }
        } else if (selectedPkg.kidsPrice) {
          kidsPackageCost += selectedPkg.kidsPrice;
        }
        kidsFees += kidFeePerChild;
      });
    }

    const grandTotal = quote.totalCost + totalPackageCost + totalServiceFees + kidsPackageCost + kidsFees;
    const perPerson = Math.round(grandTotal / (adults + kidsAges.length));

    return { selectedPkg, nightsCount, grandTotal, perPerson, kidsAges };
  };

  const generateQuoteText = (quote: CustomQuote, index: number) => {
    const { selectedPkg, nightsCount, grandTotal, perPerson, kidsAges } = calculateQuoteDetails(quote);

    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUOTE ${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Greetings${guestName ? ` ${guestName}` : ''}

The discounted package price for your getaway includes:
• ${nightsCount} nights accommodation
`;

    // Add meal plan if present
    if (quote.mealPlan) {
      text += `• ${quote.mealPlan}\n`;
    }

    // Add package activities (filtered)
    if (selectedPkg && selectedPkg.activitiesIncluded.length > 0) {
      selectedPkg.activitiesIncluded
        .filter(activity => {
          const lower = activity.toLowerCase();
          return !lower.includes('accommodation') && 
                 !lower.includes('breakfast at selected') &&
                 !lower.includes('buffet breakfast at selected') &&
                 !lower.includes('room only');
        })
        .forEach(activity => {
          text += `• ${activity}\n`;
        });
    }

    text += `
Our getaways are stylish and trendy with a bit of affordable sophistication.

🏨 HOTEL: ${quote.hotelName}
`;

    if (quote.roomType) text += `📋 Room Type: ${quote.roomType}\n`;
    if (quote.bedConfig) text += `🛏️ Beds: ${quote.bedConfig}\n`;

    text += `
📍 DESTINATION: ${destination.toUpperCase()}
📅 Check-in: ${formatDate(checkIn)}
📅 Check-out: ${formatDate(checkOut)}
🌙 Duration: ${nightsCount} night${nightsCount !== 1 ? 's' : ''}
👥 Guests: ${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}

📦 PACKAGE: ${quote.packageName}

💰 PRICING
   Grand Total: ${formatCurrency(grandTotal)}

To start with your booking process, please click on request to book button below. An email message with your booking details will open. Send the email. Our agents will then be in communication with you, then if you request we will send you the invoice for you to secure your booking.

Once payment is received we will proceed with bookings then send you a confirmation letter with all the important information including ticket information, hotel confirmation numbers, transport schedules where applicable and itineraries for your getaway.

Thank you,
Bookings,
Travel Affordable Pty Ltd
`;

    return text;
  };

  const handleExportPDF = async () => {
    const quotesToExport = getQuotesToExport();
    if (quotesToExport.length === 0) {
      toast.error('No quotes to export');
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPos = 20;

      // Header
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('TRAVEL AFFORDABLE', pageWidth / 2, yPos, { align: 'center' });
      yPos += 8;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text('Custom Hotel Quotes', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Personalized greeting
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(40, 40, 40);
      pdf.text(`Greetings${guestName ? ` ${guestName}` : ''}`, margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.text('The discounted package price for your getaway includes:', margin, yPos);
      yPos += 10;

      // Quotes
      quotesToExport.forEach((quote, index) => {
        const { selectedPkg, nightsCount, grandTotal, perPerson, kidsAges } = calculateQuoteDetails(quote);
        const totalGuests = adults + kidsAges.length;

        // Check if we need a new page
        if (yPos > 220) {
          pdf.addPage();
          yPos = 20;
        }

        // Quote card border
        const cardStartY = yPos - 5;
        pdf.setDrawColor(194, 120, 3);
        pdf.setLineWidth(0.5);

        // Room type badge
        if (quote.roomType) {
          pdf.setFillColor(34, 139, 34);
          const badgeWidth = pdf.getTextWidth(quote.roomType) + 10;
          pdf.roundedRect(margin, yPos - 4, badgeWidth, 7, 1, 1, 'F');
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(255, 255, 255);
          pdf.text(quote.roomType, margin + 5, yPos);
          yPos += 6;
        }

        // Hotel name
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(40, 40, 40);
        pdf.text(`${index + 1}. ${quote.hotelName}`, margin, yPos);
        yPos += 6;

        // Tier and recommendation
        if (quote.hotelTier) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(79, 70, 229);
          pdf.text(quote.hotelTier, margin, yPos);
          yPos += 4;
        }

        // Price per person (only if no kids)
        if (kidsAges.length === 0) {
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(194, 120, 3);
          pdf.text(formatCurrency(perPerson), pageWidth - margin, yPos, { align: 'right' });
          yPos += 5;

          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          pdf.text('Total Package Price Per Person', pageWidth - margin, yPos, { align: 'right' });
          yPos += 6;
        }

        // Grand total
        pdf.setFontSize(kidsAges.length > 0 ? 14 : 12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(194, 120, 3);
        pdf.text(formatCurrency(grandTotal), pageWidth - margin, yPos, { align: 'right' });
        yPos += 4;

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Grand Total', pageWidth - margin, yPos, { align: 'right' });
        yPos += 6;

        // Meal plan
        if (quote.mealPlan) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(34, 139, 34);
          pdf.text(`✓ ${quote.mealPlan}`, margin, yPos);
          yPos += 5;
        }

        // Package name
        if (quote.packageName) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(194, 120, 3);
          const packageLines = pdf.splitTextToSize(quote.packageName.toUpperCase(), contentWidth - 60);
          packageLines.forEach((line: string) => {
            pdf.text(line, margin, yPos);
            yPos += 4;
          });
          yPos += 2;
        }

        // Travel details
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        pdf.text(`📍 ${destination.toUpperCase()} | 📅 ${formatDate(checkIn)} - ${formatDate(checkOut)}`, margin, yPos);
        yPos += 4;
        pdf.text(`🌙 ${nightsCount} night${nightsCount !== 1 ? 's' : ''} | 👥 ${adults} Adult${adults !== 1 ? 's' : ''}${kidsAges.length > 0 ? `, ${kidsAges.length} Child${kidsAges.length > 1 ? 'ren' : ''}` : ''}`, margin, yPos);
        yPos += 6;

        // Package inclusions
        if (selectedPkg && selectedPkg.activitiesIncluded.length > 0) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(40, 40, 40);
          pdf.text('Package Inclusions:', margin, yPos);
          yPos += 4;

          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(34, 139, 34);

          // Nights accommodation
          pdf.text(`✓   ${nightsCount} nights accommodation`, margin, yPos);
          yPos += 4;

          // Meal plan in inclusions
          if (quote.mealPlan) {
            pdf.text(`✓   ${quote.mealPlan}`, margin, yPos);
            yPos += 4;
          }

          // Activities (filtered)
          selectedPkg.activitiesIncluded
            .filter(activity => {
              const lower = activity.toLowerCase();
              return !lower.includes('accommodation') && 
                     !lower.includes('breakfast at selected') &&
                     !lower.includes('buffet breakfast at selected') &&
                     !lower.includes('room only');
            })
            .forEach(activity => {
              if (yPos > 270) {
                pdf.addPage();
                yPos = 20;
              }
              pdf.text(`✓   ${activity}`, margin, yPos);
              yPos += 4;
            });
          yPos += 3;
        }

        // Card border
        const cardEndY = yPos;
        pdf.setDrawColor(194, 120, 3);
        pdf.rect(margin - 3, cardStartY, contentWidth + 6, cardEndY - cardStartY + 5);
        yPos += 12;
      });

      // Stylish closing text
      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Our getaways are stylish and trendy with a bit of affordable sophistication.', margin, yPos);
      yPos += 10;

      // Contact info
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(79, 70, 229);
      pdf.text('Contact Us:', margin, yPos);
      yPos += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      pdf.text('Email: info@travelaffordable.co.za', margin, yPos);
      yPos += 4;
      pdf.text('WhatsApp: +27 79 681 3869', margin, yPos);
      yPos += 4;
      pdf.text('Web: www.travelaffordable.co.za', margin, yPos);
      yPos += 10;

      // Booking process
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('BOOKING PROCESS:', margin, yPos);
      yPos += 6;
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      
      const disclaimerLines = [
        'To start with your booking process, please click on request to book button below.',
        'An email message with your booking details will open. Send the email.',
        'Our agents will then be in communication with you, then if you request we will',
        'send you the invoice for you to secure your booking.',
        '',
        'Once payment is received we will proceed with bookings then send you a confirmation',
        'letter with all the important information including ticket information, hotel',
        'confirmation numbers, transport schedules where applicable and itineraries',
        'for your getaway.',
        '',
        'Thank you,',
        'Bookings,',
        'Travel Affordable Pty Ltd',
      ];

      disclaimerLines.forEach(line => {
        if (yPos > 280) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 4;
      });

      // Save the PDF
      const filename = `TravelAffordable_Quotes_${destination}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      toast.success(`PDF exported: ${quotesToExport.length} quote${quotesToExport.length > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    }
  };

  const handleEmail = () => {
    const quotesToExport = getQuotesToExport();
    if (quotesToExport.length === 0) {
      toast.error('No quotes to send');
      return;
    }

    let body = `TRAVEL AFFORDABLE
CUSTOM HOTEL QUOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Greetings${guestName ? ` ${guestName}` : ''}

Destination: ${destination.toUpperCase()}
Travel Dates: ${formatDate(checkIn)} - ${formatDate(checkOut)}
Guests: ${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}

`;

    quotesToExport.forEach((quote, index) => {
      body += generateQuoteText(quote, index);
      body += '\n';
    });

    body += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact Us:
Email: info@travelaffordable.co.za
WhatsApp: +27 79 681 3869
Web: www.travelaffordable.co.za
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const subject = `Quote Request - ${destination} - ${quotesToExport.length} Custom Hotel Option${quotesToExport.length > 1 ? 's' : ''}`;
    const mailtoLink = `mailto:info@travelaffordable.co.za,travelaffordable2017@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    toast.success('Opening email client');
  };

  const handleWhatsApp = () => {
    const quotesToExport = getQuotesToExport();
    if (quotesToExport.length === 0) {
      toast.error('No quotes to send');
      return;
    }

    let text = `🌴 *TRAVEL AFFORDABLE*
*Custom Hotel Quotes*

Greetings${guestName ? ` ${guestName}` : ''}

📍 *Destination:* ${destination.toUpperCase()}
📅 *Travel Dates:* ${formatDate(checkIn)} - ${formatDate(checkOut)}
👥 *Guests:* ${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}

`;

    quotesToExport.forEach((quote, index) => {
      text += generateQuoteText(quote, index);
      text += '\n';
    });

    text += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Contact Us:_
📧 info@travelaffordable.co.za
🌐 www.travelaffordable.co.za`;

    window.open(`https://wa.me/27796813869?text=${encodeURIComponent(text)}`, '_blank');
    toast.success('Opening WhatsApp');
  };

  if (quotes.length === 0) return null;

  return (
    <div className="space-y-4 mb-4">
      {/* Action Buttons */}
      <Card className="border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100/50">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {quotes.length} Custom Quote{quotes.length > 1 ? 's' : ''} Available
                </p>
                <p className="text-xs text-amber-700">
                  {selectedQuotes.size > 0
                    ? `${selectedQuotes.size} selected - actions will apply to selection`
                    : 'Select specific quotes or export all'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={handleExportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <FileDown className="w-4 h-4 mr-1" />
                  Save Quote as PDF
                </Button>
                <Button
                  size="sm"
                  onClick={handleEmail}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
                <Button
                  size="sm"
                  onClick={handleWhatsApp}
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="flex items-center gap-4 pt-2 border-t border-amber-200">
              <span className="text-xs text-amber-700">Quick select:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="h-6 text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-200"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Select All
              </Button>
              {selectedQuotes.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                  className="h-6 text-xs text-amber-700 hover:text-amber-900 hover:bg-amber-200"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection checkboxes inline with quotes */}
      <div className="flex flex-wrap gap-2">
        {quotes.map((quote, index) => (
          <label
            key={index}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm ${
              selectedQuotes.has(index)
                ? 'bg-amber-200 border-amber-400 text-amber-900'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <Checkbox
              checked={selectedQuotes.has(index)}
              onCheckedChange={() => toggleQuoteSelection(index)}
              className="h-4 w-4"
            />
            <span className="truncate max-w-[150px]">{quote.hotelName}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
