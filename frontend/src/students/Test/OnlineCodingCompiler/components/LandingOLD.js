import React, { useEffect, useState, useRef } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropDown";
import { TestProvider } from "../../contextSub/Context";
import { useTestContext } from "../../contextSub/Context";
import { addTestAnswerMapApi_Code_Com } from "../../../../api/endpoints";
import '../../../../Styles/global.css';
import Select from "react-select";
import { customStyles } from "../constants/customStyles";


const languageOptions = [
  { id: 71, label: "Select Lang...", value: "python" },
  { id: 71, label: "Python", value: "python" },
  { id: 49, label: "C", value: "c" },
  { id: 54, label: "C++", value: "cpp" },
  { id: 62, label: "Java", value: "java" }
];




const Landing = () => {
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState("");
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");

  const { questionIdCon,
    setQuestionIdCon,
    testIdCon,
    setTestIdCon,
    studentIdCon,
    setStudentIdCon,
    selectedQuestionsCon,
    setSelectedQuestionsCon,
    testStartTimeCon,
    setTestStartTimeCon,
    outputWinAns,
    setOutputWinans,
    codeWindow,
    setCodeWindow,
    languageSelected,
    setLanguageSelected,
    customInputCom,
    setCustomInputCom } = useTestContext();


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
        console.log('setCode: ', data);
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


  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSubmit = () => {
    console.log('Landing Page Handle Submit..');

    setProcessing(true);

    // Construct answer objects
    const dataToSubmit = {
      test_name: testIdCon,
      question_id: questionIdCon,
      student_id: studentIdCon,
      dtm_start: testStartTimeCon,
      dtm_end: new Date(),
      code: code,
      p_type: selectLanguage.value,
      inputs: customInput,
    };

    console.log("Data to submit: ", dataToSubmit);

    addTestAnswerMapApi_Code_Com(dataToSubmit)
      .then(() => {
        console.log("Data Submitted Successfully in Compile and code");
        setProcessing(false);
       // showSuccessToast(`Compiled Successfully!`);
      })
      .catch(error => {
        console.log("Failed to submit", error);
        setProcessing(false);
        alert("Not Submitted");
        showErrorToast();
      });
  }


  const handlChangeLanguage1 = (lang) => {
    setSelectLanguage(lang.value);
    console.log('setSelectLanguage: ', lang.value);
  }


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
            <OutputWindow />

          </div>
        </div>
      </div>
    </>
  );
};
export default Landing;