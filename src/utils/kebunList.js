// src/utils/kebunList.js

export const validKebunList = [
  { id: '1KSD', name: 'KEBUN SEI DAUN', regional: '1R1' },
  { id: '1KTO', name: 'KEBUN TORGAMBA', regional: '1R1' },
  { id: '1KSB', name: 'KEBUN SEI BARUHUR', regional: '1R1' },
  { id: '1KSK', name: 'KEBUN SEI KEBARA', regional: '1R1' },
  { id: '1KAT', name: 'KEBUN AEK TOROP', regional: '1R1' },
  { id: '1KAR', name: 'KEBUN AEK RASO', regional: '1R1' },
  { id: '1KSU', name: 'KEBUN SISUMUT', regional: '1R1' },
  { id: '1KAN', name: 'KEBUN AEK NABARA UTARA', regional: '1R1' },
  { id: '1KAS', name: 'KEBUN AEK NABARA SELATAN', regional: '1R1' },
  { id: '1KRP', name: 'KEBUN RANTAU PRAPAT', regional: '1R1' },
  { id: '1KMM', name: 'KEBUN MEMBANG MUDA', regional: '1R1' },
  { id: '1KLJ', name: 'KEBUN LABUHAN HAJI', regional: '1R1' },
  { id: '1KMS', name: 'KEBUN MERBAU SELATAN', regional: '1R1' },
  { id: '1KDP', name: 'KEBUN SEI DADAP', regional: '1R1' },
  { id: '1KPM', name: 'KEBUN PULAU MANDI', regional: '1R1' },
  { id: '1KAM', name: 'KEBUN AMBALUTU', regional: '1R1' },
  { id: '1KSL', name: 'KEBUN SEI SILAU', regional: '1R1' },
  { id: '1KHP', name: 'KEBUN HUTA PADANG', regional: '1R1' },
  { id: '1KBS', name: 'KEBUN BANDAR SELAMAT', regional: '1R1' },
  { id: '1KDH', name: 'KEBUN DUSUN HULU', regional: '1R1' },
  { id: '1KBB', name: 'KEBUN BANDAR BETSY', regional: '1R1' },
  { id: '1KBN', name: 'KEBUN BANGUN', regional: '1R1' },
  { id: '1KGP', name: 'KEBUN GUNUNG PAMELA', regional: '1R1' },
  { id: '1KGM', name: 'KEBUN GUNUNG MONAKO', regional: '1R1' },
  { id: '1KSA', name: 'KEBUN SILAU DUNIA', regional: '1R1' },
  { id: '1KGR', name: 'KEBUN GUNUNG PARA', regional: '1R1' },
  { id: '1KSP', name: 'KEBUN SEI PUTIH', regional: '1R1' },
  { id: '1KSG', name: 'KEBUN SARANG GITING', regional: '1R1' },
  { id: '1KTR', name: 'KEBUN TANAH RAJA', regional: '1R1' },
  { id: '1KRB', name: 'KEBUN RAMBUTAN', regional: '1R1' },
  { id: '1KHG', name: 'KEBUN HAPESONG', regional: '1R1' },
  { id: '1KBU', name: 'KEBUN BATANG TORU', regional: '1R1' },
  { id: '1KSM', name: 'KEBUN SEI MERANTI', regional: '1R1 KSO 1DMT' },
  { id: '1KBT', name: 'KEBUN BUKIT TUJUH', regional: '1R1 KSO 1DMT' },
  { id: '1KKI', name: 'KEBUN KARANG INONG', regional: '1R1 KSO 1DAT' },
  { id: '1KJA', name: 'KEBUN JOLOK RAYEUK SELATAN', regional: '1R1 KSO 1DAT' },
  { id: '1KCB', name: 'KEBUN CISALAK BARU', regional: '1R1 KSO 1DJB' },
  { id: '1KBO', name: 'KEBUN BOJONG DATAR', regional: '1R1 KSO 1DJB' },
  { id: '1KPA', name: 'KEBUN PANGLEJAR', regional: '1R1 KSO 1DJB' },
  { id: '1KKE', name: 'KEBUN KERTAJAYA', regional: '1R1 KSO 1DJB' },
  { id: '1KTB', name: 'KEBUN CIBUNGUNG', regional: '1R1 KSO 1DJB' },
  { id: '1KCI', name: 'KEBUN CIKASUNGKA', regional: '1R1 KSO 1DJB' },
  { id: '1KKA', name: 'KEBUN SUKA MAJU', regional: '1R1 KSO 1DJB' }
];

// Helper function untuk mendapatkan detail kebun berdasarkan ID
export function getKebunDetail(kebunId) {
  return validKebunList.find(kebun => kebun.id === kebunId) || 
         { id: kebunId, name: 'Unknown', regional: 'Unknown' };
}