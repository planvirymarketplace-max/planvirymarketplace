import { AmenityId } from "../constants/amenities";
import { AmenityDB } from "@/lib/types/amenities";

export function parseAmenitiesFromDB(amenitiesDB: AmenityDB[]): AmenityId[] {
  return amenitiesDB.map((amenityDB) => amenityDB.amenities.id);
}
