import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../Context/appContext';

const BasicSettings = () => {
  const { siteData, updateBasicSettings } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    siteData?.logo 
  );

  const [formData, setFormData] = useState({
    primaryColor: '',
    secondaryColor: '',
    tertiaryColor: '',
    logo: '',
    whatsappNumber: '',
    contactNumber: '',
    metaTitle: '',
    metaDescription: '',
  });

  useEffect(() => {
    if (siteData) {
      setFormData({
        primaryColor: siteData.primaryColor || '',
        secondaryColor: siteData.secondaryColor || '',
        tertiaryColor: siteData.tertiaryColor || '',
        logo: siteData.logo || '',
        whatsappNumber: siteData.whatsappNumber || '',
        contactNumber: siteData.contactNumber || '',
        metaTitle: siteData.metaTitle || '',
        metaDescription: siteData.metaDescription || '',
      });
      setPreviewImage(siteData.logo || '');
    }
  }, [siteData]);

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
      console.error('Upload failed:', err);
      setUploading(false);
      return null;
    }
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      const uploadedUrl = await uploadImageToCloudinary(file);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, logo: uploadedUrl }));
        setPreviewImage(uploadedUrl);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    await updateBasicSettings(formData);
    alert('Settings updated successfully');
  };

  return (
    <div className="container mt-4">
      <h2>Basic Settings</h2>

      <div className="mb-3">
        <label>Primary Color</label>
        <input
          type="color"
          name="primaryColor"
          value={formData.primaryColor}
          onChange={handleChange}
          className="form-control form-control-color"
        />
      </div>

      <div className="mb-3">
        <label>Secondary Color</label>
        <input
          type="color"
          name="secondaryColor"
          value={formData.secondaryColor}
          onChange={handleChange}
          className="form-control form-control-color"
        />
      </div>
      <div className="mb-3">
        <label>Tertiary Color</label>
        <input
          type="color"
          name="tertiaryColor"
          value={formData.tertiaryColor}
          onChange={handleChange}
          className="form-control form-control-color"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold mb-2 d-block">Logo</label>

        {/* Image Preview */}
        <div
          className="d-flex align-items-center justify-content-center mb-3 border rounded"
          style={{ width: '200px', height: '180px', background: '#f8f9fa' }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Logo Preview"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <span className="text-muted">No logo uploaded</span>
          )}
        </div>

        {uploading && <p className="text-muted">Uploading logo...</p>}

        {/* File Input */}
        <input
          type="file"
          name="logo"
          onChange={handleChange}
          className="form-control"
          accept="image/*"
        />
      </div>

      <div className="mb-3">
        <label>WhatsApp Number</label>
        <input
          type="text"
          name="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={handleChange}
          className="form-control"
          placeholder="+923001234567"
        />
      </div>

      <div className="mb-3">
        <label>Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Meta Title</label>
        <input
          type="text"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label>Meta Description</label>
        <textarea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          className="form-control"
          rows="3"
        ></textarea>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>
        {uploading ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default BasicSettings;
