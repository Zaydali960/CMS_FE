import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AppContext from '../Context/appContext';

import Carousal from './CategoryPageComponents/Carousal';
import Cards from './CategoryPageComponents/Cards';
import Banner from './CategoryPageComponents/Banner';
import Description from './Home Components/Paragraph';
import Paragraph from './Home Components/Paragraph';

const componentMap = {
  carousal: Carousal,
  cards: Cards,
  banner: Banner,
  paragraph: Paragraph
};

const defaultProps = {
  carousal: {
    text: "New Banner Text",
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvcHBpbmd8ZW58MHx8MHx8fDA%3D",
    cards: [],
  },
  cards: {
    cards: [
      {
        title: "New Product",
        description: "Product description",
        images: [{ url: "https://example.com/image.jpg" }],
        slug: "new-product"
      }
    ]
  },
  banner: {
    text: "New Banner Text",
    coverImage: "https://media.istockphoto.com/id/1073935306/photo/girls-carrying-shopping-bags.jpg?s=612x612&w=0&k=20&c=JB-TrME32dc0VTnaXVxsbJIExZqR71m-iyVOnG-7puM="
  },
  paragraph: {
    text: "This is a new paragraph"
  },
  promoCards: {
    text1: "Men's Wear",
    image1: "../../Image/Boy Fashion.png",
    text2: "Women's Wear",
    image2: "../../Image/Girl Fashion.png",
  }
};

const CategoryPage = () => {
  const { getPages, fetchPages, setNewPage, categoryUpdatePages, setCategoryUpdatePages } = useContext(AppContext);
  const { slug } = useParams();

  const [page, setPage] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newCompIdx, setNewCompIdx] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editImageModalIndex, setEditImageModalIndex] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const token = localStorage.getItem('authToken');
  

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    const matched = getPages.find(p => p.slug === slug);
    if (matched) {
      setPage(matched);
    } else {
      setPage({});
    }
  }, [getPages, slug]);

  const componentOptions = Object.keys(componentMap).map(key => ({ type: key }));

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...page.components];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updatePage(updated);
  };

  const moveDown = (index) => {
    if (index === page.components.length - 1) return;
    const updated = [...page.components];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updatePage(updated);
  };

  const deleteBlock = (index) => {
    const updated = [...page.components];
    updated.splice(index, 1);
    updatePage(updated);
  };

  const handleAddComponent = (type) => {
    const template = defaultProps[type];
    const newBlock = {
      type,
      ...(template && JSON.parse(JSON.stringify(template)))
    };

    const updated = [...page.components];
    updated.splice(newCompIdx + 1, 0, newBlock);
    updatePage(updated);
    setShowModal(false);
    setNewCompIdx(null);
  };

  const updatePage = (updatedComponents) => {
    const updatedPage = { ...page, components: updatedComponents };
    setPage(updatedPage);
    setCategoryUpdatePages(updatedPage);
  };

  const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Card_imgs');
    data.append('cloud_name', 'dmss0by2k');

    const res = await fetch('https://api.cloudinary.com/v1_1/dmss0by2k/image/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    return result.secure_url || null;
  };

  const handleImageUpdate = async () => {
    if (!newImageFile || editImageModalIndex === null) return;
    setLoadingImage(true);
    const imageUrl = await uploadImageToCloudinary(newImageFile);
    setLoadingImage(false);
    if (imageUrl) {
      const updated = [...page.components];
      updated[editImageModalIndex].coverImage = imageUrl;
      updatePage(updated);
      setEditImageModalIndex(null);
      setNewImageFile(null);
      setPreviewImage(null);
    }
  };

  if (!page?.components?.length) {
    return <h2 className="text-center mt-5">Category not found</h2>;
  }

  return (
    <>
      <div className="category-page">
        {page.components.map((block, idx) => {
          const Component = componentMap[block.type];
          if (!Component) return null;

          return (
            <div key={idx} className="text-center">
              <div className={`${token ? "block-hover": ""} py-3`} style={{ minHeight: "100px" }}>
                {token && <div onClick={() => moveUp(idx)} className="triangle-up mx-auto mb-3" style={{ cursor: "pointer" }}></div>}
               {token &&  <div className='position-relative mx-3 h4' style={{ minHeight: '40px' }}>
                  <div className="position-absolute top-0 end-0" style={{ cursor: 'pointer' }}>
                    {['banner', 'carousal'].includes(block.type) && (
                      <i className="fa-solid fa-image me-3" onClick={() => {
                        setEditImageModalIndex(idx);
                        setPreviewImage(page.components[idx]?.coverImage || null);
                      }}></i>
                    )}
                    <i className="fa-solid fa-trash-can" onClick={() => deleteBlock(idx)}></i>
                  </div>
                </div>}
                <Component
                  {...block}
                  onPropsChange={(updatedProps) => {
                    const updatedComponents = [...page.components];
                    updatedComponents[idx] = {
                      ...updatedComponents[idx],
                      ...updatedProps,
                    };
                    updatePage(updatedComponents);
                  }}
                />
                {token && <div onClick={() => moveDown(idx)} className="triangle-down mx-auto mt-3" style={{ cursor: "pointer" }}></div>}
              </div>
              <div className="text-center my-2">
                {token && <div
                  onClick={() => {
                    setShowModal(true);
                    setNewCompIdx(idx);
                  }}
                  role="button"
                  className="rounded-circle bg-warning text-center fw-bold d-inline-flex align-items-center justify-content-center"
                  style={{ width: '35px', height: '35px', cursor: 'pointer' }}
                >
                  +
                </div>}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Components</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {componentOptions.map((comp, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <div
                      onClick={() => handleAddComponent(comp.type)}
                      className='box m-2 d-flex border border-primary'
                      style={{ width: '40px', height: '40px', cursor: 'pointer' }}
                    ></div>
                    <p className="mb-0">{comp.type}</p>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editImageModalIndex !== null && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Component Image</h5>
                <button type="button" className="btn-close" onClick={() => setEditImageModalIndex(null)}></button>
              </div>
              <div className="modal-body">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded mb-3"
                  />
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewImageFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditImageModalIndex(null)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleImageUpdate} disabled={loadingImage}>
                  {loadingImage ? 'Uploading...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPage;
