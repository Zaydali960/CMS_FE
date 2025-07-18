import React, { useState, useEffect, useContext } from 'react';
import '../../src/App.css';

import AppContext from '../Context/appContext';
import Carousal from './Home Components/Carousal';
import Paragraph from './Home Components/Paragraph';
import Cards from './Home Components/Cards';
import Collection from './Home Components/Collection';
import Banner from './Home Components/Banner';
import PromoCards from './Home Components/PromoCardsBlock';

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

const Home = () => {
  const { fetchPages, getPages, updatePages, setGetPages, newPage, setNewPage } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [newCompIdx, setNewCompIdx] = useState(null);
  const [page, setPage] = useState({});
  const [editImageIndex, setEditImageIndex] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const home = getPages.find(p => p.slug === "/");
    if (home) {
      setPage(home);
    }
  }, [getPages]);

  const componentOptions = [
    { type: 'banner' },
    { type: 'cards' },
    { type: 'carousal' },
    { type: 'paragraph' },
    { type: 'promoCards' }
  ];

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...page.components];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    const updatedPage = { ...page, components: updated };
    setPage(updatedPage);
    setNewPage(updatedPage);
  };

  const moveDown = (index) => {
    if (index === page.components.length - 1) return;
    const updated = [...page.components];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    const updatedPage = { ...page, components: updated };
    setPage(updatedPage);
    setNewPage(updatedPage);
  };

  const deleteBlock = (index) => {
    const updatedComponents = [...page.components];
    updatedComponents.splice(index, 1);
    const updatedPage = { ...page, components: updatedComponents };
    setPage(updatedPage);
    setNewPage(updatedPage);
  };

  const handleAddComponent = (type) => {
    const template = defaultProps[type];
    const newBlock = {
      type,
      ...(template && JSON.parse(JSON.stringify(template)))
    };
    const updatedComponents = [...page.components];
    updatedComponents.splice(newCompIdx + 1, 0, newBlock);
    const updatedPage = { ...page, components: updatedComponents };
    setShowModal(false);
    setNewCompIdx(null);
    setPage(updatedPage);
    setNewPage(updatedPage);
  };

  const handleImageUpload = async () => {
    if (editImageIndex === null || !editImageFile) return;

    setIsUploading(true);

    const data = new FormData();
    data.append('file', editImageFile);
    data.append('upload_preset', 'Card_imgs');
    data.append('cloud_name', 'dmss0by2k');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dmss0by2k/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();

      if (result.secure_url) {
        const updatedComponents = [...page.components];
        updatedComponents[editImageIndex].coverImage = result.secure_url;
        const updatedPage = { ...page, components: updatedComponents };
        setPage(updatedPage);
        setNewPage(updatedPage);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setEditImageIndex(null);
      setEditImageFile(null);
      setImagePreview(null);
      setIsUploading(false);
    }
  };

  const componentMap = {
    banner: Banner,
    cards: Cards,
    carousal: Carousal,
    paragraph: Paragraph,
    promoCards: PromoCards,
  };

  return (
    <>
      <div>
        {page?.components?.length === 0 ? (
          <div className="text-center my-4">
            <p>No components added to this page yet.</p>
            {token && (
              <button className="btn btn-warning rounded-circle" onClick={() => {
                setShowModal(true);
                setNewCompIdx(-1);
              }}>+</button>
            )}
          </div>
        ) : (
        page?.components?.map((block, idx) => {
          const Component = componentMap[block.type];
          if (!Component) return null;
          return (
            <div key={idx} className="text-center">
              <div className={`${token ? "block-hover": ""}`} style={{ minHeight: "100px" }}>
                {token && <div onClick={() => moveUp(idx)} className="triangle-up mx-auto mb-3 "></div>}
                {token && <div className='position-relative mx-3 h4 ' style={{ minHeight: '40px' }}>
                  <div className="position-absolute top-0 end-0" style={{ cursor: 'pointer' }}>
                    {(block.type === "banner" || block.type === "carousal") && (
                      <i className="fa-solid fa-image me-3"
                        onClick={() => {
                          setEditImageIndex(idx);
                          setImagePreview(block.coverImage || null);
                        }}
                      ></i>
                    )}
                    <i className="fa-solid fa-trash-can mx-1"
                      onClick={() => deleteBlock(idx)}
                    ></i>
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
                    const updatedPage = { ...page, components: updatedComponents };
                    setPage(updatedPage);
                    setNewPage(updatedPage);
                  }}
                />
                {token && <div onClick={() => moveDown(idx)} className="triangle-down mx-auto mt-3 cursor-pointer"></div>}
              </div>
              {token && <div className="text-center my-2">
                <div
                  onClick={() => {
                    setShowModal(true);
                    setNewCompIdx(idx);
                  }}
                  role="button"
                  className="rounded-circle bg-warning text-center fw-bold d-inline-flex align-items-center justify-content-center"
                  style={{ width: '35px', height: '35px', cursor: 'pointer' }}>
                  +
                </div>
              </div>}
            </div>
          );
        })
        )}
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
                {componentOptions?.map((comp, index) => (
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

      {editImageIndex !== null && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Cover Image</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setEditImageIndex(null);
                  setEditImageFile(null);
                  setImagePreview(null);
                  setIsUploading(false);
                }}></button>
              </div>
              <div className="modal-body">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="img-fluid rounded shadow mb-3"
                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                  />
                )}
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditImageFile(file);
                    setImagePreview(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditImageIndex(null);
                    setEditImageFile(null);
                    setImagePreview(null);
                    setIsUploading(false);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleImageUpload}
                  disabled={!editImageFile || isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;