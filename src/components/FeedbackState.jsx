export function LoadingState({ message = 'Carregando...' }) {
  return <p className="state-message">{message}</p>
}

export function ErrorState({ message = 'Ocorreu um erro ao carregar os dados.' }) {
  return <p className="state-message error">{message}</p>
}

export function EmptyState({ message = 'Nenhum resultado encontrado.' }) {
  return <p className="state-message">{message}</p>
}

export function SkeletonGameGrid({ count = 8 }) {
  return (
    <div className="games-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${index}`} className="game-card skeleton-card">
          <div className="skeleton-cover shimmer" />
          <div className="skeleton-content">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line short shimmer" />
            <div className="skeleton-tags">
              <span className="skeleton-pill shimmer" />
              <span className="skeleton-pill shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonGameDetails() {
  return (
    <article className="details-page" aria-hidden="true">
      <div className="details-cover skeleton-detail-cover shimmer" />

      <div className="details-header">
        <div className="skeleton-line skeleton-detail-title shimmer" />
        <div className="skeleton-pill skeleton-detail-rating shimmer" />
      </div>

      <div className="details-stats-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`details-stat-${index}`} className="details-stat-card section-panel">
            <div className="skeleton-line short shimmer" />
            <div className="skeleton-line shimmer" />
          </div>
        ))}
      </div>

      <div className="details-content-grid">
        <section className="section-panel details-description">
          <div className="skeleton-line skeleton-detail-heading shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line short shimmer" />
        </section>

        <section className="section-panel details-list">
          <div className="skeleton-line skeleton-detail-heading shimmer" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`info-${index}`} className="skeleton-line shimmer" />
          ))}
        </section>
      </div>

      <section className="game-section section-panel">
        <div className="skeleton-line skeleton-detail-heading shimmer" />
        <div className="screenshots-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`shot-${index}`} className="skeleton-shot shimmer" />
          ))}
        </div>
      </section>
    </article>
  )
}
