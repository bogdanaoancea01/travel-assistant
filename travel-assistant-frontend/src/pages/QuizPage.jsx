import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";

const API = "https://localhost:7063/api/quiz/submit";


const QUESTIONS = {
  companions: {
    id: "companions",
    question: "Who do you usually travel with?",
    options: ["Solo", "Couple", "Family", "Friends"],
    next: () => "motivation",
  },
  motivation: {
    id: "motivation",
    question: "What does a perfect trip give you?",
    options: [
      "Recharge & relax — rest, slow mornings, no rush",
      "Adventure & adrenaline — activity and a challenge",
      "Discover & learn — history, culture, new ideas",
      "Connect & celebrate — people, food, good times",
    ],
    next: () => "interests",
  },
  interests: {
    id: "interests",
    question: "What pulls you towards a place? Pick everything that fits.",
    options: [
      "Adventure & Outdoors",
      "Culture & History",
      "Food & Drink",
      "Nature & Wildlife",
      "Beaches & Water",
      "Nightlife & Entertainment",
      "Wellness & Spa",
      "Art & Architecture",
      "Shopping & Markets",
    ],
    multi: true,
    next: () => "climate",
  },
  climate: {
    id: "climate",
    question: "What weather makes you happiest on a trip?",
    options: ["Warm & sunny", "Mild & temperate", "Cool & crisp", "Cold & snowy", "No preference"],
    next: () => "pace",
  },
  pace: {
    id: "pace",
    question: "How do you like to spend your travel days?",
    options: [
      "Relaxed — 2-3 things a day, lots of downtime",
      "Balanced — 4-5 activities, some flexibility",
      "Intensive — see as much as humanly possible",
    ],
    next: (answer) => (answer.startsWith("Relaxed") ? "budget_relaxed" : "budget_active"),
  },
  budget_relaxed: {
    id: "budget",
    question: "What's your typical travel budget per day?",
    options: ["Under €50 (Budget)", "€50–150 (Mid-range)", "€150–300 (Comfort)", "€300+ (Luxury)"],
    next: () => "accommodation",
  },
  budget_active: {
    id: "budget",
    question: "When you're out exploring, how do you like to spend?",
    options: [
      "Keep it lean — hostels and street food",
      "Mid-range — solid hotels, local restaurants",
      "Comfort — boutique stays, nice dinners",
      "Luxury — the best of everything",
    ],
    next: () => "accommodation",
  },
  accommodation: {
    id: "accommodation",
    question: "Where do you like to rest your head?",
    options: [
      "Hostels & guesthouses",
      "Comfortable mid-range hotels",
      "Boutique & character stays",
      "Luxury resorts",
      "Apartments & local rentals",
    ],
    next: () => "meals",
  },
  meals: {
    id: "meals",
    question: "How do you like to eat when you travel?",
    options: [
      "Street food & hole-in-the-wall local spots",
      "A mix of casual and nicer meals",
      "Fine dining & memorable reservations",
      "Mostly self-catering / cook my own",
    ],
    next: () => "dietary",
  },
  dietary: {
    id: "dietary",
    question: "Any dietary needs we should always respect?",
    options: [
      "No restrictions",
      "Vegetarian",
      "Vegan",
      "Pescatarian",
      "Halal",
      "Kosher",
      "Gluten-free",
      "Nut allergy",
    ],
    multi: true,
    next: () => "transport",
  },
  transport: {
    id: "transport",
    question: "How do you like to get around once you're there?",
    options: ["Rental car / road trip", "Public transport", "Walkable & compact", "No preference"],
    next: () => "duration",
  },
  duration: {
    id: "duration",
    question: "How long are your typical trips?",
    options: [
      "Weekend getaways (2-3 days)",
      "Short trips (4-5 days)",
      "Week-long (6-8 days)",
      "Extended travel (9-14 days)",
    ],
    next: () => "homeCity",
  },
  homeCity: {
    id: "homeCity",
    question: "Where do you usually set off from?",
    hint: "Helps us judge travel times and distances. Optional.",
    type: "text",
    placeholder: "e.g. Cluj-Napoca",
    next: () => null,
  },
};

const TOTAL_STEPS = 12;
const DURATION_MAP = {
  "Weekend getaways (2-3 days)": [2, 3],
  "Short trips (4-5 days)": [4, 5],
  "Week-long (6-8 days)": [6, 8],
  "Extended travel (9-14 days)": [9, 14],
};

function PreferenceRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 text-center">{icon}</span>
      <span className="text-xs text-gray-400 w-24 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
  );
}

