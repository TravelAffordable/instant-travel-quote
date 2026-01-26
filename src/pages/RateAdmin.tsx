import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreasManager } from "@/components/admin/AreasManager";
import { HotelsManager } from "@/components/admin/HotelsManager";
import { RatesManager } from "@/components/admin/RatesManager";
import { SeasonsManager } from "@/components/admin/SeasonsManager";
import { Building2, MapPin, Calendar, DollarSign, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RateAdmin = () => {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // Simple password protection for demo (in production, use proper auth)
  const handleLogin = () => {
    if (password === "admin123") {
      setAuthenticated(true);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              This page requires admin access. Add ?admin=true to the URL.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Rate Management System
            </CardTitle>
            <CardDescription>
              Enter password to access rate management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Rate Management System</h1>
          <p className="text-muted-foreground mt-2">
            Manage hotels, room types, rates, and seasonal pricing across all destinations.
          </p>
        </div>

        <Tabs defaultValue="areas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="areas" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Areas</span>
            </TabsTrigger>
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Hotels</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Rates</span>
            </TabsTrigger>
            <TabsTrigger value="seasons" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Seasons</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="areas">
            <AreasManager />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelsManager />
          </TabsContent>

          <TabsContent value="rates">
            <RatesManager />
          </TabsContent>

          <TabsContent value="seasons">
            <SeasonsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RateAdmin;
