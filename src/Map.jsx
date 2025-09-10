import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ darkMode, mapData, onViewAnalytics }) => (
  <div className={`h-full relative overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
    <MapContainer center={[20, 65]} zoom={4} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url={darkMode
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
      />
      {mapData.floats.map(float => (
        <Marker key={float.id} position={[float.lat, float.lon]}>
          <Popup>
            <div>
              <strong>{float.id}</strong><br />
              Temp: {float.temp}°C<br />
              Salinity: {float.salinity}<br />
              Status: {float.status}<br />
              <button
                style={{
                  marginTop: '8px',
                  padding: '4px 8px',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => onViewAnalytics(float.id)}
              >
                View Analytics
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default Map;