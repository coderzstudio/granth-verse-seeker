
import React from "react";
import { Star } from "lucide-react";

interface Props {
  image: string;
  title: string;
  rating: number;
  onClick?: () => void;
}
const MantraCard: React.FC<Props> = ({ image, title, rating, onClick }) => (
  <div
    className="flex bg-white shadow hover:shadow-md transition rounded-lg overflow-hidden cursor-pointer"
    onClick={onClick}
  >
    <img
      src={image}
      alt={title}
      className="w-32 h-32 object-cover flex-shrink-0"
      loading="lazy"
    />
    <div className="flex flex-col justify-between p-4 flex-grow min-w-0">
      <div>
        <div className="font-semibold text-base truncate">{title}</div>
        <div className="flex items-center mt-2 gap-1">
          {Array.from({ length: 5 }).map((_, i) =>
            i < rating ? (
              <Star key={i} className="text-yellow-400 fill-yellow-400 h-4 w-4" />
            ) : (
              <Star key={i} className="text-yellow-300 h-4 w-4 opacity-40" />
            )
          )}
        </div>
      </div>
    </div>
  </div>
);

export default MantraCard;
