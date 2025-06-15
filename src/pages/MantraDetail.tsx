
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react";

interface MantraDetailData {
  id: string;
  title: string;
  image_link: string;
  details: string;
  other_images?: string[];
}

const GITHUB_MANTRAS_URL =
  "https://raw.githubusercontent.com/klmalviya77/Mantras/refs/heads/main/json.txt";

// To match the same rating logic as in Mantra.tsx
const getFixedRating = (mantraId: string) => {
  let hash = 0;
  for (const c of mantraId) hash = ((hash << 5) - hash) + c.charCodeAt(0);
  const rating = 3 + (Math.abs(hash) % 3);
  return rating;
};

const MantraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MantraDetailData | null>(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch(GITHUB_MANTRAS_URL)
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to load data");
        return resp.text(); // Get as text first
      })
      .then((data) => {
        console.log("Raw data from GitHub:", data);
        
        // Parse multiple JSON objects separated by newlines
        const lines = data.trim().split('\n');
        const parsedMantras: MantraDetailData[] = [];
        
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
        const found = parsedMantras.find((m: MantraDetailData) => m.id === id);
        if (!found) throw new Error("Mantra not found");
        setItem(found);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setErr("Could not load mantra details.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="max-w-2xl mx-auto pt-24 pb-14 px-2 text-center">Loading...</div>;
  if (err)
    return <div className="max-w-2xl mx-auto pt-24 pb-12 text-center text-red-600">{err}</div>;

  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto pt-20 pb-10 px-2">
      <button
        className="mb-6 flex items-center text-orange-600 hover:underline text-sm"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>
      <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col">
        <img
          src={item.image_link}
          alt={item.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">{item.title}</h2>
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) =>
              i < getFixedRating(item.id) ? (
                <Star key={i} className="text-yellow-400 fill-yellow-400 h-4 w-4" />
              ) : (
                <Star key={i} className="text-yellow-300 h-4 w-4 opacity-40" />
              )
            )}
          </div>
          <div className="text-base leading-relaxed mb-2 whitespace-pre-line">{item.details}</div>
          {item.other_images && item.other_images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-4">
              {item.other_images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`other_img${i}`}
                  className="h-28 w-28 object-cover rounded-lg border"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MantraDetail;
