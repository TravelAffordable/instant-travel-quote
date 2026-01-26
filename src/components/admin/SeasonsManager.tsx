import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type SeasonalPeriod = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  multiplier: number;
  description: string | null;
  is_active: boolean;
};

export const SeasonsManager = () => {
  const [seasons, setSeasons] = useState<SeasonalPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSeason, setNewSeason] = useState({
    name: "",
    start_date: "",
    end_date: "",
    multiplier: 1.0,
    description: "",
  });
  const { toast } = useToast();

  const fetchSeasons = async () => {
    const { data, error } = await supabase
      .from("seasonal_periods")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSeasons(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleAddSeason = async () => {
    if (!newSeason.name || !newSeason.start_date || !newSeason.end_date) {
      toast({ title: "Error", description: "Name and dates are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("seasonal_periods").insert([
      {
        name: newSeason.name,
        start_date: newSeason.start_date,
        end_date: newSeason.end_date,
        multiplier: newSeason.multiplier,
        description: newSeason.description || null,
      },
    ]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Seasonal period added" });
      setNewSeason({ name: "", start_date: "", end_date: "", multiplier: 1.0, description: "" });
      setDialogOpen(false);
      fetchSeasons();
    }
  };

  const handleDeleteSeason = async (id: string) => {
    const { error } = await supabase.from("seasonal_periods").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Seasonal period deleted" });
      fetchSeasons();
    }
  };

  const getMultiplierBadge = (multiplier: number) => {
    if (multiplier > 1) {
      const percent = Math.round((multiplier - 1) * 100);
      return (
        <Badge className="bg-red-500 text-white gap-1">
          <TrendingUp className="h-3 w-3" />
          +{percent}%
        </Badge>
      );
    } else if (multiplier < 1) {
      const percent = Math.round((1 - multiplier) * 100);
      return (
        <Badge className="bg-green-500 text-white gap-1">
          <TrendingDown className="h-3 w-3" />
          -{percent}%
        </Badge>
      );
    }
    return <Badge variant="outline">Standard</Badge>;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Group by year
  const seasonsByYear = seasons.reduce((acc, season) => {
    const year = new Date(season.start_date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(season);
    return acc;
  }, {} as Record<number, SeasonalPeriod[]>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Seasonal Periods</CardTitle>
            <CardDescription>
              Define peak seasons, holidays, and low periods with rate multipliers.
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Seasonal Period</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Period Name</Label>
                  <Input
                    value={newSeason.name}
                    onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                    placeholder="e.g. Christmas Peak 2026"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={newSeason.start_date}
                      onChange={(e) => setNewSeason({ ...newSeason, start_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={newSeason.end_date}
                      onChange={(e) => setNewSeason({ ...newSeason, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Rate Multiplier</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.05"
                      min="0.5"
                      max="3"
                      value={newSeason.multiplier}
                      onChange={(e) => setNewSeason({ ...newSeason, multiplier: parseFloat(e.target.value) })}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">
                      {newSeason.multiplier > 1
                        ? `+${Math.round((newSeason.multiplier - 1) * 100)}% premium`
                        : newSeason.multiplier < 1
                        ? `-${Math.round((1 - newSeason.multiplier) * 100)}% discount`
                        : "Standard rate"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input
                    value={newSeason.description}
                    onChange={(e) => setNewSeason({ ...newSeason, description: e.target.value })}
                    placeholder="e.g. Peak holiday season"
                  />
                </div>
                <Button onClick={handleAddSeason} className="w-full">
                  Add Seasonal Period
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <p>Loading...</p>
        ) : seasons.length === 0 ? (
          <p className="text-muted-foreground">No seasonal periods defined. Add some to apply rate adjustments.</p>
        ) : (
          Object.entries(seasonsByYear)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([year, yearSeasons]) => (
              <div key={year}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  {year}
                  <Badge variant="secondary">{yearSeasons.length} periods</Badge>
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Adjustment</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearSeasons.map((season) => (
                      <TableRow key={season.id}>
                        <TableCell className="font-medium">{season.name}</TableCell>
                        <TableCell>
                          {formatDate(season.start_date)} - {formatDate(season.end_date)}
                        </TableCell>
                        <TableCell>{getMultiplierBadge(season.multiplier)}</TableCell>
                        <TableCell className="text-muted-foreground">{season.description || "-"}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSeason(season.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
};
