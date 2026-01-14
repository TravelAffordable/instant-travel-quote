import HotelbedsLetter from "@/components/HotelbedsLetter";

const HotelbedsLetterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-800">
          Hotelbeds Certification Letter
        </h1>
        <p className="text-center text-slate-600 mb-8">
          Professional letter template for certification submission and image request
        </p>
        <HotelbedsLetter />
      </div>
    </div>
  );
};

export default HotelbedsLetterPage;
