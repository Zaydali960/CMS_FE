import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppContext from '../Context/appContext';

const Categories = () => {
  const { getPages, fetchPages, addCategory, siteData } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const token = localStorage.getItem('authToken');
  const { slug } = useParams();

  useEffect(() => {
    fetchPages();
  }, []);

  const slugToName = (slug) =>
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

 const createCategoryObject = async () => {
  const slug = categoryName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const category = {
    slug,
    metaTitle,
    metaDesc,
  };

  try {
    const result = await addCategory(category); // wait for the response
    if (result?.slug) {
      await fetchPages(); // ✅ refetch pages after addition
    }
  } catch (error) {
    console.error("Error creating category:", error);
  }
};

const logo = siteData?.logo || ''
  const primaryColor = siteData?.primaryColor || '#000000ff';
  const secondaryColor = siteData?.secondaryColor || '#d4b4b4ff'; // fallback: warning yellow
  const tertiaryColor = siteData?.tertiaryColor || '#222831'; // used as background

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark p-4 shadow-sm" style={{ backgroundColor: tertiaryColor }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/">
            <img src={logo} alt="Logo" height="50" className='rounded-circle'/>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
            <div className="navbar-nav align-items-center gap-3">
              {getPages
                ?.filter((page) => page.slug !== '/')
                .map((page, idx) => (
                  <Link key={idx} className="nav-link text-white fw-medium" to={`/${page.slug}`}>
                    {slugToName(page.slug)}
                  </Link>
                ))}
             {/* {token && <button
                className="btn rounded-circle d-flex justify-content-center align-items-center"
                style={{
                  width: 35,
                  height: 35,
                  backgroundColor: secondaryColor,
                  color: '#000',
                  fontWeight: 'bold'
                }}
                onClick={() => setShowModal(true)}
              >
                +
              </button>} */}
            </div>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                <label className="form-label">Meta Title</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Meta title for SEO"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                />
                <label className="form-label">Meta Description</label>
                <textarea
                  className="form-control"
                  placeholder="Meta description for SEO"
                  rows="3"
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: secondaryColor, color: '#000' }}
                  onClick={() => {
                    createCategoryObject();
                    setShowModal(false);
                  }}
                >
                  Create
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;
