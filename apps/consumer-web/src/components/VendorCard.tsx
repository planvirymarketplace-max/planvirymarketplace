'use client';

import React from 'react';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface VendorCardProps {
  key?: React.Key | number | string;
  id?: number | string;
  slug?: string;
  name: string;
  category: string;
  categoryName?: string;
  subCategory?: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  imageUrl: string;
  featured?: boolean;
  instant?: boolean;
}

export default function VendorCard({
  slug,
  name,
  category,
  location,
  rating,
  reviews,
  price,
  imageUrl,
  featured,
  instant,
}: VendorCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white flex flex-col hover:shadow-md transition-shadow">
      <div className="relative h-48 flex-shrink-0 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {featured && (
            <span className="bg-coral text-white text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              Featured
            </span>
          )}
          {instant && (
            <span className="bg-teal-500 text-black text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
              Instant Book
            </span>
          )}
        </div>

        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
          <Heart className="w-5 h-5 text-white" />
        </button>

        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-sm font-semibold">
          {price}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg text-black truncate max-w-[80%]">{name}</h3>
          <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-sm">
            <Star className="w-3.5 h-3.5 fill-coral text-coral" />
            <span className="font-medium text-black">{rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 truncate">
          {category} &middot; {location}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          Professional and highly-rated services tailored to make your event unforgettable.
        </p>

        <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
          <Link
            href={slug ? `/v/${slug}` : `/v/${slugify(name)}`}
            className="flex-1 border border-coral text-coral font-medium py-2 rounded-xl hover:bg-coral/10 transition-colors text-sm text-center"
          >
            View Profile
          </Link>
          <Link
            href={slug ? `/v/${slug}` : `/v/${slugify(name)}`}
            className="flex-1 bg-black text-white font-medium py-2 rounded-xl hover:bg-teal-600 transition-colors text-sm text-center"
          >
            {instant ? 'Instant Book' : 'Get Proposal'}
          </Link>
        </div>
      </div>
    </div>
  );
}
