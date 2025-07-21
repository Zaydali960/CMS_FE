import React, { useContext, useState, useMemo } from 'react';
import AppContext from '../../Context/appContext';
import JoditEditor from 'jodit-react';

const Banner = ({ text, coverImage, onPropsChange }) => {
  const { siteData } = useContext(AppContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [html, setHtml] = useState(text); // initialize with props.text
  const token = localStorage.getItem('authToken');

  const primaryColor = siteData?.bannerPrimaryColor || '#000'; // Text color
  const secondaryColor = siteData?.bannerSecondaryColor || '#fde68a'; // Background/decoration

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Edit text...',
    style: {
      color: '#000000', // Force black text in editor
      backgroundColor: '#ffffff' // White background for editor
    }
  }), []);

  const handleSave = () => {
    setIsEditing(false);
    if (onPropsChange) {
      onPropsChange({ text: html });
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center g-4">
          {/* Text Section */}
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <div className="mb-4" onDoubleClick={() => setIsEditing(true)}>
              {isEditing && token ? (
                <>
                  <JoditEditor
                    value={html}
                    config={config}
                    onBlur={newContent => setHtml(newContent)}
                  />
                  <button className="btn btn-primary mt-3" onClick={handleSave}>
                    Save
                  </button>
                </>
              ) : (
                <div
                  style={{ color: primaryColor }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </div>
          
          {/* Image Section */}
          <div className="col-12 col-lg-6 order-2 order-lg-1">
            <div className="position-relative">
              <div
                className="rounded overflow-hidden"
                style={{
                  aspectRatio: '1/1',
                  background: `linear-gradient(135deg, #fef3c7 0%, ${secondaryColor} 100%)`,
                }}
              >
                <img
                  src={coverImage}
                  alt="Banner visual"
                  className="w-100 h-100 object-fit-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                className="position-absolute rounded"
                style={{
                  bottom: '-1rem',
                  right: '-1rem',
                  width: '6rem',
                  height: '6rem',
                  backgroundColor: secondaryColor,
                  opacity: '0.8',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;