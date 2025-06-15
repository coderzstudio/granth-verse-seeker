
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import MantraCard from "../components/MantraCard";

interface MantraItem {
  id: string;
  title: string;
  image_link: string;
  details: string;
  other_images?: string[];
}

const GITHUB_MANTRAS_URL =
  "https://raw.githubusercontent.com/klmalviya77/Mantras/refs/heads/main/json.txt";

const getFixedRating = (mantraId: string) => {
  // Deterministic "random" rating per mantra (between 3 and 5)
  let hash = 0;
  for (const c of mantraId) hash = ((hash << 5) - hash) + c.charCodeAt(0);
  const rating = 3 + (Math.abs(hash) % 3); // 3, 4, or 5 stars
  return rating;
};

const Mantra: React.FC = () => {
  const [mantras, setMantras] = useState<MantraItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch(GITHUB_MANTRAS_URL)
      .then((resp) => {
        if (!resp.ok) throw new Error("Error fetching mantras");
        return resp.text(); // Get as text first
      })
      .then((data) => {
        console.log("Raw data from GitHub:", data);
        
        // Parse multiple JSON objects separated by newlines
        const lines = data.trim().split('\n');
        const parsedMantras: MantraItem[] = [];
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('//')) { // Skip empty lines and comments
            try {
              const parsedObj = JSON.parse(trimmedLine);
              parsedMantras.push(parsedObj);
            } catch (parseError) {
              console.error("Error parsing line:", trimmedLine, parseError);
            }
          }
        }
        
        console.log("Parsed mantras:", parsedMantras);
        setMantras(parsedMantras);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setErr("Could not load mantras.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-10 px-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Mantra</h1>
      {loading && <div className="text-center py-8">Loading...</div>}
      {err && <div className="text-center text-red-600">{err}</div>}
      <div className="space-y-4">
        {mantras.map((m) => (
          <MantraCard
            key={m.id}
            image={m.image_link}
            title={m.title}
            rating={getFixedRating(m.id)}
            onClick={() => navigate(`/mantra/${m.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Mantra;
