import React, { useContext, useState, useEffect, useMemo } from 'react';
import AppContext from '../../Context/appContext';
import JoditEditor from 'jodit-react';

const PromoCardsBlock = ({ text1, text2, image1, image2, onPropsChange }) => {
  const { siteData } = useContext(AppContext);

  const primaryColor = siteData?.primaryColor || '#000000';
  const secondaryColor =  '#f5f5f5';
  const token = localStorage.getItem('authToken');

  const [isEditing1, setIsEditing1] = useState(false);
  const [isEditing2, setIsEditing2] = useState(false);
  const [html1, setHtml1] = useState(text1 || '');
  const [html2, setHtml2] = useState(text2 || '');

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Edit text...',
  }), []);

  useEffect(() => {
    setHtml1(text1 || '');
    setHtml2(text2 || '');
  }, [text1, text2]);

  const saveText1 = () => {
    setIsEditing1(false);
    onPropsChange?.({ text1: html1, text2: html2 });
  };

  const saveText2 = () => {
    setIsEditing2(false);
    onPropsChange?.({ text1: html1, text2: html2 });
  };

  return (
    <div className="container py-5">
      <div className="row g-4">

        {/* Card 1 */}
        <div className="col-md-6">
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center p-4 rounded"
            style={{ backgroundColor: secondaryColor, minHeight: '300px' }}
            onDoubleClick={() => setIsEditing1(true)}
          >
            {isEditing1 && token? (
              <>
                <JoditEditor
                  value={html1}
                  config={config}
                  onBlur={(content) => setHtml1(content)}
                />
                <button className="btn btn-primary mt-3" onClick={saveText1}>
                  Save
                </button>
              </>
            ) : (
              <div
                className="fs-5 mb-3"
                style={{ maxWidth: '800px', color: primaryColor }}
                dangerouslySetInnerHTML={{ __html: html1 || '<p>Double-click to edit</p>' }}
              />
            )}
            <img
              src={image1}
              alt="Promo 1"
              className="img-fluid"
              style={{ maxHeight: '190px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-6">
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center p-4 rounded"
            style={{ backgroundColor: secondaryColor, minHeight: '300px' }}
            onDoubleClick={() => setIsEditing2(true)}
          >
            {isEditing2  && token ? (
              <>
                <JoditEditor
                  value={html2}
                  config={config}
                  onBlur={(content) => setHtml2(content)}
                />
                <button className="btn btn-primary mt-3" onClick={saveText2}>
                  Save
                </button>
              </>
            ) : (
              <div
                className="fs-5 mb-3"
                style={{ maxWidth: '800px', color: primaryColor }}
                dangerouslySetInnerHTML={{ __html: html2 || '<p>Double-click to edit</p>' }}
              />
            )}
            <img
              src={image2}
              alt="Promo 2"
              className="img-fluid"
              style={{ maxHeight: '190px', objectFit: 'cover' }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PromoCardsBlock;
