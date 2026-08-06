function IncidentTable({ incidents }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-sm">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-[0.24em] text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Incident</th>
            <th scope="col" className="px-4 py-3">Service</th>
            <th scope="col" className="px-4 py-3">Severity</th>
            <th scope="col" className="px-4 py-3">Status</th>
            <th scope="col" className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-slate-950/50">
              <td className="px-4 py-4 text-white">{incident.title}</td>
              <td className="px-4 py-4">{incident.service}</td>
              <td className="px-4 py-4">{incident.severity}</td>
              <td className="px-4 py-4">
                <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                  {incident.status}
                </span>
              </td>
              <td className="px-4 py-4">{incident.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default IncidentTable
