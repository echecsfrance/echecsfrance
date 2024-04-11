import { useEffect, useTransition } from "react";

import { useSetAtom } from "jotai";
import L from "leaflet";
import { useMapEvent } from "react-leaflet";

import { mapBoundsAtom } from "@/atoms";

const worldBounds = L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180));
const franceBounds = L.latLngBounds(
  L.latLng(42.08, -5.12),
  L.latLng(51.17, 9.53),
);

type MapEventsProps = {
  bounds?: L.LatLngBounds;
  updateMapBoundsAtom?: boolean;
};

export const MapEvents = ({
  bounds = franceBounds,
  updateMapBoundsAtom = false,
}: MapEventsProps) => {
  const setMapBounds = useSetAtom(mapBoundsAtom);
  const [isPending, startTransition] = useTransition();

  const map = useMapEvent("moveend", () => {
    if (!updateMapBoundsAtom) return;

    // Set the map bounds atoms when the user pans/zooms
    startTransition(() => {
      setMapBounds(map.getBounds());
    });
  });

  // Viewport agnostic centering of France & max world bounds
  useEffect(() => {
    const zoom = map.getBoundsZoom(bounds);
    map.setView(bounds.getCenter(), zoom === Infinity ? 10 : zoom);
    map.setMaxBounds(worldBounds);
    map.options.maxBoundsViscosity = 1.0; // Prevents going past bounds while dragging
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
