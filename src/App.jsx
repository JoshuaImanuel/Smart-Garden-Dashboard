import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebaseConfig";

function App() {
  const [suhu, setSuhu] = useState(0);
  const [kelembaban, setKelembaban] = useState(0);
  const [statusPompa, setStatusPompa] = useState(0);
  const [modeOperasional, setModeOperasional] = useState(0);
  const [intervalMenyiram, setIntervalMenyiram] = useState(5);
  const [durasiMenyiram, setDurasiMenyiram] = useState(3);

  useEffect(() => {
    const referensiSuhu = ref(database, 'KebunPintar/Suhu');
    const referensiKelembaban = ref(database, 'KebunPintar/KelembabanTanah');
    const referensiPompa = ref(database, 'KebunPintar/StatusPompa');
    const referensiMode = ref(database, 'KebunPintar/Mode');
    const referensiInterval = ref(database, 'KebunPintar/Interval');
    const referensiDurasi = ref(database, 'KebunPintar/Durasi');

    onValue(referensiSuhu, (snapshot) => setSuhu(snapshot.val()));
    onValue(referensiKelembaban, (snapshot) => setKelembaban(snapshot.val()));
    onValue(referensiPompa, (snapshot) => setStatusPompa(snapshot.val()));
    onValue(referensiMode, (snapshot) => setModeOperasional(snapshot.val()));
    onValue(referensiInterval, (snapshot) => {
      if (snapshot.exists()) setIntervalMenyiram(snapshot.val());
    });
    onValue(referensiDurasi, (snapshot) => {
      if (snapshot.exists()) setDurasiMenyiram(snapshot.val());
    });
  }, []);

  const kendalikanPompa = () => {
    if (modeOperasional === 1) return;
    const referensiPompa = ref(database, 'KebunPintar/StatusPompa');
    set(referensiPompa, statusPompa === 0 ? 1 : 0);
  };

  const ubahMode = () => {
    const referensiMode = ref(database, 'KebunPintar/Mode');
    set(referensiMode, modeOperasional === 0 ? 1 : 0);
  };

  const ubahInterval = (e) => {
    const nilaiBaru = parseInt(e.target.value);
    setIntervalMenyiram(nilaiBaru);
    const referensiInterval = ref(database, 'KebunPintar/Interval');
    set(referensiInterval, nilaiBaru);
  };

  const ubahDurasi = (e) => {
    const nilaiBaru = parseInt(e.target.value);
    setDurasiMenyiram(nilaiBaru);
    const referensiDurasi = ref(database, 'KebunPintar/Durasi');
    set(referensiDurasi, nilaiBaru);
  };

  return (
    <div className="p-4 sm:p-8 font-sans bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-emerald-800 drop-shadow-sm flex items-center gap-3">
        <span className="text-4xl">🌱</span> Kebun Pintar
      </h1>
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl max-w-md w-full border border-emerald-50">
        
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-5">
          <span className="text-lg font-bold text-gray-700 flex items-center gap-2">
            🎛️ Mode Sistem
          </span>
          <button
            onClick={ubahMode}
            className={`px-5 py-2.5 font-bold rounded-2xl transition-all shadow-sm transform hover:scale-105 active:scale-95 ${modeOperasional === 1 ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 ring-2 ring-purple-300' : 'bg-orange-100 text-orange-700 hover:bg-orange-200 ring-2 ring-orange-300'}`}
          >
            {modeOperasional === 1 ? "🤖 Otomatis" : "🖐️ Manual"}
          </button>
        </div>

        {modeOperasional === 1 && (
          <div className="space-y-4 mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-purple-50 transition-all hover:shadow-md">
              <span className="text-purple-900 font-semibold text-sm flex items-center gap-2">⏱️ Siklus Jeda</span>
              <select
                value={intervalMenyiram}
                onChange={ubahInterval}
                className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 text-sm font-bold text-purple-700 outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              >
                <option value={5}>5 Detik</option>
                <option value={60}>1 Menit</option>
                <option value={300}>5 Menit</option>
                <option value={1800}>30 Menit</option>
                <option value={3600}>1 Jam</option>
              </select>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-indigo-50 transition-all hover:shadow-md">
              <span className="text-indigo-900 font-semibold text-sm flex items-center gap-2">⏳ Pompa Menyala</span>
              <select
                value={durasiMenyiram}
                onChange={ubahDurasi}
                className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-sm font-bold text-indigo-700 outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value={3}>3 Detik</option>
                <option value={5}>5 Detik</option>
                <option value={10}>10 Detik</option>
                <option value={15}>15 Detik</option>
                <option value={30}>30 Detik</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl shadow-inner border border-blue-100 transform transition-all hover:scale-[1.02]">
            <span className="text-blue-900 font-semibold flex items-center gap-2">🌡️ Suhu Udara</span>
            <span className="text-2xl font-black text-blue-600">{suhu} °C</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl shadow-inner border border-green-100 transform transition-all hover:scale-[1.02]">
            <span className="text-green-900 font-semibold flex items-center gap-2">💧 Kelembaban</span>
            <span className="text-2xl font-black text-green-600">{kelembaban} %</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-gray-700 font-semibold flex items-center gap-2">⚙️ Status Pompa</span>
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full shadow-sm ${statusPompa === 1 ? 'bg-emerald-500 text-white animate-pulse' : 'bg-rose-100 text-rose-700'}`}>
              {statusPompa === 1 ? "💦 Menyala" : "💤 Mati"}
            </span>
          </div>
        </div>

        <button 
          onClick={kendalikanPompa} 
          disabled={modeOperasional === 1}
          className={`w-full py-4 text-white text-lg font-bold rounded-2xl transition-all shadow-lg transform active:scale-95 flex justify-center items-center gap-2 ${modeOperasional === 1 ? 'bg-gray-300 cursor-not-allowed shadow-none' : (statusPompa === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-200' : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 hover:shadow-rose-200')}`}
        >
          {modeOperasional === 1 ? "🤖 Sedang Otomatis" : (statusPompa === 0 ? "🚿 Nyalakan Pompa" : "🛑 Matikan Pompa")}
        </button>
      </div>
    </div>
  );
}

export default App;