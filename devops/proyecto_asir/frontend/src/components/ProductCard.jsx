function ProductCard({ tag, title, description, price, unit }) {
  const [whole, decimal] = price.split('.')

  return (
    <article className="card">
      <span className="card-tag">{tag}</span>
      <h3 className="card-title">{title}</h3>
      <p className="card-desc">{description}</p>
      <div className="card-footer">
        <div className="price">
          ${whole}.<sup>{decimal}</sup>
          {unit && <span> {unit}</span>}
        </div>
        <button className="btn btn-primary">Añadir</button>
      </div>
    </article>
  )
}

export default ProductCard
