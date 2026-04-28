"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GuestSOS() {
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

const triggerSOS = () => {
    setStatus("loading");

    if (!navigator.geolocation) {
      console.warn("Geolocation missing, using fallback.");
      pushToDatabase(12.9716, 77.5946, "Lobby (Fallback)"); // Bengaluru coordinates
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        pushToDatabase(latitude, longitude, "Lobby");
      },
      (error) => {
        console.warn("Location blocked by OS/Browser. Using fallback to save demo.", error);
        pushToDatabase(12.9716, 77.5946, "Lobby (Fallback)");
      },
      { timeout: 10000 } // Give up and use fallback if it takes longer than 10s
    );
  };

// Helper function to keep code clean
  const pushToDatabase = async (lat: number, lng: number, floor: string) => {
    // 1. Push to Database
    const { error } = await supabase.from("incidents").insert([
      { latitude: lat, longitude: lng, floor_level: floor },
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      setStatus("error");
      return; // Stop if database fails
    } 
    
    setStatus("sent");

    // 2. Trigger the SMS Escalation
    try {
      await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floor_level: floor }),
      });
      console.log("SMS API triggered.");
    } catch (err) {
      console.error("Failed to trigger SMS API", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">AEGIS</h1>
      <p className="text-gray-400 mb-12 text-center">Emergency Rapid Response System</p>

      <button
        onClick={triggerSOS}
        disabled={status !== "idle"}
        className={`w-64 h-64 rounded-full text-4xl font-black shadow-2xl transition-all duration-300 ${
          status === "idle"
            ? "bg-red-600 hover:bg-red-500 shadow-red-600/50 hover:scale-105 active:scale-95"
            : status === "sent"
            ? "bg-green-600 shadow-green-600/50"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        {status === "idle" && "SOS"}
        {status === "loading" && "LOCATING..."}
        {status === "sent" && "DISPATCHED"}
        {status === "error" && "FAILED"}
      </button>

      {status === "sent" && (
        <p className="mt-8 text-green-400 font-semibold animate-pulse">
          Stay calm. Help is on the way.
        </p>
      )}
    </div>
  );
}