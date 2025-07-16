import React, { useState } from 'react';
import JoditEditor from 'jodit-react';

const EditableField = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);

  return (
    <div onDoubleClick={() => setEditing(true)}>
      {editing ? (
        <JoditEditor
          value={value}
          onBlur={(newContent) => {
            setEditing(false);
            if (newContent !== value) {
              onChange(newContent);
            }
          }}
          config={{
            readonly: false,
            toolbarAdaptive: false,
            askBeforePasteHTML: false,
            defaultActionOnPaste: 'insert_as_html',
          }}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: value }} />
      )}
    </div>
  );
};

export default EditableField;
