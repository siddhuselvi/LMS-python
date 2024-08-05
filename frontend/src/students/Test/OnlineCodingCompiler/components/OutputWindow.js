import React, { useEffect, useState } from "react";
import { getLastCompilerOutput } from "../../../../api/endpoints";
import { useTestContext } from "../../contextSub/Context";

const OutputWindow = () => {
    const [compileOutput, setCompileOutput] = useState([]);
    const [output, setOutput] = useState("");
    const { 
      studentIdCon,
      setStudentIdCon 
    } = useTestContext();

    useEffect(() => {
        getLastOutput();
    }, [studentIdCon, compileOutput, output]); // Run once on component mount and when studentIdCon changes

    const getLastOutput = () => {
        getLastCompilerOutput(studentIdCon)
          .then(data => {
            setCompileOutput(data);
            console.log('setCompileOutput: ', data);
            setOutput(formatOutput(data.last_output));
            console.log('setOutput: ', formatOutput(data.last_output));
          })
          .catch(error => console.error('Error fetching :', error));
    };

    const formatOutput = (output) => {
        if (!output) return "";
        return output
            .replace(/\n/g, "<br />")
            .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
    };

    return (
        <>
            <h1 className="output-title">Output</h1>
            <div 
                className="output-container" 
                style={{ padding: '10px' }} 
                dangerouslySetInnerHTML={{ __html: output }} 
            />
        </>
    );
};

export default OutputWindow;
