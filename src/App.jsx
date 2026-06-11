import  { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebaseConfig";

function App() {
  const [suhu, setSuhu] = useState(0);
  const [kelembaban, setKelembaban] = useState(0);
  const [statusPompa, setStatusPompa] = useState(0);

  useEffect(() => {
    const referensiSuhu = ref(database, 'KebunPintar/Suhu');
    const referensiKelembaban = ref(database, 'KebunPintar/KelembabanTanah');
    const referensiPompa = ref(database, 'KebunPintar/StatusPompa');

    onValue(referensiSuhu, (snapshot) => setSuhu(snapshot.val()));
    onValue(referensiKelembaban, (snapshot) => setKelembaban(snapshot.val()));
    onValue(referensiPompa, (snapshot) => setStatusPompa(snapshot.val()));
  }, []);

  const kendalikanPompa = () => {
    const referensiPompa = ref(database, 'KebunPintar/StatusPompa');
    set(referensiPompa, statusPompa === 0 ? 1 : 0);
  };

  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dasbor Smart Garden</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
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
          className={`w-full py-3 text-white font-semibold rounded-lg transition-colors shadow-sm ${statusPompa === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-rose-600 hover:bg-rose-700'}`}
        >
          {statusPompa === 0 ? "Nyalakan Pompa" : "Matikan Pompa"}
        </button>
      </div>
    </div>
  );
}

export default App;