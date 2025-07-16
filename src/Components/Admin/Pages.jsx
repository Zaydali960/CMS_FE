import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/appContext';

const Pages = () => {
  const { getPages, deletePageById, fetchPages } = useContext(AppContext);
  const [localPages, setLocalPages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (getPages) {
      setLocalPages(getPages);
    }
  }, [getPages]);

  const convertSlugToName = (slug) => {
    if (!slug) return '';
    return slug === '/' ? 'Home' : slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getPageLink = (slug) => {
    if (!slug || slug === '/') return '/';
    return `/${slug}`;
  };

  const getCoverImageFromPage = (components = []) => {
    for (let comp of components) {
      if (comp.type === 'carousal') {
        return comp.coverImage;
      }
    }
    return null;
  };

  const getDescriptionFromPage = (page) => {
    return page.metaDescription || 'No description available.';
  };

  const handleDelete = async (pageId) => {
    try {
      await deletePageById(pageId);
      setLocalPages((prevPages) => prevPages.filter((p) => p._id !== pageId));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const openMetaModal = (page) => {
    setSelectedPage(page);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPage(null);
  };

  const handleInputChange = (e) => {
    setSelectedPage({
      ...selectedPage,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">All Pages</h3>

      <div className="row">
        {localPages && localPages.length > 0 ? (
          localPages.map((page, index) => {
            const imageUrl = getCoverImageFromPage(page.components);
            const readableName = convertSlugToName(page.slug);
            const description = getDescriptionFromPage(page);

            return (
              <div className="col-md-4 col-sm-6 col-12 mb-4" key={page._id || index}>
                <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt={readableName}
                      className="card-img-top"
                      style={{ height: '220px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body d-flex flex-column p-4" style={{ backgroundColor: '#f9fafb' }}>
                    <h5 className="card-title">{readableName}</h5>
                    <p className="card-text text-muted">{description.slice(0, 100)}</p>

                    <div className="mt-auto d-flex flex-column gap-2">
                      <a
                        href={getPageLink(page.slug)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-dark w-100 rounded-pill"
                      >
                        View Page
                      </a>
                      <button
                        className="btn btn-outline-danger w-100 rounded-pill"
                        onClick={() => handleDelete(page._id)}
                      >
                        <i className="fas fa-trash me-2"></i> Delete Page
                      </button>
                      <button
                        className="btn btn-outline-primary w-100 rounded-pill"
                        onClick={() => openMetaModal(page)}
                      >
                        View Meta Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            <p>No pages found.</p>
          </div>
        )}
      </div>

      {/* ✅ Modal for Meta Details */}
      {showModal && selectedPage && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-3">
              <div className="modal-header">
                <h5 className="modal-title">Meta Details - {convertSlugToName(selectedPage.slug)}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={selectedPage.metaTitle || ''}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label>Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={selectedPage.metaDescription || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={() => alert('Hook up update logic')}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pages;
