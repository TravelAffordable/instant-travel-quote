// Official star grading for Umhlanga properties (null = ungraded)
export const umhlangaHotelStars: Record<string, number | null> = {
  'Hilton Garden Inn Umhlanga Arch': 4,
  'Protea Hotel by Marriott Durban Umhlanga': 4,
  'The Capital Pearls Hotel': 4,
  'BlackBrick Umhlanga Rocks': null,
  'Premier Splendid Inn Umhlanga': 3,
  'Holiday Inn Express Durban - Umhlanga': 3,
  'Holiday Inn Express Durban Umhlanga': 3,
  'Radisson Blu Hotel, Durban Umhlanga': 4,
  'Radisson Blu Hotel Durban Umhlanga': 4,
};

export function getUmhlangaHotelStars(name: string): number | null | undefined {
  return umhlangaHotelStars[name];
}
