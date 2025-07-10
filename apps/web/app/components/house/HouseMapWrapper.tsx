"use client";

import dynamic from "next/dynamic";

const HouseMap = dynamic(() => import("@/components/house/HouseMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-200 flex items-center justify-center rounded-lg">
      <p>Loading map...</p>
    </div>
  ),
});

interface HouseMapWrapperProps {
  coordinates: [number, number];
  title: string;
  address: string;
}

export default function HouseMapWrapper({
  coordinates,
  title,
  address,
}: HouseMapWrapperProps) {
  return <HouseMap coordinates={coordinates} title={title} address={address} />;
}
