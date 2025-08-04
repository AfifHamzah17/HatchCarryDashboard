import React, { useState, useMemo } from 'react';
import kebunData from '../data/kebun.json';

export default function Sidebar({ onSelect, isOpen, toggle }) {
  // Grup per distrik
  const grouped = useMemo(() => {
    return kebunData.reduce((acc, k) => {
      if (!acc[k.singkatan_distrik]) {
        acc[k.singkatan_distrik] = {
          label: k.distrik,
          items: [],
        };
      }
      acc[k.singkatan_distrik].items.push(k);
      return acc;
    }, {});
  }, []);

  const totalKebun = kebunData.length;

  // hitung per distrik
  const counts = useMemo(() => {
    return Object.entries(grouped).map(([sig, grp]) => ({
      sig,
      label: grp.label,
      count: grp.items.length,
    }));
  }, [grouped]);

  const [openDistrict, setOpenDistrict] = useState(counts[0]?.sig);

  if (!isOpen) return (
    <button
      onClick={toggle}
      className="absolute top-4 left-4 bg-green-600 text-white p-2 rounded-full shadow"
    >
      ☰
    </button>
  );

  return (
    <aside className="w-64 bg-white border-r overflow-auto p-4 relative">
      <button
        onClick={toggle}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-2">Daftar Kebun</h2>
      <div className="mb-4 text-sm">
        <div>Total Kebun: <strong>{totalKebun}</strong></div>
        {counts.map(c => (
          <div key={c.sig}>
            {c.sig}: <strong>{c.count}</strong>
          </div>
        ))}
      </div>

      {counts.map(c => (
        <div key={c.sig} className="mb-3">
          <button
            onClick={() => setOpenDistrict(openDistrict === c.sig ? null : c.sig)}
            className="w-full text-left font-medium py-1 flex justify-between hover:bg-gray-100 rounded"
          >
            {c.sig}
            <span>{openDistrict === c.sig ? '−' : '+'}</span>
          </button>
          {openDistrict === c.sig && (
            <ul className="mt-1 ml-3 text-sm space-y-1">
              {grouped[c.sig].items.map(k => (
                <li
                  key={k.kode}
                  onClick={() => onSelect(k)}
                  className="cursor-pointer hover:text-blue-600"
                >
                  {k.kode} — {k.nama_kebun}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}