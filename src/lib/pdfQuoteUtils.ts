import { jsPDF } from 'jspdf';
import { destinations, packages } from '@/data/travelData';

// Booking disclaimer text to appear at bottom of every quote
export const BOOKING_DISCLAIMER = `BOOKING PROCESS

To start with your booking please request the invoice. Please request on the day you would be making payment as the invoice and availability confirmation are valid for only 1 day.

A 50% deposit secures the booking.

As soon as we receive your deposit we proceed with bookings then send you a confirmation letter which will have your hotel confirmation number and all the important information on your Getaway Package.

Thank you,

Accounts,
Travel Affordable Pty Ltd
The Atrium Building
5th Street, Sandown
Sandton
Tel: 0796813869
e: info@travelaffordable.co.za
https://instant-travel-quote.lovable.app`;

// Interface for quote data that can be embedded in PDFs
export interface QuoteFormData {
  quoteType: 'accommodation-provider' | 'travel-agent' | 'bus-hire' | 'custom';
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  childrenAges: number[];
  rooms?: number;
  packageIds: string[];
  hotelName?: string;
  hotelQuoteAmount?: string;
  hotels?: { id: string; name: string; quoteAmount: string }[];
  roomCategories?: { id: string; name: string; count: number }[];
  facilities?: string[];
  busQuoteAmount?: string;
  companyDetails?: {
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
  };
  enableFamilySplit?: boolean;
  families?: { id: string; familyName: string; adults: number; children: number; childrenAges: number[] }[];
  quoteNumber?: string;
}

// Encode quote data as base64 for embedding
export function encodeQuoteData(data: QuoteFormData): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

// Decode quote data from base64
export function decodeQuoteData(encoded: string): QuoteFormData | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch (e) {
    console.error('Failed to decode quote data:', e);
    return null;
  }
}

// Add quote data marker to PDF content (as hidden text)
export function addQuoteDataToPDF(doc: jsPDF, data: QuoteFormData): void {
  const encoded = encodeQuoteData(data);
  // Add as metadata that won't be visible but can be extracted
  doc.setProperties({
    title: 'Travel Quote',
    subject: 'Travel Quote Document',
    author: 'Travel Affordable',
    keywords: `QUOTE_DATA:${encoded}`,
    creator: 'Travel Affordable Quote System'
  });
}

// Add booking disclaimer to PDF
export function addBookingDisclaimerToPDF(doc: jsPDF, startY?: number): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Check if we need a new page
  let yPos = startY || 200;
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }
  
  // Draw separator line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;
  
  // Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Blue color
  doc.text('BOOKING PROCESS', 20, yPos);
  yPos += 8;
  
  // Body text
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  const lines = [
    'To start with your booking please request the invoice. Please request on the day you would be',
    'making payment as the invoice and availability confirmation are valid for only 1 day.',
    '',
    'A 50% deposit secures the booking.',
    '',
    'As soon as we receive your deposit we proceed with bookings then send you a confirmation',
    'letter which will have your hotel confirmation number and all the important information on',
    'your Getaway Package.',
    '',
    'Thank you,'
  ];
  
  lines.forEach(line => {
    if (yPos < pageHeight - 30) {
      doc.text(line, 20, yPos);
      yPos += 4;
    }
  });
  
  yPos += 2;
  
  // Company signature
  doc.setFont('helvetica', 'bold');
  doc.text('Accounts,', 20, yPos); yPos += 4;
  doc.setFont('helvetica', 'normal');
  doc.text('Travel Affordable Pty Ltd', 20, yPos); yPos += 4;
  doc.text('The Atrium Building', 20, yPos); yPos += 4;
  doc.text('5th Street, Sandown', 20, yPos); yPos += 4;
  doc.text('Sandton', 20, yPos); yPos += 4;
  doc.text('Tel: 0796813869', 20, yPos); yPos += 4;
  doc.text('e: info@travelaffordable.co.za', 20, yPos); yPos += 4;
  doc.setTextColor(30, 64, 175);
  doc.text('https://instant-travel-quote.lovable.app', 20, yPos);
  
  return yPos;
}

// Extract quote data from a PDF file
export async function extractQuoteDataFromPDF(file: File): Promise<QuoteFormData | null> {
  try {
    // Dynamically import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Configure worker using unpkg CDN which works better with ES modules
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // Try to get metadata
    const metadata = await pdf.getMetadata();
    const keywords = (metadata?.info as any)?.Keywords || '';
    
    // Check if we have embedded quote data
    if (keywords.startsWith('QUOTE_DATA:')) {
      const encodedData = keywords.replace('QUOTE_DATA:', '');
      return decodeQuoteData(encodedData);
    }
    
    // If no embedded data, try to parse from text content
    return await parseQuoteFromText(pdf);
  } catch (error) {
    console.error('Error extracting quote data from PDF:', error);
    return null;
  }
}

