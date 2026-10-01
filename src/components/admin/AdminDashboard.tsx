import React, { useState, useEffect } from 'react';
import { backendStore } from '../../services/backendStore';
import type { RideRequest, FareConfig, CampusLocation } from '../../types/ride';
import type { RiderProfile } from '../../types/user';
import type { VoiceAgentEvent } from '../../types/voice';
import { MapView } from '../common/MapView';
import { StatusBadge } from '../common/StatusBadge';
import { Shield, Plus } from 'lucide-react';
import { BRANDING } from '../../constants/branding';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'riders' | 'locations' | 'fares' | 'voicelogs' | 'sql'>('overview');
  const [rides, setRides] = useState<RideRequest[]>(backendStore.getRides());
  const [rider, setRider] = useState<RiderProfile>(backendStore.getRiderProfile());
  const [fareConfig, setFareConfig] = useState<FareConfig>(backendStore.getFareConfig());
  const [locations, setLocations] = useState<CampusLocation[]>(backendStore.getCampusLocations());
  const [voiceLogs, setVoiceLogs] = useState<VoiceAgentEvent[]>(backendStore.getVoiceLogs());

  // Location Form state
  const [newLocName, setNewLocName] = useState('');
  const [newLocDesc, setNewLocDesc] = useState('');
  const [newLocLat, setNewLocLat] = useState('6.5180');
  const [newLocLng, setNewLocLng] = useState('3.3910');
  const [newLocCategory] = useState<CampusLocation['category']>('academic');

  useEffect(() => {
    const update = () => {
      setRides(backendStore.getRides());
      setRider(backendStore.getRiderProfile());
      setFareConfig(backendStore.getFareConfig());
      setLocations(backendStore.getCampusLocations());
      setVoiceLogs(backendStore.getVoiceLogs());
    };
    update();
    return backendStore.subscribe(update);
  }, []);

  const totalRevenue = rides
    .filter((r) => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.fare.totalFare, 0);

  const activeRidesCount = rides.filter((r) =>
    ['REQUESTED', 'SEARCHING', 'OFFERED', 'ACCEPTED', 'RIDER_EN_ROUTE', 'ARRIVED', 'TRIP_STARTED'].includes(r.status)
  ).length;

  const handleUpdateFares = (e: React.FormEvent) => {
    e.preventDefault();
    backendStore.updateFareConfig(fareConfig);
    alert('Fare Engine parameters updated successfully.');
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName) return;
    backendStore.addCampusLocation({
      name: newLocName,
      description: newLocDesc || 'Campus Landmark',
      category: newLocCategory,
      latitude: parseFloat(newLocLat),
      longitude: parseFloat(newLocLng),
      isPopular: true
    });
    setNewLocName('');
    setNewLocDesc('');
  };

  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* Admin Title Bar */}
      <div className="bg-[#071F17] text-white p-5 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#DFF5EA]" />
            <h2 className="text-xl font-black tracking-tight">{BRANDING.appName} Control Tower</h2>
          </div>
          <p className="text-xs text-emerald-200">
            Realtime Campus Mobility Administration & AI Voice Agent Logs
          </p>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex flex-wrap gap-1 bg-[#0B6B4B]/40 p-1.5 rounded-2xl border border-[#0B6B4B]">
          {[
            { id: 'overview', label: 'Live Overview' },
            { id: 'riders', label: 'Riders' },
            { id: 'locations', label: 'Locations' },
            { id: 'fares', label: 'Fare Engine' },
            { id: 'voicelogs', label: 'Voice AI Logs' },
            { id: 'sql', label: 'Database SQL' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0B6B4B] text-white shadow-xs'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-[#E2E6E0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                Active Campus Rides
              </span>
              <span className="text-3xl font-black text-[#0B6B4B] block">{activeRidesCount}</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#E2E6E0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                Total Platform Revenue
              </span>
              <span className="text-3xl font-black text-[#071F17] block">
                ₦{totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#E2E6E0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                Registered Riders
              </span>
              <span className="text-3xl font-black text-amber-600 block">1</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-[#E2E6E0] shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
                Voice Agent Events
              </span>
              <span className="text-3xl font-black text-blue-600 block">{voiceLogs.length}</span>
            </div>
          </div>

          {/* Live Campus Map */}
          <div className="bg-white rounded-3xl p-3 shadow-sm border border-[#E2E6E0] space-y-2">
            <div className="flex items-center justify-between px-2 pt-1">
              <h3 className="font-extrabold text-sm text-[#071F17]">Live Campus Dispatch Map</h3>
              <span className="text-xs font-bold text-[#0B6B4B]">● Realtime Synchronized</span>
            </div>
            <MapView height="340px" />
          </div>

          {/* Recent Rides Table */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-3">
            <h3 className="font-extrabold text-sm text-[#071F17]">Recent Ride Activity</h3>
            {rides.length === 0 ? (
              <p className="text-xs text-gray-700 py-4 text-center">No ride activity recorded yet.</p>
            ) : (
              <div className="divide-y divide-gray-100 text-xs">
                {rides.slice(0, 5).map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#071F17]">
                        {r.pickup.name} → {r.destination.name}
                      </p>
                      <p className="text-gray-700 text-[11px]">
                        Student: {r.student.name} • Rider: {r.rider?.name || 'Unassigned'}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <StatusBadge status={r.status} />
                      <span className="block font-black text-[#0B6B4B]">
                        ₦{r.fare.totalFare.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RIDERS TAB */}
      {activeTab === 'riders' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-4">
          <h3 className="font-extrabold text-base text-[#071F17]">Registered Campus Motorcycle Riders</h3>
          <div className="p-4 bg-[#F7F8F5] rounded-2xl border border-[#E2E6E0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={rider.avatarUrl}
                alt={rider.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#0B6B4B]"
              />
              <div>
                <h4 className="font-extrabold text-sm text-[#071F17]">{rider.name}</h4>
                <p className="text-xs text-gray-800">
                  Bike: {rider.bikeModel} ({rider.bikePlateNumber})
                </p>
                <p className="text-[11px] text-gray-800 font-semibold">
                  Rating: ⭐ {rider.rating} • Completed: {rider.completedRidesCount} rides
                </p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <span className="inline-block bg-[#DFF5EA] text-[#0B6B4B] text-xs font-bold px-2.5 py-1 rounded-full border border-[#0B6B4B]/20">
                VERIFIED RIDER
              </span>
              <div className="text-xs font-bold text-gray-800">
                Status: {rider.isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOCATIONS TAB */}
      {activeTab === 'locations' && (
        <div className="space-y-4">
          {/* Add Location Form */}
          <form onSubmit={handleAddLocation} className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-3">
            <h3 className="font-extrabold text-sm text-[#071F17]">Add Campus Landmark / Pickup Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Landmark Name (e.g. Science Complex)"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-semibold"
                required
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newLocDesc}
                onChange={(e) => setNewLocDesc(e.target.value)}
                className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-semibold"
              />
              <input
                type="text"
                placeholder="Latitude (e.g. 6.5180)"
                value={newLocLat}
                onChange={(e) => setNewLocLat(e.target.value)}
                className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-semibold"
              />
              <input
                type="text"
                placeholder="Longitude (e.g. 3.3910)"
                value={newLocLng}
                onChange={(e) => setNewLocLng(e.target.value)}
                className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-semibold"
              />
            </div>
            <button
              type="submit"
              className="bg-[#0B6B4B] hover:bg-[#071F17] text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Landmark
            </button>
          </form>

          {/* Locations Table */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-3">
            <h3 className="font-extrabold text-sm text-[#071F17]">Configured Campus Pickup Points</h3>
            <div className="divide-y divide-gray-100 text-xs">
              {locations.map((loc) => (
                <div key={loc.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#071F17]">📍 {loc.name}</span>
                    <p className="text-gray-800 text-[11px]">{loc.description}</p>
                  </div>
                  <button
                    onClick={() => backendStore.deleteCampusLocation(loc.id)}
                    className="text-red-700 font-bold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FARES TAB */}
      {activeTab === 'fares' && (
        <form onSubmit={handleUpdateFares} className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-4 max-w-lg mx-auto">
          <h3 className="font-extrabold text-base text-[#071F17]">Configurable Fare Engine Settings</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Base Fare (₦)</label>
              <input
                type="number"
                value={fareConfig.baseFare}
                onChange={(e) => setFareConfig({ ...fareConfig, baseFare: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Price Per Kilometer (₦/km)</label>
              <input
                type="number"
                value={fareConfig.pricePerKm}
                onChange={(e) => setFareConfig({ ...fareConfig, pricePerKm: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Minimum Fare Floor (₦)</label>
              <input
                type="number"
                value={fareConfig.minimumFare}
                onChange={(e) => setFareConfig({ ...fareConfig, minimumFare: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-bold text-sm"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Peak Hour Surge Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={fareConfig.peakMultiplier}
                onChange={(e) => setFareConfig({ ...fareConfig, peakMultiplier: Number(e.target.value) })}
                className="w-full p-3 rounded-xl bg-[#F7F8F5] border border-[#E2E6E0] font-bold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0B6B4B] hover:bg-[#071F17] text-white font-bold py-3.5 rounded-2xl shadow-md transition-all text-xs"
          >
            Save Fare Engine Parameters
          </button>
        </form>
      )}

      {/* VOICE AI LOGS TAB */}
      {activeTab === 'voicelogs' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-3">
          <h3 className="font-extrabold text-base text-[#071F17]">AI Voice Agent Event Audit Feed</h3>
          {voiceLogs.length === 0 ? (
            <p className="text-xs text-gray-700 py-4 text-center">No voice events logged yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs font-mono max-h-96 overflow-y-auto">
              {voiceLogs.map((log) => (
                <div key={log.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-700 font-sans">
                    <span className="font-bold text-[#0B6B4B]">
                      [{log.eventCategory}] Lang: {log.language.toUpperCase()}
                    </span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {log.inputSpeech && (
                    <p className="text-gray-800">
                      <span className="text-amber-800 font-bold">Rider Input:</span> "{log.inputSpeech}" (Intent: {log.detectedIntent}, Conf: {log.confidence})
                    </p>
                  )}
                  <p className="text-[#071F17] font-semibold">
                    <span className="text-[#0B6B4B] font-bold">Agent Output:</span> "{log.agentResponse}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DATABASE SQL TAB */}
      {activeTab === 'sql' && (
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#E2E6E0] space-y-3">
          <h3 className="font-extrabold text-base text-[#071F17]">Supabase PostgreSQL Schema (SQL Script)</h3>
          <p className="text-xs text-gray-800 font-medium">
            This SQL script builds all required relational tables (profiles, rides, rider_profiles, bikes, voice_agent_events, etc.) on PostgreSQL.
          </p>
          <pre className="bg-[#071F17] text-emerald-300 p-4 rounded-2xl text-[11px] overflow-x-auto max-h-96 font-mono border border-[#0B6B4B]">
            {`-- SHUTTLEX PRODUCTION SCHEMA
CREATE TABLE public.profiles ( id UUID PRIMARY KEY, role TEXT, full_name TEXT, phone_number TEXT );
CREATE TABLE public.rides ( id UUID PRIMARY KEY, student_id UUID, rider_id UUID, pickup_name TEXT, destination_name TEXT, status TEXT, total_fare NUMERIC );
CREATE TABLE public.voice_agent_events ( id UUID PRIMARY KEY, rider_id UUID, input_speech TEXT, detected_intent TEXT, agent_response TEXT );
-- Full schema file saved at /src/SQL/supabase_schema.sql`}
          </pre>
        </div>
      )}
    </div>
  );
};
