import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bookingScreenshot from "@/assets/compare/the-hart-house-booking.png";
import aiImage1 from "@/assets/hotels/harties-budget-2s-8a.jpg";
import aiImage2 from "@/assets/hotels/harties-budget-2s-8b.jpg";
import aiImage3 from "@/assets/hotels/harties-budget-2s-8c.jpg";
import aiImage4 from "@/assets/hotels/harties-budget-2s-8d.jpg";

const aiImages = [
  { src: aiImage1, file: "harties-budget-2s-8a.jpg", label: "Image 1 (Primary)" },
  { src: aiImage2, file: "harties-budget-2s-8b.jpg", label: "Image 2" },
  { src: aiImage3, file: "harties-budget-2s-8c.jpg", label: "Image 3" },
  { src: aiImage4, file: "harties-budget-2s-8d.jpg", label: "Image 4" },
];

export default function ImageCompare() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold">Image Comparison</h1>
            <p className="text-sm text-muted-foreground">
              Harties Budget 2 Sleeper Option 8 (The Hart House) — All 4 carousel images
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
        </div>
      </header>

      <section className="container mx-auto px-4 py-6 space-y-8">
        {/* Real reference */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold">Real Property (Booking.com screenshot)</h2>
            <p className="text-sm text-muted-foreground">Reference only — not used in app</p>
          </CardHeader>
          <CardContent>
            <img
              src={bookingScreenshot}
              alt="The Hart House on Booking.com (screenshot)"
              className="w-full max-w-2xl h-auto rounded-md border mx-auto"
              loading="lazy"
            />
          </CardContent>
        </Card>

        {/* AI images grid */}
        <div>
          <h2 className="text-base font-semibold mb-4">AI-generated images (used in quote cards)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiImages.map((img) => (
              <Card key={img.file} className="overflow-hidden">
                <CardHeader className="pb-2 pt-4 px-4">
                  <p className="text-sm font-medium">{img.label}</p>
                  <p className="text-xs text-muted-foreground">{img.file}</p>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <img
                    src={img.src}
                    alt={`AI-generated ${img.label}`}
                    className="w-full h-auto rounded-md border"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
