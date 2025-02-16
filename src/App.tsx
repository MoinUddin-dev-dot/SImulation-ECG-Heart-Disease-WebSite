import React from "react";
import Button from "./components/Button";
import { Link } from "react-router-dom";
import "./globalStyles.css";

function App() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-black">
      <h1 className="mb-6 text-white font-bold" style={{ fontSize: "4rem" }}>
       Heart Disease ECG Simulator
      </h1>
      <h2 className="mb-12 text-lg text-gray-300">
        Submitted to <span className="font-semibold">Dr. Shaista Rais</span>
      </h2>
      <div className="flex space-x-4">
        <Link to={"/select-simulation-model"}>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition duration-200">
            Simulator
          </button>
        </Link>
        <Link to={"/select-queueing-model"}>
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-lg transition duration-200">
            Queueing Model
          </button>
        </Link>
      </div>
    </div>
  );
}

export default App;
