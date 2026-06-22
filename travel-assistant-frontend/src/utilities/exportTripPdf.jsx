import { jsPDF } from "jspdf";

const PAGE = { w: 595.28, h: 841.89 };
const MARGIN = 48;
const CONTENT_W = PAGE.w - MARGIN * 2;

const INK = [17, 24, 39]; 
const MUTED = [107, 114, 128];
const FAINT = [156, 163, 175];
const ACCENT = [234, 88, 12];
const HAIRLINE = [229, 231, 235];
const DAYBAR = [17, 24, 39];

function makeDoc() {
  return new jsPDF({ unit: "pt", format: "a4" });
}

function layout(doc) {
  const ctx = { y: MARGIN, page: 1 };

  ctx.space = (needed) => {
    if (ctx.y + needed > PAGE.h - MARGIN) {
      doc.addPage();
      ctx.page += 1;
      ctx.y = MARGIN;
    }
  };

  ctx.gap = (h) => { ctx.y += h; };

  ctx.text = (str, opts = {}) => {
    const {
      size = 10,
      font = "helvetica",
      style = "normal",
      color = INK,
      lineH = 1.4,
      indent = 0,
      maxW = CONTENT_W - indent,
    } = opts;
    if (!str) return;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(str), maxW);
    const step = size * lineH;
    const ascent = size * 0.8;
    for (const line of lines) {
      ctx.space(step);
      doc.text(line, MARGIN + indent, ctx.y + ascent);
      ctx.y += step;
    }
  };

  ctx.rule = (color = HAIRLINE) => {
    ctx.space(12);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.7);
    doc.line(MARGIN, ctx.y, PAGE.w - MARGIN, ctx.y);
    ctx.y += 8;
  };

  return ctx;
}

function addFooters(doc, subtitle) {
  const total = doc.internal.getNumberOfPages();
  const stamp = new Date().toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric",
  });
  for (let p = 1; p <= total; p += 1) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...FAINT);
    doc.text(subtitle, MARGIN, PAGE.h - 24);
    doc.text(`${p} / ${total}`, PAGE.w - MARGIN, PAGE.h - 24, { align: "right" });
    doc.text(`Generated ${stamp}`, PAGE.w / 2, PAGE.h - 24, { align: "center" });
  }
}

function safeFileName(str) {
  return (str || "trip")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "trip";
}

