'use client'

import { PageHero, ContentSection } from "@/components/site/PageHero";
import { EventColumns } from "@/components/site/EventColumns";
import { CallToAction } from "@/components/site/CallToAction";
import { BookingFinder } from "@/components/site/BookingFinder";
import { Manifesto } from "@/components/site/Manifesto";

export function ServicesView({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <PageHero
        eyebrow="Our Services"
        title="Sound, space,"
        italic="and moment."
        description="From the first note to the last dance. DJ sets, photo booths, mobile event vans, full AV production - everything your event needs, under one roof."
        ctaLabel="Check Availability"
        ctaTo="/booking"
        navigate={navigate}
      />

      {/* Event type columns - Weddings, Corporate, Nightclub, Festivals */}
      <EventColumns navigate={navigate} />

      {/* Three signature offerings - DJ Services, Photo Booth, Mobile Event Van */}
      <CallToAction navigate={navigate} />

      {/* Booking finder tool */}
      <BookingFinder navigate={navigate} />

      {/* Philosophy / manifesto */}
      <Manifesto />
    </>
  );
}
