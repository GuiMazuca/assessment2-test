import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { useData } from '../state/DataContext';

function Items() {
  const { items, loading, error, fetchItems } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadItems = async () => {
      try {
        const result = await fetchItems(page, searchQuery);
        if (isMounted) {
          setHasNextPage(result.pagination?.hasNext || false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch items:', error);
        }
      }
    };

    loadItems();

    return () => {
      isMounted = false;
    };
  }, [fetchItems, page, searchQuery]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(1); 
  }, []);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const ItemRenderer = useCallback(({ index, style }) => {
    const item = items[index];
    return (
      <div style={style} className="item-row">
        <Link to={`/items/${item.id}`} className="item-link">
          <div className="item-content">
            <h3>{item.name}</h3>
            {item.price && <span className="price">${item.price}</span>}
          </div>
        </Link>
      </div>
    );
  }, [items]);

  const LoadingSkeleton = () => (
    <div className="skeleton-container">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-text skeleton-title"></div>
          <div className="skeleton-text skeleton-price"></div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading items: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="items-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : items.length === 0 ? (
        <div className="no-results">
          <p>No items found</p>
        </div>
      ) : (
        <>
          <div className="items-list-container">
            <List
              height={600} 
              itemCount={items.length}
              itemSize={80}
              className="virtualized-list"
            >
              {ItemRenderer}
            </List>
          </div>

          <div className="pagination-container">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .items-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .search-container {
          margin-bottom: 20px;
        }

        .search-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }

        .items-list-container {
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .virtualized-list {
          outline: none;
        }

        .item-row {
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          padding: 0 16px;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-link {
          text-decoration: none;
          color: inherit;
          width: 100%;
          display: block;
        }

        .item-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .item-content h3 {
          margin: 0;
          font-size: 16px;
          color: #333;
        }

        .price {
          font-weight: bold;
          color: #007bff;
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f8f9fa;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          font-weight: bold;
        }

        .skeleton-container {
          padding: 20px;
        }

        .skeleton-item {
          margin-bottom: 16px;
          padding: 16px;
          border: 1px solid #eee;
          border-radius: 8px;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-title {
          width: 60%;
          margin-bottom: 8px;
        }

        .skeleton-price {
          width: 20%;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .error-container {
          text-align: center;
          padding: 40px;
        }

        .error-container button {
          margin-top: 16px;
          padding: 8px 16px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
}

export default Items;