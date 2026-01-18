function DashboardSkeleton() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="logo skeleton" style={{ height: 32 }} />
      </aside>

      <main className="dashboard-main">
        <div className="skeleton" style={{ height: 40, width: 220 }} />

        <div className="stats-row" style={{ marginTop: 40 }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="stat-box skeleton" style={{ height: 120 }} />
          ))}
        </div>

        <div className="projects-grid" style={{ marginTop: 40 }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="project-tile skeleton" style={{ height: 220 }} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default DashboardSkeleton;

