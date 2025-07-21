import React, { useContext, useState, useRef, useMemo } from 'react';
import AppContext from '../../Context/appContext';
import JoditEditor from 'jodit-react';

const Paragraph = ({ text, onPropsChange }) => {
  const { siteData } = useContext(AppContext);
const token = localStorage.getItem('authToken');
  const primaryColor = siteData?.primaryColor || '#000000';
  const secondaryColor = siteData?.secondaryColor || '#ffffff';

  const [isEditing, setIsEditing] = useState(false);
  const [html, setHtml] = useState(text); // initialize with props.text

  const config = useMemo(() => ({
    readonly: false,
    placeholder: 'Edit text...',
  }), []);

  const handleSave = () => {
    setIsEditing(false);
    if (onPropsChange) {
      onPropsChange({ text: html });
    }
  };

  return (
    <div onDoubleClick={() => setIsEditing(true)}>
      <div
        className="container d-flex flex-column justify-content-center align-items-center text-center my-5 px-3"
        style={{ minHeight: '20vh', backgroundColor: "white" }}
      >
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
            className="fs-5"
            style={{ maxWidth: '800px', width: '100%', color: primaryColor }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
};

export default Paragraph;
