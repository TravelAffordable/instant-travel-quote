import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

type Area = {
  id: string;
  destination: string;
  name: string;
  description: string | null;
  is_active: boolean;
};

const DESTINATIONS = [
  { value: "durban", label: "Durban" },
  { value: "cape_town", label: "Cape Town" },
  { value: "sun_city", label: "Sun City" },
  { value: "mpumalanga", label: "Mpumalanga" },
  { value: "hartbeespoort", label: "Hartbeespoort" },
  { value: "magaliesburg", label: "Magaliesburg" },
  { value: "vaal", label: "Vaal" },
];

export const AreasManager = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [newArea, setNewArea] = useState({ destination: "", name: "", description: "" });
  const { toast } = useToast();

  const fetchAreas = async () => {
    const { data, error } = await supabase
      .from("areas")
      .select("*")
      .order("destination", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setAreas(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAddArea = async () => {
    if (!newArea.destination || !newArea.name) {
      toast({ title: "Error", description: "Destination and name are required", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("areas").insert([
      {
        destination: newArea.destination as "cape_town" | "durban" | "hartbeespoort" | "magaliesburg" | "mpumalanga" | "sun_city",
        name: newArea.name,
        description: newArea.description || null,
      },
    ]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Area added successfully" });
      setNewArea({ destination: "", name: "", description: "" });
      fetchAreas();
    }
  };

  const handleDeleteArea = async (id: string) => {
    const { error } = await supabase.from("areas").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Area deleted" });
      fetchAreas();
    }
  };

  const groupedAreas = areas.reduce((acc, area) => {
    if (!acc[area.destination]) {
      acc[area.destination] = [];
    }
    acc[area.destination].push(area);
    return acc;
  }, {} as Record<string, Area[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Areas</CardTitle>
        <CardDescription>
          Manage the specific areas within each destination where hotels are located.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Area */}
        <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
          <Select value={newArea.destination} onValueChange={(v) => setNewArea({ ...newArea, destination: v })}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Destination" />
            </SelectTrigger>
            <SelectContent>
              {DESTINATIONS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Area name"
            value={newArea.name}
            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
            className="w-[200px]"
          />
          <Input
            placeholder="Description (optional)"
            value={newArea.description}
            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
            className="flex-1 min-w-[200px]"
          />
          <Button onClick={handleAddArea} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Area
          </Button>
        </div>

        {/* Areas by Destination */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {DESTINATIONS.map((dest) => {
              const destAreas = groupedAreas[dest.value] || [];
              return (
                <div key={dest.value}>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    {dest.label}
                    <Badge variant="secondary">{destAreas.length} areas</Badge>
                  </h3>
                  {destAreas.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No areas defined</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {destAreas.map((area) => (
                          <TableRow key={area.id}>
                            <TableCell className="font-medium">{area.name}</TableCell>
                            <TableCell className="text-muted-foreground">{area.description || "-"}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteArea(area.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
