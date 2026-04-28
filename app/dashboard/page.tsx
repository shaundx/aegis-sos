"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [status, setStatus] = useState("SYSTEM READY");

  // Function to mark an incident as resolved in Supabase
  const resolveIncident = async (id: string) => {
    const { error } = await supabase
      .from('incidents')
      .update({ status: 'resolved' })
      .eq('id', id);

    if (!error) {
      setAlerts((prev) => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('incidents') 
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) setAlerts(data);
    };

    fetchInitialData();

    const channel = supabase
      .channel('incident-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAlerts((prev) => [payload.new, ...prev]);
          setStatus("AI ANALYZING CRISIS...");
          setTimeout(() => {
            setStatus("DISPATCH COMPLETE");
            setTimeout(() => setStatus("SYSTEM READY"), 3000);
          }, 4000);
        } else if (payload.eventType === 'UPDATE') {
          setAlerts((prev) => prev.map(a => a.id === payload.new.id ? payload.new : a));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-cyan-400 p-4 sm:p-8 font-mono">
      <div className="flex justify-between items-center border-b border-cyan-900 pb-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter text-white">AEGIS COMMAND</h1>
          <p className="text-[10px] text-cyan-700 tracking-[0.3em]">SECURE SECTOR 07</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <div className={`w-2 h-2 rounded-full ${status === 'SYSTEM READY' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-ping'}`} />
            <p className="text-xs sm:text-sm font-bold tracking-widest uppercase">{status}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {alerts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-xl bg-slate-900/10">
            <p className="text-slate-600 tracking-[0.5em] animate-pulse">AWAITING FIELD DATA</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`bg-slate-900 border-l-8 ${alert.status === 'resolved' ? 'border-green-500 opacity-60' : 'border-red-600'} p-6 rounded-lg transition-all duration-500`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`${alert.status === 'resolved' ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest`}>
                  {alert.status || 'Active'}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-slate-500 text-xs tabular-nums">{new Date(alert.created_at).toLocaleTimeString()}</span>
                    <span className="text-slate-700 text-[10px]">ID: {alert.id.slice(0,8)}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">EMERGENCY TRIGGERED</h2>
                  <p className="text-lg text-cyan-100">LOCATION: <span className="text-cyan-400 font-bold">{alert.floor_level}</span></p>
                </div>
                {alert.status !== 'resolved' && (
                  <button 
                    onClick={() => resolveIncident(alert.id)}
                    className="bg-transparent border border-cyan-700 hover:bg-cyan-900 text-cyan-400 px-4 py-2 text-xs font-bold transition-colors"
                  >
                    MARK RESOLVED
                  </button>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px]">
                <div className="flex gap-4">
                  <div><span className="text-slate-500">LAT:</span> {alert.latitude}</div>
                  <div><span className="text-slate-500">LONG:</span> {alert.longitude}</div>
                </div>
                <div className={`${alert.status === 'resolved' ? 'text-green-500' : 'text-cyan-600'} font-bold uppercase tracking-widest`}>
                  {alert.status === 'resolved' ? 'Archive Log Stored' : 'AI Tactical Briefing Dispatched'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="fixed bottom-4 right-8 opacity-20 pointer-events-none text-right">
        <p className="text-[10px]">GEMINI 2.5 FLASH ANALYTICS ACTIVE</p>
        <p className="text-[10px]">GOOGLE SOLUTION CHALLENGE 2026</p>
      </div>
    </div>
  );
}