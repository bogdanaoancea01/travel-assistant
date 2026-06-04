import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideMenuWhole from "../components/SideMenuComponents/SideMenuWhole";

const API = "https://localhost:7063/api/quiz/submit";

const QUESTIONS = {
  companions: {
    id: "companions",
    question: "Who do you usually travel with?",
    emoji: "👥",
    options: ["Solo", "Couple", "Family", "Friends"],
    next: () => "pace",
  },
  pace: {
    id: "pace",
    question: "How do you like to spend your travel days?",
    emoji: "⏱️",
    options: ["Relaxed — 2-3 activities, lots of downtime", "Balanced — 4-5 activities, some flexibility", "Intensive — see as much as possible"],
    next: (answer) => answer.startsWith("Relaxed") ? "budget_relaxed" : "budget_active",
  },
  budget_relaxed: {
    id: "budget",
    question: "What's your typical travel budget per day?",
    emoji: "💰",
    options: ["Under €50 (Budget)", "€50–150 (Mid-range)", "€150–300 (Comfort)", "€300+ (Luxury)"],
    next: () => "style",
  },
  budget_active: {
    id: "budget",
    question: "When you're busy exploring, how do you spend?",
    emoji: "💰",
    options: ["Keep it lean — hostels and street food", "Mid-range — good hotels, local restaurants", "Comfort — boutique stays, nice dinners", "Luxury — the best of everything"],
    next: () => "style",
  },
  style: {
    id: "style",
    question: "What draws you to a destination? Pick your top interests.",
    emoji: "✨",
    options: ["Adventure & Outdoors", "Culture & History", "Food & Drink", "Nature & Wildlife", "Nightlife & Entertainment", "Wellness & Relaxation"],
    multi: true,
    next: () => "duration",
  },
  duration: {
    id: "duration",
    question: "How long are your typical trips?",
    emoji: "📅",
    options: ["Weekend getaways (2-3 days)", "Short trips (4-5 days)", "Week-long (6-8 days)", "Extended travel (9-14 days)"],
    next: () => null,
  },
};

const DURATION_MAP = {
  "Weekend getaways (2-3 days)": [2, 3],
  "Short trips (4-5 days)": [4, 5],
  "Week-long (6-8 days)": [6, 8],
  "Extended travel (9-14 days)": [9, 14],
};

function ArchetypeResult({ result, onContinue }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 max-w-lg mx-auto">
      <div className="text-7xl mb-6">{result.archetypeEmoji}</div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Your travel personality</p>
      <h2 className="text-3xl font-semibold text-gray-900 mb-4">{result.archetypeName}</h2>
      <p className="text-gray-500 leading-relaxed mb-8">{result.archetypeDescription}</p>

      <div className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Your inferred preferences</p>
        {result.inferredPreferences.budgetRange && <PreferenceRow icon="💰" label="Budget" value={result.inferredPreferences.budgetRange} />}
        {result.inferredPreferences.tripPace && <PreferenceRow icon="⏱️" label="Pace" value={result.inferredPreferences.tripPace} />}
        {result.inferredPreferences.travelCompanions && <PreferenceRow icon="👥" label="Companions" value={result.inferredPreferences.travelCompanions} />}
        {result.inferredPreferences.travelStyles && <PreferenceRow icon="✨" label="Interests" value={result.inferredPreferences.travelStyles} />}
        {result.inferredPreferences.tripDurationMin != null && <PreferenceRow icon="📅" label="Trip length" value={`${result.inferredPreferences.tripDurationMin}–${result.inferredPreferences.tripDurationMax} days`} />}
        {result.inferredPreferences.accommodationStyle && <PreferenceRow icon="🏨" label="Stay" value={result.inferredPreferences.accommodationStyle} />}
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

function PreferenceRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-base w-5 text-center">{icon}</span>
      <span className="text-xs text-gray-400 w-20 shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-700">{value}</span>
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [questionId, setQuestionId] = useState("companions");
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);

  const question = QUESTIONS[questionId];
  const stepIndex = ["companions", "pace", "budget_relaxed", "budget_active", "style", "duration"].indexOf(questionId);
  const progress = Math.round(((stepIndex + 1) / 6) * 100);

  const handleSelect = (option) => {
    if (question.multi) {
      setSelected((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    } else {
      handleNext(option);
    }
  };

  const handleNext = async (option) => {
    const answer = question.multi ? selected.join(", ") : option;
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);
    setSelected([]);

    const nextId = question.next(option ?? selected.join(", "));

    if (!nextId) {
      await submitQuiz(newAnswers);
    } else {
      setQuestionId(nextId);
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
              {/* Header */}
              <div className="mb-10">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Travel personality quiz</p>
                <h1 className="text-2xl font-semibold text-gray-900">What kind of traveller are you?</h1>

                {/* Progress bar */}
                <div className="mt-6 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">{stepIndex + 1} of 6</p>
              </div>

              {/* Question */}
              <div className="mb-8">
                <span className="text-4xl mb-4 block">{question.emoji}</span>
                <h2 className="text-xl font-medium text-gray-900">{question.question}</h2>
                {question.multi && (
                  <p className="text-sm text-gray-400 mt-1">Select all that apply</p>
                )}
              </div>

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

              {/* Multi-select confirm button */}
              {question.multi && selected.length > 0 && (
                <button
                  onClick={() => handleNext()}
                  className="w-full mt-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Continue →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}