// Fallback: Try to parse quote data from PDF text content
async function parseQuoteFromText(pdf: any): Promise<QuoteFormData | null> {
  try {
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

    const data: Partial<QuoteFormData> = {
      quoteType: 'custom',
      packageIds: [],
      childrenAges: [],
    };

    // Quote type detection (Travel Agent PDFs typically start with TA-...)
    const quoteMatch = fullText.match(/Quote\s*#:\s*([A-Z]{2}-[A-Z0-9-]+)/i);
    if (quoteMatch?.[1]) {
      data.quoteNumber = quoteMatch[1].trim();
      if (data.quoteNumber.toUpperCase().startsWith('TA-')) {
        data.quoteType = 'travel-agent';
      }
    }

    // Destination (map displayed name back to destination id used by the form)
    const destMatch = fullText.match(/Destination:\s*([^\n\r]+)/i);
    if (destMatch?.[1]) {
      const destName = destMatch[1].trim();
      const normalizedDestName = normalize(destName);
      const matchedDestination = destinations.find(
        (d) => normalize(d.name) === normalizedDestName || normalize(d.shortName) === normalizedDestName
      );
      data.destination = matchedDestination?.id || destName;
    }

    // Dates
    const checkinMatch = fullText.match(/Check-in:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
    if (checkinMatch?.[1]) data.checkIn = checkinMatch[1];

    const checkoutMatch = fullText.match(/Check-out:\s*(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/i);
    if (checkoutMatch?.[1]) data.checkOut = checkoutMatch[1];

    // Adults / Children
    const adultsMatch = fullText.match(/(\d+)\s*Adults?/i);
    if (adultsMatch?.[1]) data.adults = parseInt(adultsMatch[1], 10);

    const childrenMatch = fullText.match(/(\d+)\s*Children?/i);
    if (childrenMatch?.[1]) data.children = parseInt(childrenMatch[1], 10);

    // Business + client info
    // Try to parse FROM block for company name, phone, email; TO block for client name.
    const fromBlockMatch = fullText.match(/FROM:\s*(.*?)\s*TO:/i);
    const fromBlock = fromBlockMatch?.[1] ? fromBlockMatch[1] : '';
    const toBlockMatch = fullText.match(/TO:\s*(.*?)(ACCOMMODATION OPTIONS|DESTINATION:|CHECK-IN:)/i);
    const toBlock = toBlockMatch?.[1] ? toBlockMatch[1] : '';

    const companyName = fromBlock ? fromBlock.split(/\s{2,}|\n/)[0]?.trim() : '';
    const phoneMatch = fullText.match(/Tel:\s*([^\n\r]+)/i);
    const emailMatch = fullText.match(/Email:\s*([^\n\r]+)/i);

    const clientName = toBlock ? toBlock.split(/\s{2,}|\n/)[0]?.trim() : '';

    if (companyName || phoneMatch?.[1] || emailMatch?.[1] || clientName) {
      data.companyDetails = {
        companyName: companyName || '',
        companyAddress: '',
        companyPhone: phoneMatch?.[1]?.trim() || '',
        companyEmail: emailMatch?.[1]?.trim() || '',
        vatNumber: '',
        quoteValidDays: 14,
        termsAndConditions: '',
        clientName: clientName || '',
        clientCompany: '',
        clientEmail: '',
      };
    }

    // Hotels + rates (Travel Agent PDFs show multiple accommodation options)
    // Prefer parsing from the "PRICING BY ACCOMMODATION" section if available.
    const hotels: { id: string; name: string; quoteAmount: string }[] = [];

    const pricingSectionMatch = fullText.match(/PRICING BY ACCOMMODATION([\s\S]*?)(Quote Reference:|This is a computer-generated)/i);
    const pricingSection = pricingSectionMatch?.[1] || '';

    const pricingRegex = /([^\n\r|]{10,}?)\s*R\s?(\d{3,})/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pricingRegex.exec(pricingSection)) !== null) {
      const name = pm[1].replace(/\s+/g, ' ').trim();
      const amount = pm[2].trim();
      if (name && amount) {
        hotels.push({ id: String(hotels.length + 1), name, quoteAmount: amount });
      }
    }

    // If pricing table parsing failed, fall back to parsing "Option X:" lines (without amounts)
    if (hotels.length === 0) {
      const optionRegex = /Option\s*(\d+)\s*:\s*([^\n\r]+)/gi;
      let om: RegExpExecArray | null;
      while ((om = optionRegex.exec(fullText)) !== null) {
        const name = om[2].replace(/\s+/g, ' ').trim();
        if (name) hotels.push({ id: String(hotels.length + 1), name, quoteAmount: '' });
      }
    }

    if (hotels.length > 0) data.hotels = hotels;

    // Packages (try to recover packageIds by matching package codes like CPT1, HG2, etc.)
    const codeMatches = Array.from(fullText.matchAll(/\b([A-Z]{2,6}\d{1,3})\b/g)).map((m) => m[1]);
    const uniqueCodes = Array.from(new Set(codeMatches.map((c) => c.toUpperCase())));

    if (uniqueCodes.length > 0) {
      const destId = typeof data.destination === 'string' ? data.destination : '';
      const matched = packages.filter((p) => {
        const pName = p.name.toUpperCase();
        const matchesCode = uniqueCodes.some((code) => pName.includes(`${code} -`) || pName.startsWith(`${code} `) || pName.startsWith(`${code}-`) || pName.includes(`${code} `));
        const matchesDest = destId ? p.destination === destId : true;
        return matchesCode && matchesDest;
      });
      if (matched.length > 0) data.packageIds = matched.map((p) => p.id);
    }

    return data as QuoteFormData;
  } catch (error) {
    console.error('Error parsing text from PDF:', error);
    return null;
  }
}
