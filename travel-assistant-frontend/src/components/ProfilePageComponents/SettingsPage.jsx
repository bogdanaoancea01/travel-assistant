import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { usePreferences } from "../../utilities/usePreferences";

const CURRENCIES = [
  { code: "EUR", label: "Euro" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "CHF", label: "Swiss Franc" },
  { code: "RON", label: "Romanian Leu" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "CAD", label: "Canadian Dollar" },
];

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 px-1">
      {children}
    </p>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
      {children}
    </div>
  );
}

function Row({ icon, label, value, isSet, onEdit, editLabel }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className={`text-xs mt-0.5 truncate ${isSet ? "text-gray-600" : "text-gray-400"}`}>
          {value}
        </p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {editLabel}
        </button>
      )}
    </div>
  );
}

function InlineForm({ children, onSave, onCancel, onDelete }) {
  return (
    <div className="px-4 py-5">
      <div className="flex flex-col gap-2">{children}</div>
      <div className="flex gap-2 mt-6">
        <button
          onClick={onCancel}
          className="px-5 py-1.5 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-5 py-1.5 border border-gray-200 rounded-full text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Save
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-5 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

function inputCls() {
  return "border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-gray-50 w-full max-w-xs";
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { preferences, loading, savePreferences, deleteField } = usePreferences();
  const [activeSection, setActiveSection] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
  });
  const [passwordData, setPasswordData] = useState({
    current: "", next: "", confirm: "",
  });

  const navigate = useNavigate();
  const username = user?.email?.split("@")[0] ?? "";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const openPref = (id, initial) => { setFormValues(initial); setActiveSection(id); };
  const closePref = () => setActiveSection(null);

  const handleChangePassword = async () => {
    if (!passwordData.next || !passwordData.current) return;
    if (passwordData.next !== passwordData.confirm) {
      alert("New passwords do not match.");
      return;
    }
    const token = sessionStorage.getItem("token");
    const res = await fetch("https://localhost:7063/api/authentication/change-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: passwordData.current, newPassword: passwordData.next }),
    });
    if (res.ok) {
      setPasswordData({ current: "", next: "", confirm: "" });
      setActiveSection(null);
    } else {
      const err = await res.text();
      alert(err || "Failed to update password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your account and all your data.")) return;
    const token = sessionStorage.getItem("token");
    const res = await fetch("https://localhost:7063/api/authentication/delete-account", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      logout();
      navigate("/home");
    } else {
      alert("Failed to delete account. Please try again.");
    }
  };

  const handlePrefSave = async () => {
    await savePreferences({ ...preferences, ...formValues });
    closePref();
  };

  const handlePrefDelete = async (keys) => {
    for (const key of keys) await deleteField(key);
    closePref();
  };

  const prefFields = [
    {
      id: "home",
      label: "Home city",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
      getValue: (p) => p?.homeCity ?? null,
      getInitial: (p) => ({ homeCity: p?.homeCity ?? "" }),
      deleteKeys: ["homeCity"],
      placeholder: "e.g. Cluj-Napoca",
      renderInput: () => (
        <input type="text" placeholder="e.g. Cluj-Napoca" value={formValues.homeCity ?? ""}
          onChange={(e) => setFormValues((p) => ({ ...p, homeCity: e.target.value || null }))}
          className={inputCls()} />
      ),
    },
    {
      id: "airport",
      label: "Airport",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 17H2a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2z"/><path d="M2.5 13.5L9 15l3 1 8-4.5c1.5-.8 1.5-2.5 0-2.5-1 0-2 .5-2 .5l-4 2-4.5-5.5H7L8.5 12 5 11 3.5 9H2L2.5 13.5z"/></svg>,
      getValue: (p) => p?.preferredAirportName ?? null,
      getInitial: (p) => ({ preferredAirportName: p?.preferredAirportName ?? "" }),
      deleteKeys: ["preferredAirportName"],
      renderInput: () => (
        <input type="text" placeholder="e.g. Cluj International" value={formValues.preferredAirportName ?? ""}
          onChange={(e) => setFormValues((p) => ({ ...p, preferredAirportName: e.target.value || null }))}
          className={inputCls()} />
      ),
    },
    {
      id: "currency",
      label: "Currency",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      getValue: (p) => p?.preferredCurrency ? `${CURRENCIES.find(c => c.code === p.preferredCurrency)?.label ?? ""} — ${p.preferredCurrency}` : null,
      getInitial: (p) => ({ preferredCurrency: p?.preferredCurrency ?? "" }),
      deleteKeys: ["preferredCurrency"],
      renderInput: () => (
        <select value={formValues.preferredCurrency ?? ""}
          onChange={(e) => setFormValues((p) => ({ ...p, preferredCurrency: e.target.value || null }))}
          className={inputCls()}>
          <option value="">Select currency</option>
          {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label} — {c.code}</option>)}
        </select>
      ),
    },
    {
      id: "tripduration",
      label: "Trip duration",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      getValue: (p) => (p?.tripDurationMin != null && p?.tripDurationMax != null) ? `${p.tripDurationMin}–${p.tripDurationMax} days` : null,
      getInitial: (p) => ({ tripDurationMin: p?.tripDurationMin ?? 3, tripDurationMax: p?.tripDurationMax ?? 7 }),
      deleteKeys: ["tripduration"],
      renderInput: () => (
        <div className="flex flex-col gap-3 max-w-xs">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Min: <strong>{formValues.tripDurationMin ?? 3} days</strong></span>
            <span>Max: <strong>{formValues.tripDurationMax ?? 7} days</strong></span>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-400">Minimum</label>
            <input type="range" min={1} max={14} value={formValues.tripDurationMin ?? 3}
              onChange={(e) => setFormValues((p) => ({ ...p, tripDurationMin: Math.min(+e.target.value, p.tripDurationMax ?? 7) }))}
              className="w-full accent-gray-900" />
            <label className="text-xs text-gray-400">Maximum</label>
            <input type="range" min={1} max={14} value={formValues.tripDurationMax ?? 7}
              onChange={(e) => setFormValues((p) => ({ ...p, tripDurationMax: Math.max(+e.target.value, p.tripDurationMin ?? 3) }))}
              className="w-full accent-gray-900" />
            <div className="flex justify-between text-xs text-gray-300">
              <span>1</span><span>7</span><span>14</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "trippace",
      label: "Trip pace",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
      getValue: (p) => p?.tripPace ?? null,
      getInitial: (p) => ({ tripPace: p?.tripPace ?? "" }),
      deleteKeys: ["trippace"],
      renderInput: () => (
        <div className="flex gap-2">
          {["Relaxed", "Balanced", "Intensive"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, tripPace: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.tripPace === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "travelstyles",
      label: "Travel style",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      getValue: (p) => p?.travelStyles ?? null,
      getInitial: (p) => ({ travelStyles: p?.travelStyles ?? "" }),
      deleteKeys: ["travelstyles"],
      renderInput: () => {
        const selected = (formValues.travelStyles ?? "").split(",").map(s => s.trim()).filter(Boolean);
        const toggle = (style) => {
          const next = selected.includes(style)
            ? selected.filter(s => s !== style)
            : [...selected, style];
          setFormValues((p) => ({ ...p, travelStyles: next.join(", ") || null }));
        };
        return (
          <div className="flex flex-wrap gap-2 max-w-xs">
            {["Adventure", "Cultural", "Food & Drink", "Nature", "Nightlife", "Wellness", "Shopping"].map((style) => (
              <button key={style} type="button" onClick={() => toggle(style)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  selected.includes(style)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}>
                {style}
              </button>
            ))}
          </div>
        );
      },
    },
    {
      id: "travelcompanions",
      label: "Travel companions",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      getValue: (p) => p?.travelCompanions ?? null,
      getInitial: (p) => ({ travelCompanions: p?.travelCompanions ?? "" }),
      deleteKeys: ["travelcompanions"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap">
          {["Solo", "Couple", "Family", "Friends"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, travelCompanions: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.travelCompanions === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "tripmotivation",
      label: "Trip motivation",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
      getValue: (p) => p?.tripMotivation ?? null,
      getInitial: (p) => ({ tripMotivation: p?.tripMotivation ?? "" }),
      deleteKeys: ["tripmotivation"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["Recharge & relax", "Adventure & adrenaline", "Discover & learn", "Connect & celebrate"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, tripMotivation: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.tripMotivation === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "climatepreference",
      label: "Climate",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
      getValue: (p) => p?.climatePreference ?? null,
      getInitial: (p) => ({ climatePreference: p?.climatePreference ?? "" }),
      deleteKeys: ["climatepreference"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["Warm & sunny", "Mild & temperate", "Cool & crisp", "Cold & snowy", "No preference"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, climatePreference: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.climatePreference === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "transport",
      label: "Getting around",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="3" width="16" height="13" rx="2"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="7" y1="16" x2="7" y2="16.01"/><line x1="17" y1="16" x2="17" y2="16.01"/></svg>,
      getValue: (p) => p?.transport ?? null,
      getInitial: (p) => ({ transport: p?.transport ?? "" }),
      deleteKeys: ["transport"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["Rental car / road trip", "Public transport", "Walkable & compact", "No preference"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, transport: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.transport === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "preferredsetting",
      label: "Setting",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
      getValue: (p) => p?.preferredSetting ?? null,
      getInitial: (p) => ({ preferredSetting: p?.preferredSetting ?? "" }),
      deleteKeys: ["preferredsetting"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["City", "Small towns & villages", "Nature", "Mix of city & nature"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, preferredSetting: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.preferredSetting === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "planningstyle",
      label: "Planning style",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      getValue: (p) => p?.planningStyle ?? null,
      getInitial: (p) => ({ planningStyle: p?.planningStyle ?? "" }),
      deleteKeys: ["planningstyle"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["Fully planned", "Loosely planned", "Spontaneous"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, planningStyle: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.planningStyle === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: "preferredregions",
      label: "Regions",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      getValue: (p) => p?.preferredRegions ?? null,
      getInitial: (p) => ({ preferredRegions: p?.preferredRegions ?? "" }),
      deleteKeys: ["preferredregions"],
      renderInput: () => {
        const selected = (formValues.preferredRegions ?? "").split(",").map(s => s.trim()).filter(Boolean);
        const toggle = (region) => {
          const next = selected.includes(region)
            ? selected.filter(s => s !== region)
            : [...selected, region];
          setFormValues((p) => ({ ...p, preferredRegions: next.join(", ") || null }));
        };
        return (
          <div className="flex flex-wrap gap-2 max-w-xs">
            {["Europe", "Southeast Asia", "East Asia", "Middle East & North Africa", "Sub-Saharan Africa", "North America", "Latin America & Caribbean", "South Asia", "Oceania & Pacific"].map((r) => (
              <button key={r} type="button" onClick={() => toggle(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  selected.includes(r)
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}>
                {r}
              </button>
            ))}
          </div>
        );
      },
    },
    {
      id: "travelfrequency",
      label: "Travel frequency",
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 17H2a1 1 0 0 0 0 2h20a1 1 0 0 0 0-2z"/><path d="M2.5 13.5L9 15l3 1 8-4.5c1.5-.8 1.5-2.5 0-2.5-1 0-2 .5-2 .5l-4 2-4.5-5.5H7L8.5 12 5 11 3.5 9H2L2.5 13.5z"/></svg>,
      getValue: (p) => p?.travelFrequency ?? null,
      getInitial: (p) => ({ travelFrequency: p?.travelFrequency ?? "" }),
      deleteKeys: ["travelfrequency"],
      renderInput: () => (
        <div className="flex gap-2 flex-wrap max-w-xs">
          {["Once a year or less", "2–3 times a year", "4–6 times a year", "More than 6 times a year"].map((opt) => (
            <button key={opt} type="button"
              onClick={() => setFormValues((p) => ({ ...p, travelFrequency: opt }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                formValues.travelFrequency === opt
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}>
              {opt}
            </button>
          ))}
        </div>
      ),
    },

  ];

  return (
    <div className="space-y-8">

      {/* ── Profile ── */}
      <div>
        <SectionLabel>Profile</SectionLabel>
        <Card>
          {/* Avatar row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">@{username}</p>
              <button className="text-xs text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                Change photo
              </button>
            </div>
            <button
              onClick={() => { logout(); navigate("/home"); }}
              className="shrink-0 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Log out
            </button>
          </div>

          {/* First name */}
          {activeSection === "firstName" ? (
            <InlineForm
              onSave={() => { setActiveSection(null); }}
              onCancel={() => setActiveSection(null)}
            >
              <label className="text-xs font-medium text-gray-500">First name</label>
              <input type="text" value={profileData.firstName}
                onChange={(e) => setProfileData((p) => ({ ...p, firstName: e.target.value }))}
                className={inputCls()} />
            </InlineForm>
          ) : (
            <Row icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              label="First name" value={profileData.firstName || "Not set"}
              isSet={!!profileData.firstName}
              onEdit={() => setActiveSection("firstName")} editLabel="Edit" />
          )}

          {/* Last name */}
          {activeSection === "lastName" ? (
            <InlineForm
              onSave={() => setActiveSection(null)}
              onCancel={() => setActiveSection(null)}
            >
              <label className="text-xs font-medium text-gray-500">Last name</label>
              <input type="text" value={profileData.lastName}
                onChange={(e) => setProfileData((p) => ({ ...p, lastName: e.target.value }))}
                className={inputCls()} />
            </InlineForm>
          ) : (
            <Row icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              label="Last name" value={profileData.lastName || "Not set"}
              isSet={!!profileData.lastName}
              onEdit={() => setActiveSection("lastName")} editLabel="Edit" />
          )}

          {/* Bio */}
          {activeSection === "bio" ? (
            <InlineForm
              onSave={handlePrefSave}
              onCancel={closePref}
              onDelete={preferences?.bio ? () => handlePrefDelete(["bio"]) : null}
            >
              <label className="text-xs font-medium text-gray-500">Bio</label>
              <textarea
                value={formValues.bio ?? ""}
                maxLength={500}
                placeholder="e.g. I travel solo, prefer slow-paced trips with local food and history..."
                onChange={(e) => setFormValues((p) => ({ ...p, bio: e.target.value || null }))}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-gray-50 w-full max-w-xs h-28 resize-none"
              />
            </InlineForm>
          ) : (
            <Row
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>}
              label="Bio"
              value={preferences?.bio || "Not set"}
              isSet={!!preferences?.bio}
              onEdit={() => openPref("bio", { bio: preferences?.bio ?? "" })}
              editLabel={preferences?.bio ? "Edit" : "Add"}
            />
          )}
        </Card>
      </div>

      {/* ── Security ── */}
      <div>
        <SectionLabel>Security</SectionLabel>
        <Card>
          {/* Email — read only */}
          <Row
            icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            label="Email"
            value={<>{user?.email ?? "—"} <span className="text-emerald-600 text-xs font-medium">verified</span></>}
            isSet={true}
          />

          {/* Password */}
          {activeSection === "password" ? (
            <InlineForm
              onSave={handleChangePassword}
              onCancel={() => setActiveSection(null)}
            >
              <label className="text-xs font-medium text-gray-500">Current password</label>
              <input type="password" value={passwordData.current} placeholder="Current password"
                onChange={(e) => setPasswordData((p) => ({ ...p, current: e.target.value }))}
                className={inputCls()} />
              <label className="text-xs font-medium text-gray-500 mt-1">New password</label>
              <input type="password" value={passwordData.next} placeholder="New password"
                onChange={(e) => setPasswordData((p) => ({ ...p, next: e.target.value }))}
                className={inputCls()} />
              <label className="text-xs font-medium text-gray-500 mt-1">Confirm password</label>
              <input type="password" value={passwordData.confirm} placeholder="Confirm new password"
                onChange={(e) => setPasswordData((p) => ({ ...p, confirm: e.target.value }))}
                className={inputCls()} />
            </InlineForm>
          ) : (
            <Row
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              label="Password" value="Update your password" isSet={false}
              onEdit={() => setActiveSection("password")} editLabel="Change" />
          )}
        </Card>
      </div>

      {/* ── Travel preferences ── */}
      <div>
        <SectionLabel>Travel preferences</SectionLabel>
        {loading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <Card>
            {prefFields.map((field) => {
              const currentValue = field.getValue(preferences);
              const isSet = !!currentValue;
              const isEditing = activeSection === field.id;

              return isEditing ? (
                <InlineForm key={field.id}
                  onSave={handlePrefSave}
                  onCancel={closePref}
                  onDelete={isSet ? () => handlePrefDelete(field.deleteKeys) : null}
                >
                  <label className="text-xs font-medium text-gray-500">{field.label}</label>
                  {field.renderInput()}
                </InlineForm>
              ) : (
                <Row key={field.id}
                  icon={field.icon}
                  label={field.label}
                  value={isSet ? currentValue : "Not set"}
                  isSet={isSet}
                  onEdit={() => openPref(field.id, field.getInitial(preferences))}
                  editLabel={isSet ? "Edit" : "Add"} />
              );
            })}
          </Card>
        )}
      </div>

      {/* ── Delete account ── */}
      <div>
        <SectionLabel>Delete account</SectionLabel>
        <div className="bg-white border border-red-100 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-500">Delete my account</p>
              <p className="text-xs text-gray-400 mt-0.5">Permanently removes all your data</p>
            </div>
            <button onClick={handleDeleteAccount} className="shrink-0 text-xs font-medium text-red-500 bg-red-50 border border-red-100 rounded-full px-3 py-1.5 hover:bg-red-100 transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}