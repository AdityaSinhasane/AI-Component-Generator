import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCopySharp } from "react-icons/io5";
import { CgExport } from "react-icons/cg";
import { ImNewTab } from "react-icons/im";
import { LuRefreshCcw } from "react-icons/lu";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { MdOutlineClose } from "react-icons/md";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstrap", label: "HTML + Tailwind + Bootstrap" },
  ];

  const [darkMode, setDarkMode] = useState(true);
  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  // 👉 added: refreshKey
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

  async function getResponse() {
    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
          You are an experienced programmer with expertise in web development and UI/UX design.
          You create modern, animated, and fully responsive UI components.
          Framework to use: ${frameWork.value}
          Now generate: ${prompt}
          Return ONLY the full code in a single HTML file inside fenced code blocks.
        `,
      });
      setCode(extractCode(response.text));
      setOutputScreen(true);
      setRefreshKey((k) => k + 1); // reset preview when new code is generated
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GenUI-Code.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Downloaded");
  };

  // 👉 refresh handler
  const handleRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <div
        className={`flex items-center px-[100px] justify-between gap-[30px] transition-colors duration-300 ${
          darkMode ? "bg-[#09090B] text-white" : "bg-white text-black"
        }`}
      >
        {/* LEFT PANEL */}
        <div
          className={`left w-[50%] h-auto py-[30px] rounded-xl mt-5 p-[20px] ${
            darkMode ? "bg-[#141319]" : "bg-gray-100"
          }`}
        >
          <h3 className="text-[25px] font-semibold">AI Component Generator</h3>
          <p className="mt-2 text-[16px] text-gray-400">
            Describe your component and let AI code for you.
          </p>

          <p className="text-[15px] font-bold mt-4">Framework</p>
          <Select
            className="mt-2"
            options={options}
            value={frameWork}
            onChange={setFrameWork}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: darkMode ? "#111" : "#fff",
                borderColor: darkMode ? "#333" : "#ccc",
                color: darkMode ? "#fff" : "#000",
                boxShadow: "none",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#fff",
                color: "#000",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#eee"
                  : state.isFocused
                  ? "#f5f5f5"
                  : "#fff",
                color: "#000",
              }),
              singleValue: (base) => ({
                ...base,
                color: darkMode ? "#fff" : "#000",
              }),
              input: (base) => ({
                ...base,
                color: darkMode ? "#fff" : "#000",
              }),
            }}
          />

          <p className="text-[15px] font-bold mt-5">Describe your component</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your component and let AI code it."
            className={`w-full min-h-[200px] rounded-xl mt-3 p-3 ${
              darkMode ? "bg-[#09090B] text-white" : "bg-gray-50 text-black"
            }`}
          />

          <div className="flex items-center justify-between">
            <p className="text-gray-400">Click generate to get your code</p>
            <button
              onClick={getResponse}
              className="generate cursor-pointer flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 mt-3 px-[20px] gap-[10px] transition-all hover:opacity-80"
            >
              {!loading && <BsStars />}
              {loading && <ClipLoader color="white" size={20} />}
              Generate
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`right relative mt-2 w-[50%] h-[80vh] rounded-xl ${
            darkMode ? "bg-[#141319]" : "bg-gray-100"
          }`}
        >
          {!outputScreen ? (
            <div className="skeleton w-full h-full flex flex-col items-center justify-center">
              <div className="circle p-5 w-[70px] h-[70px] flex items-center justify-center text-[25px] rounded-full bg-gradient-to-r from-purple-400 to-purple-600">
                <HiOutlineCode />
              </div>
              <p className="text-[16px] text-gray-400 mt-3">
                Your component & code will appear here.
              </p>
            </div>
          ) : (
            <>
              <div
                className={`top w-full h-[60px] flex items-center gap-[15px] px-[20px] ${
                  darkMode ? "bg-[#17171C]" : "bg-gray-200"
                }`}
              >
                <button
                  onClick={() => setTab(1)}
                  className={`btn w-[50%] p-2 rounded-xl ${
                    tab === 1 ? "bg-[#333] text-white" : ""
                  }`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab(2)}
                  className={`btn w-[50%] p-2 rounded-xl ${
                    tab === 2 ? "bg-[#333] text-white" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              <div
                className={`top-2 w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px] ${
                  darkMode ? "bg-[#17171C]" : "bg-gray-200"
                }`}
              >
                <p className="font-bold">Code Editor</p>
                <div className="flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-[#333]"
                      >
                        <IoCopySharp />
                      </button>
                      <button
                        onClick={downloadFile}
                        className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-[#333]"
                      >
                        <CgExport />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsNewTabOpen(true)}
                        className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-[#333]"
                      >
                        <ImNewTab />
                      </button>
                      <button
                        onClick={handleRefresh}
                        className="w-10 h-10 rounded-xl border flex items-center justify-center hover:bg-[#333]"
                      >
                        <LuRefreshCcw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="editor h-full">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme="vs-dark"
                    language="html"
                  />
                ) : (
                  <iframe
                    key={refreshKey}
                    srcDoc={code}
                    className="preview w-full h-full bg-white text-black"
                    title="Preview"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTabOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#141319] w-screen h-screen overflow-hidden">
          <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-200 dark:border-gray-700">
            <span className="font-bold text-black dark:text-white">
              Preview
            </span>
            <button
              onClick={() => setIsNewTabOpen(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#222] hover:bg-[#333] text-white transition"
              title="Close"
            >
              <MdOutlineClose size={20} />
            </button>
          </div>

          <iframe
            key={refreshKey}
            srcDoc={code}
            className="w-full h-[calc(100vh-60px)] bg-white"
            title="Preview"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default Home;
