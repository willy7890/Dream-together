import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../components/ui";
import * as moodService from "../../services/moodService";
import type { MoodEntry } from "../../services/moodService";

const MOODS = ["happy", "excited", "relaxed", "neutral", "sad", "angry", "stressed", "tired"];
const EMOJI: Record<string, string> = { happy: "😊", excited: "🤩", relaxed: "😌", neutral: "😐", sad: "😔", angry: "😠", stressed: "😩", tired: "😴" };

export default function MoodPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [today] = useState(new Date().toISOString().slice(0, 10));

  const load = () => moodService.moodHistory().then(setHistory);
  useEffect(() => { load(); }, []);

  const pick = async (mood: string) => {
    await moodService.logMood(mood, today);
    load();
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="text-[14px] text-muted mb-4">{t("pickMood")}</div>
        <div className="flex flex-wrap gap-3">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => pick(m)}
              className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-transform hover:scale-110 ${
                history[0]?.mood === m ? "bg-gold/20 ring-2 ring-gold" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              {EMOJI[m]}
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <SectionHeader title={t("moodHistory")} />
        {history.length === 0 ? (
          <div className="text-[14px] text-muted">{t("noMoodYet")}</div>
        ) : (
          <div className="flex items-end gap-3 flex-wrap">
            {history.slice().reverse().map((h) => (
              <div key={h.id} className="flex flex-col items-center gap-1">
                <div className="text-xl">{EMOJI[h.mood]}</div>
                <div className="text-[10px] text-muted">{h.date.slice(5)}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
