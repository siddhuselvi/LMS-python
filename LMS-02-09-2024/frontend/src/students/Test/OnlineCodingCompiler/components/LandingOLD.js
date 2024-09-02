import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import ThemeDropdown from "./ThemeDropdown";
import { useTestContext } from "../../contextSub/Context";
// import { addTestAnswerMapApi_Code_Com } from "../../../../api/endpoints";
import '../../../../Styles/global.css';
import Select from "react-select";
import { customStyles } from "../constants/customStyles";


const languageOptions = [
  { id: 71, label: "Select Lang...", value: "" },
  { id: 71, label: "Python", value: "python" },
  { id: 49, label: "C", value: "c" },
  { id: 54, label: "C++", value: "cpp" },
  { id: 62, label: "Java", value: "java" }
];

const API_URL = 'http://66.23.230.20:8000';


const Landing = () => {
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState("");
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [output, setOutput] = useState("");  // State to store the output

  const { 
    setCodeWindow,
    setLanguageSelected,
    setCustomInputCom,
    setOutputWindowCom
   } = useTestContext();


  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  const [selectLanguage, setSelectLanguage] = useState(languageOptions[0]);

  const handlChangeLanguage = (selectedOption) => {
    setSelectLanguage(selectedOption);
    console.log('Selected language:', selectedOption);
    setLanguageSelected(selectedOption.value);
  };


  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        setCodeWindow(data);
        // console.log('setCode: ', data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };


  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);


// Define detection functions for different languages
const languageDetectionMap = {
  python: (code) => {
    const pythonKeywords = [
      "def ", "import ", "print(", "lambda", "yield", 
      "async", "await", "class ", "try", "except", 
      "if __name__ == '__main__':", "elif", "for ", "while ", 
      "from ", "range(", "return", "pass"
    ];
    const notPythonPatterns = [/\{|\}/, /#include/, /cout|cin/, /std::/, /using\snamespace/];
    const hasPythonKeywords = pythonKeywords.some(keyword => code.includes(keyword));
    const hasNotPythonElements = notPythonPatterns.some(pattern => pattern.test(code));
    return hasPythonKeywords && !hasNotPythonElements;
  },
  cpp: (code) => {
    const cppKeywords = ["#include", "cout", "cin", "std::", "using namespace", "int main(", "::"];
    const notCppPatterns = [/public\sclass/, /def /, /print\(/, /System\.out\.println/, /# Python/, /printf\(/, /scanf\(/, /#include <stdio.h>/];
    const hasCppKeywords = cppKeywords.some(keyword => code.includes(keyword));
    const hasNotCppElements = notCppPatterns.some(pattern => pattern.test(code));
    return hasCppKeywords && !hasNotCppElements;
  },
  java: (code) => {
    const javaKeywords = ["public class", "public static void main", "System.out.println", "new ", "extends ", "implements "];
    const notJavaPatterns = [/#include/, /cout/, /cin/, /printf\(/, /def /];
    const hasJavaKeywords = javaKeywords.some(keyword => code.includes(keyword));
    const hasNotJavaElements = notJavaPatterns.some(pattern => pattern.test(code));
    return hasJavaKeywords && !hasNotJavaElements;
  },
  c: (code) => {
    const cKeywords = ["#include", "printf(", "scanf(", "int main(", "return 0;"];
    const notCElements = [/public\sclass/, /def /, /print\(/, /System\.out\.println/, /cout/, /cin/, /std::/];
    const hasCKeywords = cKeywords.some(keyword => code.includes(keyword));
    const hasNotCElements = notCElements.some(pattern => pattern.test(code));
    return hasCKeywords && !hasNotCElements;
  }
};


const handleSubmit = () => {
  setProcessing(true);

  const dataToSubmit = {
    code: code,
    p_type: selectLanguage.value,
    inputs: customInput,
  };

  // Validate if the code matches the selected language
  const validateLanguage = languageDetectionMap[selectLanguage.value];
  
  if (!validateLanguage || !validateLanguage(code)) {
    alert(`The provided code does not match the selected language: ${selectLanguage.label}.`);
    setProcessing(false);
    return;
  }

  // First API call to start the code execution
  axios.post(`${API_URL}/program-compiler/`, dataToSubmit)
    .then(response => {
      console.log("Full response:", response.data);

      // Check if the initial response status is CALLGETRESULT
      if (response.data && response.data.status === "CALLGETRESULT") {
        const taskId = response.data.task_id;

        const getResult = () => {
          axios.post(`${API_URL}/program-compiler/get-result`, {
            code: code,
            p_type: selectLanguage.value,
            task_id: taskId,
            inputs: customInput,
          })
          .then(getResultResponse => {
            console.log("Get Result response:", getResultResponse.data);

            if (getResultResponse.data.status === "SUCCESS") {
              setOutput(getResultResponse.data.result); 
              setOutputWindowCom(getResultResponse.data.result);
              console.log('Compiled Successfully!');
              setProcessing(false);
            } else if (getResultResponse.data.status === "PENDING") {
              console.log('Result is pending, retrying...');
              setTimeout(getResult, 2000); 
            } else if (getResultResponse.data.status === "FAILURE") {
              console.error("Execution failed:", getResultResponse.data.error);
              alert(`Execution failed: ${getResultResponse.data.error}`);
              setProcessing(false);
            } else {
              console.log(`Unexpected result status: ${getResultResponse.data.status}`);
              setProcessing(false);
            }
          })
          .catch(error => {
            console.error("Failed to get result:", error);
            alert("Failed to get result");
            setProcessing(false);
          });
        };

        // Start the polling for result
        getResult();

      } else if (response.data && response.data.status === "SUCCESS") {
        setOutput(response.data.result);
        setOutputWindowCom(response.data.result);
        console.log('Compiled Successfully!');
        setProcessing(false);

      } else if (response.data && response.data.status === "FAILURE") {
        console.error("Initial execution failed:", response.data.error);
        alert(`Execution failed: ${response.data.error}`);
        setProcessing(false);
        
      } else {
        console.log('Unexpected response status:', response.data.status || 'No status field');
        setProcessing(false);
      }
    })
    .catch(error => {
      console.error("Failed to submit:", error);
      alert("Failed to submit");
      setProcessing(false);
    });
};



  const handleSetCustomInput = (input) => {
    console.log("Input handle: ", input);
    setCustomInput(input);
    setCustomInputCom(input);
  };




  return (
    <>


      <ToastContainer />


      <div className="flex-row">
        <div className="dropdown-container">
          <Select
            options={languageOptions}
            value={selectLanguage}
            onChange={handlChangeLanguage}
            styles={customStyles}
          />
        </div>
        <div className="dropdown-container">
          <ThemeDropdown
            handleThemeChange={handleThemeChange}
            theme={theme}
          />
        </div>
        <div className="dropdown-container">
          <button
            onClick={() => { handleSubmit(); }}
            disabled={!code}
            className="compile-button"
          >
            {processing ? "Processing..." : "Run Code"}
          </button>
        </div>
      </div>


      <div className="mn-con">
        <div className="code-editor-container">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={selectLanguage}
            theme={theme.value}
          />
        </div>


      </div>

      <div className="mn-con" style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div className="custom-input-container">
            <CustomInput
              customInput={customInput}
              setCustomInput={handleSetCustomInput}

            />
          </div>

          <div className="output-details-n" style={{ marginLeft: '10px' }}>
            <OutputWindow output={output} />

          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;