export interface GunBrandModel {
  brand: string;
  models: string[];
}

export const gunBrands: GunBrandModel[] = [
  {
    brand: "Remington",
    models: ["870", "11-87", "Versa Max", "1100", "887 Nitro Mag"]
  },
  {
    brand: "Mossberg",
    models: ["500", "590", "930", "535 ATS", "940 Pro"]
  },
  {
    brand: "Beretta",
    models: ["A400 Xtreme Plus", "686 Silver Pigeon", "1301 Tactical", "A300 Ultima", "DT11"]
  },
  {
    brand: "Benelli",
    models: ["Super Black Eagle 3", "M2 Field", "Ethos", "Nova", "M4"]
  },
  {
    brand: "Browning",
    models: ["Citori", "A5", "Maxus II", "BPS", "Cynergy"]
  },
  {
    brand: "Winchester",
    models: ["Model 70", "Super X4", "SXP Defender", "101", "SX3"]
  },
  {
    brand: "CZ-USA",
    models: ["Drake", "712 G2", "Redhead Premier", "Bobwhite G2", "All-American"]
  },
  {
    brand: "Stoeger",
    models: ["M3000", "P3500", "Condor", "Coach Gun", "M3500"]
  },
  {
    brand: "Savage Arms",
    models: ["Stevens 320", "Stevens 555", "Renegauge", "Model 220", "Model 212"]
  },
  {
    brand: "Franchi",
    models: ["Affinity 3", "Instinct SL", "Momentum Elite", "Affinity Elite", "Instinct LX"]
  }
];