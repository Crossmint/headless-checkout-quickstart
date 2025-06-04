import Image from "next/image";
import { clsx } from "clsx";
import type { WeaponCardProps } from "../types/weapon";

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weapon,
  isSelected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "relative bg-gray-800/60 border-2 border-gray-600 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-gray-400 hover:bg-gray-700/40 hover:scale-105 transform aspect-[3/4] flex flex-col items-center justify-between",
        isSelected && "border-blue-400 bg-blue-50/10"
      )}
    >
      {/* Selection checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            />
          </svg>
        </div>
      )}

      {/* Weapon icon */}
      <div className="flex items-center justify-center mb-3 flex-1">
        <Image
          src={weapon.icon}
          alt={weapon.name}
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Weapon name */}
      <h3 className="text-white font-semibold text-sm text-center mb-1">
        {weapon.name}
      </h3>

      {/* Weapon price */}
      <p className="text-yellow-400 font-bold text-base">{weapon.price}</p>
    </button>
  );
};
