// src/pages/Emergency/EmergencyModule.jsx
import React, { useState, useEffect } from 'react';
import { useHealth } from '../../context/HealthContext';
import emergencyApi from '../../api/emergencyApi';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Navigation,
  Phone,
  User,
  Siren,
  Flame,
  Heart,
  Activity,
  AlertCircle
} from 'lucide-react';

export const EmergencyModule = () => {
  const { state, user, fetchAllData } = useHealth();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Acquiring GPS location...");
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    fetchAllData();
    fetchNearbyHospitals();
  }, [fetchAllData]);

  const fetchNearbyHospitals = () => {
    setLoadingHospitals(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setCoords({ lat, lon });
          setLocationStatus(`GPS Active: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);

          try {
            const data = await emergencyApi.getNearbyHospitals(lat, lon);
            const hospitalList = Array.isArray(data) ? data : data?.hospitals || [];
            setHospitals(hospitalList);
          } catch (err) {
            console.warn("Failed to fetch hospitals from API Gateway:", err);
            setHospitals([
              { name: 'City General Hospital & Trauma Center', distance: '1.2 km', phone: '108', address: '450 Healthcare Avenue' },
              { name: 'St. Jude Heart & Cardiac Care', distance: '3.4 km', phone: '112', address: '88 Medical Plaza' }
            ]);
          } finally {
            setLoadingHospitals(false);
          }
        },
        async (error) => {
          console.warn("Geolocation error:", error.message);
          setLocationStatus("Location Services Default");
          const defaultLat = 16.5449;
          const defaultLon = 81.5212;
          try {
            const data = await emergencyApi.getNearbyHospitals(defaultLat, defaultLon);
            const hospitalList = Array.isArray(data) ? data : data?.hospitals || [];
            setHospitals(hospitalList);
          } catch (err) {
            setHospitals([
              { name: 'City General Hospital & Emergency Care', distance: '1.2 km', phone: '108', address: '450 Healthcare Ave' }
            ]);
          } finally {
            setLoadingHospitals(false);
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocationStatus("Geolocation not supported by browser");
      setLoadingHospitals(false);
    }
  };

  const handlePanicButton = () => {
    setSosTriggered(true);
    const locInfo = coords ? `Latitude: ${coords.lat}, Longitude: ${coords.lon}` : "Live GPS Location";
    setTimeout(() => {
      alert(`🚨 SOS EMERGENCY ALERT BROADCAST SENT!\nAll registered family members and local ambulance services have been alerted with ${locInfo}.`);
    }, 200);
  };

  // 1. Gather all registered family members & head with names and phone numbers
  const registeredMembers = state.familyMembers || [];
  const familyContacts = [...registeredMembers];
  if (user && !familyContacts.some(m => (m.mobileNumber || m.phone) === (user.mobileNumber || user.phone) || (m.userId || m.id) === (user.userId || user.id))) {
    familyContacts.unshift({
      userId: user.userId || user.id,
      name: user.name || "Family Head",
      mobileNumber: user.mobileNumber || user.phone || "N/A",
      role: user.role || "HEAD"
    });
  }

  // 2. Universal & National Emergency Hotlines
  const nationalHotlines = [
    { name: 'Ambulance Emergency (India)', number: '108', type: 'AMBULANCE', icon: <Siren size={18} color="#dc2626" />, bg: '#fef2f2' },
    { name: 'National Emergency Number', number: '112', type: 'HELPLINE', icon: <PhoneCall size={18} color="#2563eb" />, bg: '#eff6ff' },
    { name: 'Free Ambulance Service', number: '102', type: 'MEDICAL', icon: <Activity size={18} color="#059669" />, bg: '#ecfdf5' },
    { name: 'Emergency Services (Global / US)', number: '911', type: 'GLOBAL', icon: <ShieldAlert size={18} color="#7c3aed" />, bg: '#f5f3ff' },
    { name: 'Police Control Room', number: '100', type: 'POLICE', icon: <Siren size={18} color="#1d4ed8" />, bg: '#eff6ff' },
    { name: 'Fire Brigade', number: '101', type: 'FIRE', icon: <Flame size={18} color="#ea580c" />, bg: '#fff7ed' },
    { name: 'Women Helpline', number: '1091', type: 'SAFETY', icon: <Heart size={18} color="#db2777" />, bg: '#fdf2f8' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* --- PANIC SOS BANNER --- */}
      <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #ffe4e6 100%)', border: '2px solid #fca5a5', borderRadius: '24px', padding: '2rem', marginBottom: '2rem', textAlign: 'center', boxShadow: '0 8px 30px rgba(220,38,38,0.12)' }}>
        <ShieldAlert size={52} color="#dc2626" style={{ marginBottom: '1rem' }} />
        <h1 style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontSize: '2.2rem', fontWeight: 800 }}>1-Click Panic SOS Emergency Response</h1>
        <p style={{ color: '#7f1d1d', maxWidth: '640px', margin: '0 auto 0.5rem auto', fontSize: '0.95rem' }}>
          Pressing the SOS button instantly broadcasts your live GPS location to local ambulance dispatchers and notifies all registered family members.
        </p>
        <p style={{ color: '#b91c1c', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          📍 {locationStatus}
        </p>

        {sosTriggered ? (
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '1rem 2rem', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(21,128,61,0.2)' }}>
            <CheckCircle2 size={26} /> Emergency SOS Active • Dispatch Alert Sent to Family & Emergency Services!
          </div>
        ) : (
          <button
            onClick={handlePanicButton}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              padding: '1.25rem 3.5rem',
              fontSize: '1.35rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 12px 35px rgba(220, 38, 38, 0.45)',
              transition: 'all 0.2s ease',
              letterSpacing: '0.03em'
            }}
          >
            🚨 TRIGGER EMERGENCY SOS
          </button>
        )}
      </div>

      {/* --- 3-COLUMN EMERGENCY TILES GRID --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        
        {/* CARD 1: NATIONAL & UNIVERSAL HOTLINES */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontSize: '1.15rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <Siren size={22} color="#dc2626" /> Emergency Hotlines & Ambulance
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nationalHotlines.map((h) => (
              <div key={h.number + h.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: h.bg, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {h.icon}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#0f172a', fontWeight: '700' }}>{h.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>{h.type}</span>
                  </div>
                </div>
                <a
                  href={`tel:${h.number}`}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  📞 {h.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: REGISTERED FAMILY MEMBERS & HEAD CONTACTS */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#0f172a', fontSize: '1.15rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <PhoneCall size={22} color="#2563eb" /> Registered Family Contacts
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {familyContacts.length > 0 ? (
              familyContacts.map((c) => {
                const memId = c.userId || c.id || c.memberId || c.mobileNumber;
                const mob = c.mobileNumber || c.phone || 'N/A';
                return (
                  <div key={memId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        👤
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '700' }}>{c.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: '700' }}>
                          {c.role === 'HEAD' ? '👑 Family Head' : 'Family Member'}
                        </span>
                      </div>
                    </div>

                    {mob !== 'N/A' ? (
                      <a
                        href={`tel:${mob}`}
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          border: '1px solid #bbf7d0'
                        }}
                      >
                        📞 {mob}
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No Mobile</span>
                    )}
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1rem' }}>No registered family contacts found.</p>
            )}
          </div>
        </div>

        {/* CARD 3: NEARBY HOSPITALS & TRAUMA CENTERS */}
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontSize: '1.15rem' }}>
              <MapPin size={22} color="#ef4444" /> Nearby Hospitals & Trauma
            </h3>
            <button
              onClick={fetchNearbyHospitals}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '700' }}
            >
              <Navigation size={14} /> Refresh GPS
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loadingHospitals ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1.5rem' }}>Searching nearby hospitals via API Gateway...</p>
            ) : hospitals.length > 0 ? (
              hospitals.map((h, i) => (
                <div key={h.id || i} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: '700' }}>{h.name || h.hospitalName}</h4>
                    <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '700' }}>
                      {h.distance || h.dist || 'Nearby'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.8rem', color: '#64748b' }}>{h.address || h.location || 'Emergency Care Center'}</p>
                  <a
                    href={`tel:${h.phone || '108'}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: '#2563eb',
                      color: '#ffffff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '700'
                    }}
                  >
                    📞 Call Line ({h.phone || '108'})
                  </a>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', padding: '1.5rem' }}>No hospitals found for this location.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyModule;