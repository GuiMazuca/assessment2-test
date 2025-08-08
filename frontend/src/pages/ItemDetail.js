import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../state/DataContext';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const { fetchItem, loading, error } = useData();

  useEffect(() => {
    let isMounted = true;

    const loadItem = async () => {
      try {
        const itemData = await fetchItem(id);
        if (isMounted) {
          setItem(itemData);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch item:', err);
          navigate('/');
        }
      }
    };

    loadItem();

    return () => {
      isMounted = false;
    };
  }, [id, navigate, fetchItem]);

  if (loading) {
    return (
      <div className="item-detail-container">
        <div className="loading-skeleton">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-category"></div>
          <div className="skeleton-text skeleton-price"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-container">
        <div className="error-message">
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist or couldn't be loaded.</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Items
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Items
      </button>

      <div className="item-card">
        <h1>{item.name}</h1>

        <div className="item-info">
          <div className="info-row">
            <strong>Category:</strong>
            <span>{item.category}</span>
          </div>

          <div className="info-row">
            <strong>Price:</strong>
            <span className="price">${item.price}</span>
          </div>

          {item.description && (
            <div className="info-row">
              <strong>Description:</strong>
              <span>{item.description}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .item-detail-container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .back-button {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: background-color 0.3s;
        }

        .back-button:hover {
          background-color: #545b62;
        }

        .item-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .item-card h1 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 28px;
        }

        .item-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .info-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .info-row strong {
          color: #666;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-row span {
          font-size: 16px;
          color: #333;
        }

        .price {
          color: #007bff;
          font-weight: bold;
          font-size: 20px;
        }

        .loading-skeleton {
          padding: 24px;
        }

        .skeleton-text {
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .skeleton-title {
          height: 32px;
          width: 60%;
        }

        .skeleton-category {
          width: 40%;
        }

        .skeleton-price {
          width: 30%;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error-message {
          text-align: center;
          padding: 40px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .error-message h2 {
          color: #dc3545;
          margin-bottom: 16px;
        }

        .error-message p {
          color: #666;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default ItemDetail;