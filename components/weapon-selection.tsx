import { WEAPONS } from "@/lib/checkout";
import type { WeaponSelectionProps, Weapon } from "../types/weapon";
import { WeaponCard } from "./weapon-card";

export const WeaponSelection: React.FC<WeaponSelectionProps> = ({
  selectedWeaponId,
  onWeaponSelect,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8 max-w-md mx-auto">
      {WEAPONS.map((weapon) => (
        <WeaponCard
          key={weapon.id}
          weapon={weapon}
          isSelected={selectedWeaponId === weapon.id}
          onClick={() => onWeaponSelect(weapon.id)}
        />
      ))}
    </div>
  );
};
