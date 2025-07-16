import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';

const Description = ({ htmlContent, onPropsChange }) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(htmlContent || '');
  const editorRef = useRef(null);

  // Save when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) {
        if (editing) {
          setEditing(false);
          if (onPropsChange) {
            onPropsChange({ htmlContent: content });
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing, content, onPropsChange]);

  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center my-2 px-3"
      style={{ minHeight: '60vh' }}
    >
      {editing ? (
        <div ref={editorRef} className="w-100" style={{ maxWidth: 800 }}>
          <JoditEditor value={content} onChange={setContent} />
        </div>
      ) : (
        <div
          onDoubleClick={() => setEditing(true)}
          style={{ cursor: 'pointer', maxWidth: 800 }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
};

export default Description;
