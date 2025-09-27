/** biome-ignore-all assist/source/organizeImports: ignore this */
/** biome-ignore-all lint/a11y/noLabelWithoutControl: ignore this */
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../../lib/supabaseClient";

export default function Onboard() {
  const { user } = useUser();
  const [rf_id, setRfId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, phone, rf_id")
        .eq("clerk_id", user.id)
        .single();

      if (!error && data) {
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setRfId(data.rf_id || "");
      }
    };

    fetchUser();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !rf_id || !fullName || !email) {
      setMessage("RF ID, name, and email are required.");
      return;
    }

    const { error } = await supabase.from("users").upsert(
      {
        clerk_id: user.id,
        rf_id,
        full_name: fullName,
        email,
        phone: phone.startsWith("+91") ? phone : `+91${phone}`,
      },
      { onConflict: "clerk_id" },
    );

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("User onboarded successfully!");
    }
  };

  if (!user)
    return <p className="text-center mt-10">Please sign in to onboard.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Onboard User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Phone (+91)</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+919XXXXXXXXX"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">RF ID</label>
          <input
            type="text"
            value={rf_id}
            onChange={(e) => setRfId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Onboard
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