function ArchetypeResult({ result, onContinue }) {
  const p = result.inferredPreferences ?? {};

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </div>

      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Your travel personality</p>
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">{result.archetypeName}</h2>
      <p className="text-gray-500 leading-relaxed mb-6">{result.archetypeDescription}</p>

      <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Your inferred preferences</p>
        {p.tripMotivation && <PreferenceRow icon="🎯" label="Looking for" value={p.tripMotivation} />}
        {p.budgetRange && <PreferenceRow icon="💰" label="Budget" value={p.budgetRange} />}
        {p.tripPace && <PreferenceRow icon="⏱️" label="Pace" value={p.tripPace} />}
        {p.travelCompanions && <PreferenceRow icon="👥" label="Companions" value={p.travelCompanions} />}
        {p.travelStyles && <PreferenceRow icon="✨" label="Interests" value={p.travelStyles} />}
        {p.climatePreference && <PreferenceRow icon="🌤️" label="Climate" value={p.climatePreference} />}
        {p.accommodationStyle && <PreferenceRow icon="🏨" label="Stay" value={p.accommodationStyle} />}
        {p.mealPreference && <PreferenceRow icon="🍽️" label="Food" value={p.mealPreference} />}
        {p.dietaryNeeds && <PreferenceRow icon="🥗" label="Dietary" value={p.dietaryNeeds} />}
        {p.transport && <PreferenceRow icon="🚆" label="Getting around" value={p.transport} />}
        {p.tripDurationMin != null && p.tripDurationMax != null && (
          <PreferenceRow icon="📅" label="Trip length" value={`${p.tripDurationMin}–${p.tripDurationMax} days`} />
        )}
        {p.homeCity && <PreferenceRow icon="📍" label="Departing" value={p.homeCity} />}
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
      >
        Explore personalised destinations →
      </button>
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [stepKey, setStepKey] = useState("companions");
  const [history, setHistory] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const question = QUESTIONS[stepKey];
  const progress = Math.min(100, Math.round(((history.length + 1) / TOTAL_STEPS) * 100));

  const toggleMulti = (option) => {
    setSelected((prev) => {
      if (stepKey === "dietary") {
        if (option === "No restrictions") return prev.includes(option) ? [] : ["No restrictions"];
        const withoutNone = prev.filter((o) => o !== "No restrictions");
        return withoutNone.includes(option)
          ? withoutNone.filter((o) => o !== option)
          : [...withoutNone, option];
      }
      return prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option];
    });
  };

  const advance = (answerValue) => {
    const newAnswers = { ...answers, [question.id]: answerValue };
    setAnswers(newAnswers);

    const nextKey = question.next(answerValue);
    setHistory((h) => [...h, stepKey]);
    setSelected([]);
    setTextValue("");

    if (!nextKey) {
      submitQuiz(newAnswers);
    } else {
      setStepKey(nextKey);
    }
  };

  const handleSelect = (option) => {
    if (question.multi) toggleMulti(option);
    else advance(option);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevKey = history[history.length - 1];
    const prevQuestion = QUESTIONS[prevKey];

    setHistory((h) => h.slice(0, -1));
    setStepKey(prevKey);

    const prior = answers[prevQuestion.id];
    if (prevQuestion.multi) {
      setSelected(prior ? prior.split(",").map((s) => s.trim()).filter(Boolean) : []);
      setTextValue("");
    } else if (prevQuestion.type === "text") {
      setTextValue(prior ?? "");
      setSelected([]);
    } else {
      setSelected([]);
      setTextValue("");
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setLoading(true);
    setError(false);

    const durationAnswer = finalAnswers.duration;
    if (durationAnswer && DURATION_MAP[durationAnswer]) {
      const [min, max] = DURATION_MAP[durationAnswer];
      finalAnswers = { ...finalAnswers, duration: `${min}-${max} days` };
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setResult(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = (chatId) => {
    sessionStorage.removeItem("currentChatId");
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { initialChatId: chatId ?? null } });
  };

  const handleChatSelect = (chatId) => {
    sessionStorage.removeItem("currentMessages");
    sessionStorage.removeItem("activeTrip");
    navigate("/chat", { state: { initialChatId: chatId } });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenuWhole onNewChat={handleNewChat} onChatSelect={handleChatSelect} />

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-2xl mx-auto px-8 py-12">

          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
              <p className="text-sm text-gray-400">Analysing your travel personality...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
              <p className="text-gray-400">Something went wrong. Please try again.</p>
              <button onClick={() => setError(false)} className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm cursor-pointer">
                Try again
              </button>
            </div>
          )}

          {result && !loading && !error && (
            <ArchetypeResult result={result} onContinue={() => navigate("/explore")} />
          )}

          {!result && !loading && !error && (
            <>
              {/* Header + progress */}
              <div className="mb-10">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Travel personality quiz</p>
                <h1 className="text-2xl font-semibold text-gray-900">What kind of traveller are you?</h1>

                <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">Step {history.length + 1} of {TOTAL_STEPS}</p>
                  {history.length > 0 && (
                    <button onClick={handleBack} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                      ← Back
                    </button>
                  )}
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900">{question.question}</h2>
                {question.multi && <p className="text-sm text-gray-400 mt-1">Select all that apply</p>}
                {question.hint && <p className="text-sm text-gray-400 mt-1">{question.hint}</p>}
              </div>

              {/* Text question (home city) */}
              {question.type === "text" ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    autoFocus
                    value={textValue}
                    placeholder={question.placeholder}
                    onChange={(e) => setTextValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && advance(textValue.trim())}
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 bg-gray-50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => advance("")}
                      className="px-6 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => advance(textValue.trim())}
                      className="flex-1 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Finish →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = selected.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => handleSelect(option)}
                          className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Multi-select confirm */}
                  {question.multi && selected.length > 0 && (
                    <button
                      onClick={() => advance(selected.join(", "))}
                      className="w-full mt-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      Continue →
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
