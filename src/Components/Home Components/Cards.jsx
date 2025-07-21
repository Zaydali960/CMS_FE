import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
import AppContext from '../../Context/appContext';
import JoditEditor from 'jodit-react';

const Cards = ({ cards: initialCards = [], onPropsChange }) => {
  const fileInputRef = useRef(null);
  const [cards, setCards] = useState(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [cardImgs, setCardImgs] = useState([]);
  const [newCards, setNewCards] = useState([
    { title: "", description: "", slug: "", showContact: false }
  ]);
  const [editingCard, setEditingCard] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingHtml, setEditingHtml] = useState('');
  const [editImageModalIndex, setEditImageModalIndex] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
const token = localStorage.getItem('authToken');
  const { siteData } = useContext(AppContext);

  const primaryColor = siteData?.primaryColor || '#000';
  const secondaryColor = siteData?.secondaryColor || '#f9fafb';

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Edit text...',
    style: {
      color: '#000000',
      backgroundColor: '#ffffff'
    }
  }), []);

  const handleEditStart = (cardIndex, field, currentValue) => {
    setEditingCard(cardIndex);
    setEditingField(field);
    setEditingHtml(currentValue || '');
  };

  const handleEditSave = () => {
    if (editingCard !== null && editingField) {
      const updatedCards = [...cards];
      updatedCards[editingCard][editingField] = editingHtml;
      setCards(updatedCards);
      onPropsChange?.({ cards: updatedCards });
    }
    setEditingCard(null);
    setEditingField(null);
    setEditingHtml('');
  };

  const uploadImageToCloudinary = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'Card_imgs');
    data.append('cloud_name', 'dmss0by2k');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dmss0by2k/image/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      setUploading(false);
      return result.secure_url || null;
    } catch (err) {
      console.error("Upload failed:", err);
      setUploading(false);
      return null;
    }
  };

  const handleImageUpdate = async () => {
    if (!newImageFile || editImageModalIndex === null) return;
    const imageUrl = await uploadImageToCloudinary(newImageFile);
    if (imageUrl) {
      const updatedCards = [...cards];
      updatedCards[editImageModalIndex].images = [{ url: imageUrl }];
      setCards(updatedCards);
      onPropsChange?.({ cards: updatedCards });
      setEditImageModalIndex(null);
      setNewImageFile(null);
      setPreviewImageUrl("");
    }
  };

  const handleNewCardChange = (index, field, value) => {
    const updated = [...newCards];
    updated[index][field] = field === 'showContact' ? value.target.checked : value;
    setNewCards(updated);
  };

  const handleImageSelect = async (file) => {
    const imageUrl = await uploadImageToCloudinary(file);
    if (imageUrl) {
      setCardImgs([{ url: imageUrl }]);
      setPreviewImageUrl(imageUrl);
    }
  };

  const handleSaveCards = () => {
    const updatedNewCards = newCards.map(card => ({ ...card, images: cardImgs }));
    const updatedCards = [...cards, ...updatedNewCards];
    setCards(updatedCards);
    onPropsChange?.({ cards: updatedCards });
    setShowModal(false);
    setNewCards([{ title: "", description: "", slug: "", showContact: false }]);
    setCardImgs([]);
    setPreviewImageUrl("");
  };

  const handleDeleteCard = (index) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
    onPropsChange?.({ cards: updatedCards });
  };

  return (
    <>
      <div className="container text-center">
        <div className="row mt-5 d-flex justify-content-center flex-wrap">
          {cards.map((product, index) => (
            <div className="col-md-4 col-12 mt-4" key={index}>
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                {product.images?.[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.title}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                  />
                )}
                 <div className="card-body p-4" style={{ backgroundColor: secondaryColor }}>
                  {token &&<div className="d-flex justify-content-between align-items-center mb-3">
                    <i className="fa fa-money" style={{ fontSize: "28px", color: primaryColor }}></i>
                    <div className="d-flex gap-2">
                      <i
                        className="fa-solid fa-image"
                        style={{ fontSize: '18px', color: primaryColor, cursor: 'pointer' }}
                        title="Edit Image"
                        onClick={() => setEditImageModalIndex(index)}
                      ></i>
                      <i
                        className="fa-solid fa-trash"
                        style={{ fontSize: '18px', color: 'red', cursor: 'pointer' }}
                        title="Delete Card"
                        onClick={() => handleDeleteCard(index)}
                      ></i>
                    </div>
                  </div>}

                  {/* Title */}
                  {editingCard === index && editingField === 'title' && token ? (
                    <div className="w-100">
                      <JoditEditor
                        value={editingHtml}
                        config={config}
                        onBlur={newContent => setEditingHtml(newContent)}
                      />
                      <button className="btn btn-sm btn-primary mt-2" onClick={handleEditSave}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <h5
                      className="card-title mb-0"
                      style={{ color: primaryColor, cursor: 'pointer' }}
                      onDoubleClick={() => handleEditStart(index, 'title', product.title)}
                      dangerouslySetInnerHTML={{ __html: product.title }}
                    />
                  )}

                  {/* Description */}
                  {editingCard === index && editingField === 'description' && token? (
                    <div>
                      <JoditEditor
                        value={editingHtml}
                        config={config}
                        onBlur={newContent => setEditingHtml(newContent)}
                      />
                      <button className="btn btn-sm btn-primary mt-2" onClick={handleEditSave}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <p
                      className="card-text text-muted"
                      style={{ fontSize: '15px', cursor: 'pointer' }}
                      onDoubleClick={() => handleEditStart(index, 'description', product.description)}
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  )}

                  {product.slug && (
                    <a
                      href={`/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn w-100 rounded-pill mt-3"
                      style={{ backgroundColor: primaryColor, color: 'white' }}
                    >
                      Read More
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          {token && <div className="col-md-4 col-12 mt-4" onClick={() => setShowModal(true)}>
            <div className="h-100 card border-0 rounded-4" style={{ border: `4px solid ${secondaryColor}`, cursor: 'pointer' }}>
              <div className="card-body text-start m-4" style={{ backgroundColor: secondaryColor }}>
                <i className="fa pb-3 fa-money" style={{ fontSize: "40px", color: primaryColor }}></i>
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '200px' }}>
                  <p className="h1 fw-bolder m-0" style={{ color: primaryColor }}>+</p>
                  <p className="mt-2 mb-0" style={{ color: primaryColor }}>Add more cards</p>
                </div>
              </div>
            </div>
          </div>}
        </div>
      </div>

      {/* Modals for adding and editing cards (same as your current setup) */}
      {/* Add Card Modal */}
     {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Cards</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                {newCards.map((card, index) => (
                  <div key={index} className="mb-3 border p-2 rounded">
                    <input type="text" className="form-control mb-2" placeholder="Title" value={card.title} onChange={(e) => handleNewCardChange(index, "title", e.target.value)} />
                    <input type="text" className="form-control mb-2" placeholder="Description" value={card.description} onChange={(e) => handleNewCardChange(index, "description", e.target.value)} />
                    <input type="file" className="form-control mb-2" onChange={(e) => e.target.files[0] && handleImageSelect(e.target.files[0])} />
                    {uploading && <div className="text-center my-2"><div className="spinner-border text-primary" role="status"></div></div>}
                    {previewImageUrl && <img src={previewImageUrl} alt="Preview" className="img-fluid mb-2" style={{ maxHeight: '180px' }} />}

                    <div className="form-check mt-2">
                      <input className="form-check-input" type="checkbox" id={`contactCheckbox-${index}`} checked={card.showContact} onChange={(e) => handleNewCardChange(index, "showContact", e)} />
                      <label className="form-check-label" htmlFor={`contactCheckbox-${index}`}>Show "Read More" Button</label>
                    </div>

                    {card.showContact && (
                      <input type="text" className="form-control mt-2" placeholder="Slug (e.g., my-product)" value={card.slug} onChange={(e) => handleNewCardChange(index, "slug", e.target.value)} />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveCards} disabled={uploading}>Save Cards</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {editImageModalIndex !== null && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Card Image</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setEditImageModalIndex(null);
                  setPreviewImageUrl("");
                  setNewImageFile(null);
                }}></button>
              </div>
              <div className="modal-body">
                {!previewImageUrl && cards[editImageModalIndex]?.images?.[0]?.url && (
                  <img
                    src={cards[editImageModalIndex].images[0].url}
                    alt="Old Preview"
                    className="img-fluid mb-2"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                {previewImageUrl && (
                  <img
                    src={previewImageUrl}
                    className="img-fluid mb-2"
                    alt="New Preview"
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                )}
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewImageFile(file);
                      setPreviewImageUrl(URL.createObjectURL(file));
                    }
                  }}
                />
                {uploading && <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setEditImageModalIndex(null);
                  setPreviewImageUrl("");
                  setNewImageFile(null);
                }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleImageUpdate} disabled={uploading}>Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;
