import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

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

interface PackageInfo {
  id: string;
  name: string;
  basePrice: number;
  kidsPrice?: number;
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
}

export function CustomQuoteActions({
  quotes,
  packages,
  adults,
  children,
  childrenAges,
  checkIn,
  checkOut,
  destination,
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
    if (selectedQuotes.size === 0) {
      return quotes;
    }
    return quotes.filter((_, i) => selectedQuotes.has(i));
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
      .filter(a => !isNaN(a) && a >= 3 && a <= 17);
    
    let kidsPackageCost = 0;
    let kidsFees = 0;
    if (selectedPkg && kidsAges.length > 0) {
      kidsPackageCost = (selectedPkg.kidsPrice || 0) * kidsAges.length;
      kidsAges.forEach(age => {
        kidsFees += age <= 12 ? 200 : 300;
      });
    }

    const grandTotal = quote.totalCost + totalPackageCost + totalServiceFees + kidsPackageCost + kidsFees;
    const perPerson = Math.round(grandTotal / (adults + kidsAges.length));

    return { selectedPkg, nightsCount, grandTotal, perPerson, kidsAges };
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const generateQuoteText = (quote: CustomQuote, index: number) => {
    const { selectedPkg, nightsCount, grandTotal, perPerson, kidsAges } = calculateQuoteDetails(quote);

    let text = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUOTE ${index + 1}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏨 HOTEL: ${quote.hotelName}
`;

    if (quote.roomType) text += `📋 Room Type: ${quote.roomType}\n`;
    if (quote.bedConfig) text += `🛏️ Beds: ${quote.bedConfig}\n`;
    if (quote.mealPlan) text += `🍳 Meal Plan: ${quote.mealPlan}\n`;

    text += `
📍 DESTINATION: ${destination.toUpperCase()}
📅 Check-in: ${formatDate(checkIn)}
📅 Check-out: ${formatDate(checkOut)}
🌙 Duration: ${nightsCount} night${nightsCount !== 1 ? 's' : ''}
👥 Guests: ${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}

📦 PACKAGE: ${quote.packageName}
`;

    if (selectedPkg && selectedPkg.activitiesIncluded.length > 0) {
      text += `\n✅ INCLUSIONS:\n`;
      text += `   • Accommodation\n`;
      selectedPkg.activitiesIncluded.forEach(activity => {
        text += `   • ${activity}\n`;
      });
    }

    text += `
💰 PRICING
   Per Person: R${perPerson.toLocaleString()}
   Total Cost: R${grandTotal.toLocaleString()}
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
      let yPos = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(79, 70, 229); // Primary color
      pdf.text('TRAVEL AFFORDABLE', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Custom Hotel Quotes', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Destination and dates
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text(`Destination: ${destination.toUpperCase()}`, 20, yPos);
      yPos += 6;
      pdf.text(`Travel Dates: ${formatDate(checkIn)} - ${formatDate(checkOut)}`, 20, yPos);
      yPos += 6;
      pdf.text(`Guests: ${adults} Adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}`, 20, yPos);
      yPos += 12;

      // Quotes
      quotesToExport.forEach((quote, index) => {
        const { selectedPkg, nightsCount, grandTotal, perPerson } = calculateQuoteDetails(quote);

        // Check if we need a new page
        if (yPos > 250) {
          pdf.addPage();
          yPos = 20;
        }

        // Quote header
        pdf.setFillColor(254, 243, 199); // Amber-100
        pdf.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(120, 53, 15); // Amber-900
        pdf.text(`Quote ${index + 1}: ${quote.hotelName}`, 20, yPos);
        yPos += 12;

        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);

        if (quote.roomType) {
          pdf.text(`Room Type: ${quote.roomType}`, 25, yPos);
          yPos += 5;
        }
        if (quote.bedConfig) {
          pdf.text(`Beds: ${quote.bedConfig}`, 25, yPos);
          yPos += 5;
        }
        if (quote.mealPlan) {
          pdf.setTextColor(34, 139, 34);
          pdf.text(`✓ ${quote.mealPlan}`, 25, yPos);
          pdf.setTextColor(80, 80, 80);
          yPos += 5;
        }

        pdf.text(`Package: ${quote.packageName}`, 25, yPos);
        yPos += 5;
        pdf.text(`Duration: ${nightsCount} night${nightsCount !== 1 ? 's' : ''}`, 25, yPos);
        yPos += 7;

        // Inclusions
        if (selectedPkg && selectedPkg.activitiesIncluded.length > 0) {
          pdf.setTextColor(60, 60, 60);
          pdf.text('Inclusions:', 25, yPos);
          yPos += 5;
          pdf.setTextColor(34, 139, 34);
          pdf.text('• Accommodation', 30, yPos);
          yPos += 4;
          selectedPkg.activitiesIncluded.forEach(activity => {
            pdf.text(`• ${activity}`, 30, yPos);
            yPos += 4;
          });
          yPos += 3;
        }

        // Pricing
        pdf.setFontSize(11);
        pdf.setTextColor(79, 70, 229);
        pdf.text(`Per Person: R${perPerson.toLocaleString()}`, 25, yPos);
        yPos += 5;
        pdf.setTextColor(120, 53, 15);
        pdf.text(`Total: R${grandTotal.toLocaleString()}`, 25, yPos);
        yPos += 15;
      });

      // Footer
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      yPos += 10;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Contact Us:', 20, yPos);
      yPos += 5;
      pdf.text('Email: info@travelaffordable.co.za', 20, yPos);
      yPos += 4;
      pdf.text('WhatsApp: +27 79 681 3869', 20, yPos);
      yPos += 4;
      pdf.text('Web: www.travelaffordable.co.za', 20, yPos);

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
                  Export PDF
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
