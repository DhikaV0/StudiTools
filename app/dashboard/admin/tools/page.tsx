export default function ToolManagement() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Manajemen Alat
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <button className="mb-4 bg-navy text-white px-4 py-2 rounded-lg">
          + Tambah Alat
        </button>

        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="py-3">Nama</th>
              <th>Kategori</th>
              <th>Stok</th>
              <th>Kondisi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-3">Sony A7</td>
              <td>Kamera</td>
              <td>5</td>
              <td>Baik</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}