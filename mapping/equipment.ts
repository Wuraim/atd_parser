import {
  WeaponEquipment,
  PetEquipment,
  CapeEquipment,
  HeadEquipment,
  DofusEquipment,
} from "../enums/equipment.ts";

export const RECORD_WEAPON_EQUIPMENT: Record<number, WeaponEquipment> = {
  0xc: WeaponEquipment.Comete,
};

export const RECORD_PET_EQUIPMENT: Record<number, PetEquipment> = {
  0xa7: PetEquipment.Abra,
};

export const RECORD_CAPE_EQUIPMENT: Record<number, CapeEquipment> = {
  0x6b: CapeEquipment.Abracapa,
};

export const RECORD_HEAD_EQUIPMENT: Record<number, HeadEquipment> = {
  0x73: HeadEquipment.Caracoiffe,
};

export const RECORD_DOFUS_EQUIPMENT: Record<number, DofusEquipment> = {
  0x7d: DofusEquipment.Cawotte,
};
