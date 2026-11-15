import { useState, useEffect } from "react";

export interface TravelSearchState {
  destination: string;
  travelDate: string;
  adults: number;
  kids: number;
  kidAges: number[];
}

const STORAGE_KEY = "travel_affordable_search";

export function useTravelSearch(defaultDestination = "cape-town") {
  const [searchState, setSearchState] = useState<TravelSearchState>(() => {
    if (typeof window === "undefined") {
      return { destination: defaultDestination, travelDate: "", adults: 2, kids: 0, kidAges: [] };
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...parsed, destination: defaultDestination };
      }
    } catch (e) {
      // fallback
    }
    return { destination: defaultDestination, travelDate: "", adults: 2, kids: 0, kidAges: [] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searchState));
    } catch (e) {
      // ignore
    }
  }, [searchState]);

  const updateSearch = (updates: Partial<TravelSearchState>) => {
    setSearchState((prev) => ({ ...prev, ...updates }));
  };

  const setKidsCount = (kids: number) => {
    setSearchState((prev) => {
      const newAges = Array.from({ length: kids }, (_, i) => prev.kidAges[i] ?? 6);
      return { ...prev, kids, kidAges: newAges };
    });
  };

  const setKidAge = (index: number, age: number) => {
    setSearchState((prev) => {
      const updatedAges = [...prev.kidAges];
      updatedAges[index] = age;
      return { ...prev, kidAges: updatedAges };
    });
  };

  return {
    searchState,
    updateSearch,
    setKidsCount,
    setKidAge,
  };
}
