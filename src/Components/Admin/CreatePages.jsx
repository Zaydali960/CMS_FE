import React, {useState, useContext} from 'react'
import AppContext from '../../Context/appContext';

const CreatePages = () => {
    const { getPages, fetchPages, addCategory, siteData } = useContext(AppContext);
    const [showModal, setShowModal] = useState(false);
      const [categoryName, setCategoryName] = useState('');
      const [metaTitle, setMetaTitle] = useState('');
      const [metaDesc, setMetaDesc] = useState('');
      const [slug, setSlug] = useState('');
      const token = localStorage.getItem('authToken');
      const logo = siteData?.logo || ''
  const primaryColor = siteData?.primaryColor || '#000000ff';
  const secondaryColor = siteData?.secondaryColor || '#d4b4b4ff'; // fallback: warning yellow
  const tertiaryColor = siteData?.tertiaryColor || '#222831';

 const createCategoryObject = async () => {
//   const slug = categoryName
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, '')
//     .trim()
//     .replace(/\s+/g, '-');

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
  finally{
    
  }
};




  return (
    <div className='container mt-4'>
      <h2>Create New Pages</h2>
      <div className="mb-3">
                <label className="form-label">Category Name</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
                <label className="form-label">Slug</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
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
              <div className="">
                <button className="btn btn-secondary mx-2" onClick={() => setShowModal(false)}>Cancel</button>
                <button
                  className="btn"
                  style={{ backgroundColor: tertiaryColor, color: '#000' }}
                  onClick={() => {
                    createCategoryObject();
                    setShowModal(false);
                  }}
                >
                  Create
                </button>
    </div>
    </div>
  )
}

export default CreatePages
