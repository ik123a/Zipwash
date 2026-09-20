import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import api, { slotService } from '../../services/api';
import {
  CalendarDays, Clock, Shirt, Loader2, CheckCircle,
  Plus, Minus, WashingMachine, Info, MapPin
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────
const CLOTHES_ITEMS = [
  { id: 'shirt',    label: 'Shirts',     emoji: '👕' },
  { id: 'pant',     label: 'Pants',      emoji: '👖' },
  { id: 'tshirt',   label: 'T-Shirts',   emoji: '👔' },
  { id: 'socks',    label: 'Socks',      emoji: '🧦' },
  { id: 'underwear',label: 'Underwear',  emoji: '🩲' },
  { id: 'towel',    label: 'Towels',     emoji: '🏖️' },
  { id: 'bedsheet', label: 'Bedsheets',  emoji: '🛏️' },
  { id: 'jacket',   label: 'Jackets',    emoji: '🧥' },
];

/** Generate 30-minute slots from 09:00 to 21:00 */
function generateTimeSlots() {
  const slots = [];
  for (let h = 9; h < 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 21 && m > 30) break;
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}
const ALL_SLOTS = generateTimeSlots();

/** Format "HH:MM" → "10:30 AM" */
function formatSlot(time) {
  if (!time) return '';
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${ampm}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────
const s = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 50, overflowY: 'auto',
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 12px',
  },
  modal: {
    width: '100%', maxWidth: 520,
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 24, overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  header: {
    padding: '24px 28px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', alignItems: 'center', gap: 16,
    background: 'linear-gradient(135deg, rgba(30,27,75,0.5) 0%, transparent 100%)',
  },
  iconBox: {
    width: 48, height: 48, borderRadius: 14,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 8px 16px -4px rgba(99, 102, 241, 0.4)',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  inputGroup: {
    display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20,
  },
  select: {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff', fontSize: 14, appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px',
  },
  option: {
    background: '#0f172a',
    color: '#fff',
    padding: '8px 12px',
    fontSize: 14,
  },
  dayBtn: (active) => ({
    flex: 1, padding: '12px 8px', borderRadius: 14, cursor: 'pointer',
    background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
    border: active ? '2px solid #6366f1' : '1px solid rgba(255,255,255,0.08)',
    color: active ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
    transition: 'all 0.2s', textAlign: 'center',
  }),
  clothesRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  counter: {
    display: 'flex', alignItems: 'center', gap: 12,
  },
  counterBtn: {
    width: 32, height: 32, borderRadius: 10, border: 'none', cursor: 'pointer',
    background: 'rgba(255,255,255,0.08)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
  },
  submitBtn: (disabled) => ({
    width: '100%', padding: '16px', borderRadius: 14, border: 'none',
    background: disabled ? 'rgba(99,102,241,0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff', fontWeight: 700, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 10px 20px -5px rgba(99,102,241,0.5)',
    transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  }),
};

export function SubmitLaundry({ onSuccess, onClose, initialMachineId = null }) {
  const today = new Date();
  const DAY_OPTIONS = [
    { label: 'Today',     sub: format(today, 'MMM d'), date: today },
    { label: 'Tomorrow',  sub: format(addDays(today, 1), 'MMM d'), date: addDays(today, 1) },
    { label: '+2 Days',   sub: format(addDays(today, 2), 'MMM d'), date: addDays(today, 2) },
  ];

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedMachineId, setSelectedMachineId] = useState(initialMachineId || '');
  const [selectedTime, setSelectedTime]     = useState('');
  const [machines, setMachines]             = useState([]);
  const [bookedTimes, setBookedTimes]       = useState([]);
  const [clothes, setClothes]               = useState({});
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);

  const selectedDate = DAY_OPTIONS[selectedDayIdx].date;
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const totalClothes = Object.values(clothes).reduce((a, b) => a + b, 0);

  // Initial Fetch: Machines
  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await api.get('/machines');
        setMachines(res.data);
      } catch (err) {
        toast.error('Failed to load machines');
      }
    };
    fetchMachines();
  }, []);

  // Fetch booked slots whenever day or machine changes
  const fetchBookings = useCallback(async () => {
    if (!selectedMachineId) return;
    setLoading(true);
    try {
      const booked = await slotService.getBookedSlots(dateStr, selectedMachineId);
      setBookedTimes(booked);
    } catch {
      setBookedTimes([]);
    } finally {
      setLoading(false);
    }
  }, [dateStr, selectedMachineId]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const adjustClothes = (id, delta) => {
    if (delta > 0 && totalClothes >= 10) {
      toast.error('Maximum 10 clothes per submission.');
      return;
    }
    setClothes(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleSubmit = async () => {
    if (!selectedMachineId) { toast.error('Please select a machine'); return; }
    if (!selectedTime) { toast.error('Please select a time slot'); return; }

    setSubmitting(true);
    try {
      // 1. Book specific machine and time
      await slotService.bookSlot(dateStr, selectedTime, selectedMachineId);

      // 2. Submit laundry entry if clothes were added
      if (totalClothes > 0) {
        await api.post('/student/laundry', { number_of_clothes: totalClothes });
      }

      toast.success(totalClothes > 0 
        ? `✅ Laundry & Machine confirmed!` 
        : `✅ Machine reserved for ${formatSlot(selectedTime)}`);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || 'Action failed. Please try again.';
      toast.error(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = selectedMachineId && selectedTime;
  const selectedMachine = machines.find(m => m.id.toString() === selectedMachineId.toString());

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal} className="animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div style={s.header}>
          <div style={s.iconBox}>
            <WashingMachine size={24} color="#fff" />
          </div>
          <div className="flex-1">
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: 0 }}>Book Machine</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
              Pick time, machine, and add laundry
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Day Picker */}
          <div>
            <p style={s.sectionTitle}><CalendarDays size={14} /> 1. Pick a Day</p>
            <div style={{ display: 'flex', gap: 12 }}>
              {DAY_OPTIONS.map((d, i) => (
                <button
                  key={i} style={s.dayBtn(selectedDayIdx === i)}
                  onClick={() => setSelectedDayIdx(i)}
                >
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{d.label}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{d.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Machine Selection */}
            <div>
              <p style={s.sectionTitle}><WashingMachine size={14} /> 2. Select Machine</p>
              <select 
                style={s.select}
                value={selectedMachineId}
                onChange={(e) => setSelectedMachineId(e.target.value)}
              >
                <option value="">Choose Machine</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id} disabled={m.status === 'offline'}>
                    {m.machine_number} ({m.machine_type}) {m.status === 'offline' ? '- Offline' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Selection */}
            <div>
              <p style={s.sectionTitle}><Clock size={14} /> 3. Select Time</p>
              <select 
                style={s.select}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={!selectedMachineId}
              >
                <option value="">{selectedMachineId ? 'Choose Time' : 'Select Machine First'}</option>
                {ALL_SLOTS.map(slot => {
                  const booked = bookedTimes.includes(slot);
                  return (
                    <option key={slot} value={slot} disabled={booked}>
                      {formatSlot(slot)} {booked ? '(Booked)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {selectedMachine && selectedTime && (
            <div style={{ 
              padding: '12px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.1)', 
              border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', gap: 12
            }}>
              <Info size={16} className="text-indigo-400" />
              <div>
                <p style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600 }}>
                  Reserving {selectedMachine.machine_number} at {formatSlot(selectedTime)}
                </p>
                <p style={{ color: 'rgba(165,180,252,0.6)', fontSize: 11 }}>
                  Located in {selectedMachine.location || 'Block A'}
                </p>
              </div>
            </div>
          )}

          {/* Clothes Selector */}
          <div>
            <p style={s.sectionTitle}><Shirt size={14} /> 4. Add Laundry (Optional)</p>
            <div style={{ 
              maxHeight: 180, overflowY: 'auto', paddingRight: 8, 
              display: 'flex', flexDirection: 'column' 
            }} className="pr-2 custom-scrollbar">
              {CLOTHES_ITEMS.map(item => {
                const count = clothes[item.id] || 0;
                return (
                  <div key={item.id} style={s.clothesRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="text-xl">{item.emoji}</span>
                      <span style={{ color: count > 0 ? '#fff' : 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                        {item.label}
                      </span>
                    </div>
                    <div style={s.counter}>
                      <button
                        style={{ ...s.counterBtn, opacity: count === 0 ? 0.3 : 1 }}
                        onClick={() => adjustClothes(item.id, -1)}
                        disabled={count === 0}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ color: count > 0 ? '#6366f1' : 'rgba(255,255,255,0.4)', fontWeight: 800, minWidth: 20, textAlign: 'center' }}>
                        {count}
                      </span>
                      <button
                        style={{ ...s.counterBtn, opacity: totalClothes >= 10 ? 0.3 : 1 }}
                        onClick={() => adjustClothes(item.id, 1)}
                        disabled={totalClothes >= 10}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            style={s.submitBtn(!isComplete || submitting)}
            disabled={!isComplete || submitting}
            onClick={handleSubmit}
          >
            {submitting
              ? <><Loader2 size={20} className="animate-spin" /> Processing...</>
              : <><CheckCircle size={20} /> Confirm Booking &amp; Submit</>
            }
          </button>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