function buildTripPdf(trip, title) {
  const doc = makeDoc();
  const L = layout(doc);

  const city = trip.destination?.city ?? "";
  const country = trip.destination?.country ?? "";
  const place = [city, country].filter(Boolean).join(", ");
  const days = trip.itinerary ?? [];

  L.text(place || title || "Your trip", { size: 24, style: "bold", color: INK, lineH: 1.15 });
  L.gap(4);

  const dayCount = trip.numberOfDays || days.length;
  const subParts = [];
  if (dayCount) subParts.push(`${dayCount} ${dayCount === 1 ? "day" : "days"}`);
  if (trip.weatherDateRange) subParts.push(trip.weatherDateRange);
  if (subParts.length) L.text(subParts.join("  ·  "), { size: 10, color: MUTED });

  L.rule();

  if (trip.summary) {
    L.text(trip.summary, { size: 10.5, color: INK, lineH: 1.5 });
    L.gap(6);
  }

  if (trip.tripTags?.length) {
    L.text(trip.tripTags.join("   •   "), { size: 9, color: FAINT });
    L.gap(6);
  }

  const hasWeather =
    trip.weatherHighC || trip.weatherLowC || trip.weatherRainChancePct || trip.weatherUvIndex;
  if (hasWeather) {
    L.gap(4);
    L.text("WEATHER", { size: 9, style: "bold", color: MUTED });
    L.gap(2);
    const bits = [];
    if (trip.weatherHighC) bits.push(`High ${Math.round(trip.weatherHighC)}°C`);
    if (trip.weatherLowC) bits.push(`Low ${Math.round(trip.weatherLowC)}°C`);
    if (trip.weatherRainChancePct) bits.push(`${trip.weatherRainChancePct}% rain`);
    if (trip.weatherUvIndex) bits.push(`UV ~${Math.round(trip.weatherUvIndex)}`);
    if (trip.weatherCondition) bits.push(trip.weatherCondition);
    L.text(bits.join("    ·    "), { size: 10, color: INK });
    if (trip.weatherGuidance) {
      L.gap(2);
      L.text(trip.weatherGuidance, { size: 9.5, color: MUTED, lineH: 1.45 });
    }
    L.gap(4);
  }

  days.forEach((day) => {
    L.gap(14);

    const barH = 26;
    L.space(barH + 8);
    doc.setFillColor(...DAYBAR);
    doc.roundedRect(MARGIN, L.y, CONTENT_W, barH, 5, 5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    const dayLabel = `Day ${day.dayNumber}`;
    doc.text(dayLabel, MARGIN + 12, L.y + barH / 2 + 4);
    if (day.theme) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(209, 213, 219);
      doc.text(day.theme, MARGIN + 12 + doc.getTextWidth(dayLabel) + 12, L.y + barH / 2 + 4);
    }
    L.y += barH + 12;

    if (day.description) {
      L.text(day.description, { size: 9.5, style: "italic", color: MUTED, lineH: 1.45 });
      L.gap(4);
    }

    (day.activities ?? []).forEach((act, i) => {
      L.gap(4);
      L.text(`${i + 1}.  ${act.name ?? "Activity"}`, { size: 11, style: "bold", color: INK });

      const meta = [];
      if (act.estimatedDuration) meta.push(act.estimatedDuration);
      if (act.isDining) meta.push("Dining");
      if (act.isWeatherDependent) meta.push("Weather dependent");
      if (meta.length) L.text(meta.join("  ·  "), { size: 8.5, color: ACCENT, indent: 16 });

      if (act.address) L.text(act.address, { size: 9, color: FAINT, indent: 16 });
      if (act.description) {
        L.gap(1);
        L.text(act.description, { size: 9.5, color: MUTED, lineH: 1.45, indent: 16 });
      }
      L.gap(4);
    });

    if (day.localTip) {
      L.gap(2);
      L.text("Local tip", { size: 9, style: "bold", color: [22, 163, 74], indent: 16 });
      L.text(day.localTip, { size: 9.5, color: MUTED, lineH: 1.45, indent: 16 });
    }
  });

  if (trip.packingList?.length) {
    L.gap(16);
    L.rule();
    L.text("What to pack", { size: 11, style: "bold", color: INK });
    L.gap(4);
    trip.packingList.forEach((item) => {
      L.text(`•  ${item}`, { size: 9.5, color: MUTED, indent: 4 });
    });
  }

  addFooters(doc, place ? `${place} — Travel Assistant` : "Travel Assistant");
  doc.save(`${safeFileName(place || title)}-itinerary.pdf`);
}

function buildTranscriptPdf(messages, title) {
  const doc = makeDoc();
  const L = layout(doc);

  L.text(title || "Chat transcript", { size: 22, style: "bold", color: INK });
  L.rule();

  (messages ?? []).forEach((m) => {
    if (!m?.content) return;
    const who = m.role === "user" ? "You" : "Assistant";
    L.gap(8);
    L.text(who, { size: 9, style: "bold", color: m.role === "user" ? INK : ACCENT });
    L.text(m.content, { size: 10, color: INK, lineH: 1.5 });
  });

  addFooters(doc, "Travel Assistant");
  doc.save(`${safeFileName(title || "chat")}-transcript.pdf`);
}

export function exportChatPdf({ trip, messages, title }) {
  if (trip && (trip.itinerary?.length || trip.summary)) {
    buildTripPdf(trip, title);
  } else {
    buildTranscriptPdf(messages, title);
  }
}

export function hasExportableTrip(trip) {
  return !!(trip && (trip.itinerary?.length || trip.summary));
}
