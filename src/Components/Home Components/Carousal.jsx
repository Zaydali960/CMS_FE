import React, { useEffect, useState, useContext, useMemo } from 'react';
import AppContext from '../../Context/appContext';
import JoditEditor from 'jodit-react';

const Carousal = ({ coverImage, text, onPropsChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isEditing, setIsEditing] = useState(false);
  const [html, setHtml] = useState(text); // initialize with props.text

  const { siteData } = useContext(AppContext);

  const primaryColor = siteData?.primaryColor || '#ffffff'; // text color
  // const secondaryColor = `rgba(${siteData?.secondaryColor})` || 'rgba(128, 128, 128, 0.25)'; // background overlay
  const secondaryColor =  'rgba(128, 128, 128, 0.25)'; // background overlay

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="position-relative">
      <div id="mainCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src={coverImage}
              className="d-block w-100"
              alt="Slide"
              style={{ height: '800px', objectFit: 'cover' }}
            />
            <div
              className="carousel-caption d-flex flex-column justify-content-center align-items-center"
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                backgroundColor: secondaryColor,
                zIndex: 2,
              }}
              onDoubleClick={() => setIsEditing(true)}
            >
              {isEditing ? (
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
                  className={`${
                    isMobile ? 'fw-bold fs-3 px-2 text-center' : 'display-5 fw-bold px-5'
                  }`}
                  style={{ color: primaryColor, maxWidth: '900px' }}
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousal;