import { useState, useEffect } from 'react'
import { productsService } from '../services/api'
import ProductCard from '../components/ProductCard'

function Home() {
  const [comida, setComida] = useState([])
  const [juguetes, setJuguetes] = useState([])

  useEffect(() => {
    const loadProducts = async () => {
      const food = await productsService.getByCategory('comida')
      const toys = await productsService.getByCategory('juguetes')
      setComida(food)
      setJuguetes(toys)
    }
    loadProducts()
  }, [])

  return (
    <>
      <header className="page-header container">
        <h1>Lo mejor para tu mejor amigo</h1>
        <p>
          Nutrición premium y diversión inagotable. Descubre nuestro catálogo
          sin necesidad de imágenes, porque la calidad de nuestros productos
          habla por sí sola.
        </p>
      </header>

      <main className="container">
        {/* Sección de Comida */}
        <section className="product-section">
          <h2 className="section-title">Comida Premium</h2>
          <div className="grid">
            {comida.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Sección de Juguetes */}
        <section className="product-section">
          <h2 className="section-title">Juguetes</h2>
          <div className="grid">
            {juguetes.map(product => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
