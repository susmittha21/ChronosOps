import Card from '../ui/Card.jsx'

const notifications = [
  { id: 1, title: 'Database connection limit warning', time: '2m ago' },
  { id: 2, title: 'Service health check rebuilt', time: '10m ago' },
  { id: 3, title: 'New incident added to memory', time: '1h ago' },
]

function NotificationsPanel() {
  return (
    <Card title="Notifications" className="max-w-xl">
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-medium text-white">{notification.title}</p>
            <p className="text-xs text-slate-500">{notification.time}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default NotificationsPanel
