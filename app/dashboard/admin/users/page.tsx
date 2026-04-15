export default function UserManagement() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Manajemen User
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left text-sm">
          <thead className="border-b">
            <tr>
              <th className="py-3">Nama</th>
              <th>Username</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-3">Administrator</td>
              <td>admin</td>
              <td>ADMIN</td>
              <td>
                <button className="text-cyan hover:underline">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}