import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebaseConfig";

function App() {
  const [suhu, setSuhu] = useState(0);
  const [kelembaban, setKelembaban] = useState(0);
  const [statusPompa, setStatusPompa] = useState(0);
  const [modeOperasional, setModeOperasional] = useState(0);

  useEffect(() => {
    const referensiSuhu = ref(database, 'KebunPintar/Suhu');
    const referensiKelembaban = ref(database, 'KebunPintar/KelembabanTanah');
    const referensiPompa = ref(database, 'KebunPintar/StatusPompa');
    const referensiMode = ref(database, 'KebunPintar/Mode');

    onValue(referensiSuhu, (snapshot) => setSuhu(snapshot.val()));
    onValue(referensiKelembaban, (snapshot) => setKelembaban(snapshot.val()));
    onValue(referensiPompa, (snapshot) => setStatusPompa(snapshot.val()));
    onValue(referensiMode, (snapshot) => setModeOperasional(snapshot.val()));
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

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dasbor Beluga Smart Garden</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <span className="text-lg font-bold text-gray-700">Mode Sistem</span>
          <button
            onClick={ubahMode}
            className={`px-4 py-2 font-bold rounded-lg transition-colors ${modeOperasional === 1 ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
          >
            {modeOperasional === 1 ? "Otomatis" : "Manual"}
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-gray-600 font-medium">Suhu Lingkungan</span>
            <span className="text-xl font-bold text-blue-600">{suhu} °C</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-gray-600 font-medium">Kelembaban Tanah</span>
            <span className="text-xl font-bold text-green-600">{kelembaban} %</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600 font-medium">Status Mesin Air</span>
            <span className={`text-md font-bold px-3 py-1 rounded-full ${statusPompa === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {statusPompa === 1 ? "Menyala" : "Mati"}
            </span>
          </div>
        </div>

        <button 
          onClick={kendalikanPompa} 
          disabled={modeOperasional === 1}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-colors shadow-sm ${modeOperasional === 1 ? 'bg-gray-400 cursor-not-allowed' : (statusPompa === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700')}`}
        >
          {modeOperasional === 1 ? "Dikendalikan Sensor" : (statusPompa === 0 ? "Nyalakan Pompa" : "Matikan Pompa")}
        </button>
      </div>
    </div>
  );
}

export default App;