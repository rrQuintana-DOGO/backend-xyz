-- DropForeignKey
ALTER TABLE "trip_has_drivers" DROP CONSTRAINT "trip_has_drivers_id_trip_fkey";

-- DropForeignKey
ALTER TABLE "trip_has_events" DROP CONSTRAINT "trip_has_events_id_trip_fkey";

-- DropForeignKey
ALTER TABLE "trips_has_places" DROP CONSTRAINT "trips_has_places_id_trip_fkey";

-- DropForeignKey
ALTER TABLE "trips_has_units" DROP CONSTRAINT "trips_has_units_id_trip_fkey";

-- AddForeignKey
ALTER TABLE "trip_has_drivers" ADD CONSTRAINT "trip_has_drivers_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trip_has_events" ADD CONSTRAINT "trip_has_events_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips_has_places" ADD CONSTRAINT "trips_has_places_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips_has_units" ADD CONSTRAINT "trips_has_units_id_trip_fkey" FOREIGN KEY ("id_trip") REFERENCES "trips"("id_trip") ON DELETE CASCADE ON UPDATE NO ACTION;
