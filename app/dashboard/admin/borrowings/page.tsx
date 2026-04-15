export default function ApprovalPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Approval Peminjaman
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="py-3">User</th>
              <th>Status</th>
              <th>Tanggal Pinjam</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-3">Andhika</td>
              <td className="text-yellow-600">Pending</td>
              <td>14 Apr 2026</td>
              <td className="space-x-3">
                <button className="text-green-600">Approve</button>
                <button className="text-red-600">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}