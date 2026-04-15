export default function PeminjamDashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-6">
        Dashboard Peminjam
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white text-gray-800 p-6 rounded-xl shadow">
          Total Peminjaman
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow">
          Sedang Dipinjam
        </div>

        <div className="bg-white text-gray-800 p-6 rounded-xl shadow">
          Riwayat
        </div>
      </div>
    </div>
  );
}