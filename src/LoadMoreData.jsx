import { useState, useEffect } from "react";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${count * 20}`,
      );

      if (!response.ok) {
        throw new Error("Errore nel recupero dei dati");
      }

      const data = await response.json();

      if (data?.products?.length) {
        setProducts((prev) => [...prev, ...data.products]);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Qualcosa è andato storto. Riprova.");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [count]);

  useEffect(() => {
    if (products.length >= 100) setDisableButton(true);
  }, [products]);

  return (
    <div className="load-more-container">
      <h1>🛍️ Product Gallery</h1>

      {error && <p className="error">{error}</p>}

      <div className="product-container">
        {products.map((item) => (
          <div className="product" key={item.id}>
            <img
              src={item.thumbnail}
              alt={item.title}
              onError={(e) =>
                (e.target.src = "https://via.placeholder.com/150?text=No+Image")
              }
            />
            <p className="title">{item.title}</p>
            <p className="price">${item.price}</p>
          </div>
        ))}
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="button-container">
        <button
          disabled={disableButton || loading}
          onClick={() => setCount((prev) => prev + 1)}
        >
          {loading ? "Loading..." : "Load More Products"}
        </button>

        {disableButton && (
          <p className="end-message">🎉 Hai raggiunto il limite di prodotti</p>
        )}
      </div>
    </div>
  );
}
