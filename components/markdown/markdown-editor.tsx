import React from "react";
import MDEditor from '@uiw/react-md-editor';

export default function MarkdownEditor({setValueCallback, intialValue}:{setValueCallback:Function, intialValue:any}) {
  const [value, setValue] = React.useState("**Hello world!!!**");
  const onChange = (value : any) => {
    setValue(value);
    setValueCallback(value);
  }
  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={onChange}
      />
      
    </div>
  );
}