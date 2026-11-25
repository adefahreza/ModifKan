"use client";

import { useCallback, useState } from "react";
import { Lock } from "lucide-react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import PhotoCard from "./PhotoCard";

// Kolom kiri: kartu foto profil + tombol Ganti Password. Kolom kanan berganti antara biodata (lihat/edit) dan form password.
export default function ProfileSettings({ user }) {
  const [mode, setMode] = useState("view"); // view | edit | password
  const [session, setSession] = useState(0); // dinaikkan tiap masuk mode baru agar form dipasang ulang bersih
  const enter = (next) => { setSession((n) => n + 1); setMode(next); };
  const backToView = useCallback(() => setMode("view"), []);

  return (
    <div className="grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <div className="space-y-3">
        <PhotoCard name={user.name} avatar={user.avatar} />
        <button type="button" onClick={() => enter("password")} aria-pressed={mode === "password"}
          className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-bold ring-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${mode === "password" ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-900 ring-slate-300 hover:bg-slate-50"}`}>
          <Lock size={18} aria-hidden="true" /> <span className="flex-1 text-center">Ganti Password</span>
        </button>
      </div>

      <div className="min-w-0">
        {mode === "password"
          ? <PasswordForm key={`p${session}`} onDone={backToView} />
          : <ProfileForm key={`f${session}`} user={user} editing={mode === "edit"} onEdit={() => enter("edit")} onDone={backToView} />}
      </div>
    </div>
  );
}
