export interface Weapon {
  id: string;
  name: string;
  price: string;
  icon: string;
}

export interface WeaponCardProps {
  weapon: Weapon;
  isSelected: boolean;
  onClick: () => void;
}

export interface WeaponSelectionProps {
  selectedWeaponId: string;
  onWeaponSelect: (weaponId: string) => void;
} 