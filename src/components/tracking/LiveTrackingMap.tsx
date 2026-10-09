"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface Location {
  lat: number;
  lng: number;
}

interface LiveTrackingMapProps {
  customerLocation?: Location;
  professionalLocation?: Location;
}

export function LiveTrackingMap({ customerLocation, professionalLocation }: LiveTrackingMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Loaded from env
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  // Default to a central location if none provided (e.g., Agra for prototype)
  const defaultCenter = { lat: 27.1767, lng: 78.0081 };
  const center = customerLocation || defaultCenter;

  const fetchDirections = useCallback(() => {
    if (!customerLocation || !professionalLocation || !window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: professionalLocation,
        destination: customerLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [customerLocation, professionalLocation]);

  useEffect(() => {
    if (isLoaded && customerLocation && professionalLocation) {
      fetchDirections();
    }
  }, [isLoaded, customerLocation, professionalLocation, fetchDirections]);

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-slate-100 flex items-center justify-center rounded-[16px]">
        <p className="text-slate-500 font-medium">Loading Live Map Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-[16px] overflow-hidden shadow-sm border border-slate-200">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {/* Render Route if we have directions */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true, // We will use our custom markers
              polylineOptions: {
                strokeColor: "#2563EB",
                strokeWeight: 5,
                strokeOpacity: 0.8,
              },
            }}
          />
        )}

        {/* Customer Home Marker */}
        {customerLocation && (
          <Marker
            position={customerLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            title="Your Home"
          />
        )}

        {/* Professional Live Marker */}
        {professionalLocation && (
          <Marker
            position={professionalLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#2563EB",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#ffffff",
            }}
            title="Professional"
          />
        )}
      </GoogleMap>
    </div>
  );
}
