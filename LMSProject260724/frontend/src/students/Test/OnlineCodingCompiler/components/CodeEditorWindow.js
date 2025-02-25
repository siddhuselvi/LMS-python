import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value) => {
        setValue(value);
        onChange("code", value);
    };

    return (
        <div >
            <Editor
                height="50vh"
                width={`100%`}
                language={language || "cpp"}
                value={value}
                theme={theme}
                defaultValue=""
                onChange={handleEditorChange}
            />
        </div>
    );
};
export default CodeEditorWindow;