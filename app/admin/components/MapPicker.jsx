'use client';

import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function MapPicker({ lat, lng, onChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState({ lat: lat || 6.8741, lng: lng || 81.0456 });

  useEffect(() => {
    setPosition({ lat: lat || 6.8741, lng: lng || 81.0456 });
  }, [lat, lng]);

  useEffect(() => {
    // Only initialize once
    if (mapInstanceRef.current || !mapRef.current) return;

    const L = require('leaflet');

    // Fix default icon
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView([position.lat, position.lng], 13);
    
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
    }).addTo(map);

    const marker = L.marker([position.lat, position.lng]).addTo(map);
    markerRef.current = marker;

    map.on('click', (e) => {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      marker.setLatLng(e.latlng);
      setPosition(newPos);
      if (onChange) {
        onChange(newPos.lat, newPos.lng);
      }
    });

    mapInstanceRef.current = map;

    // Ensure map tiles render properly
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker when position changes from parent
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
  }, [position]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '350px', width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }} 
    />
  );
}
