import React, { useState, useEffect, useRef } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import Select from "react-select";
import ReactSlider from "react-slider";
import sketch from "./sketch.js";
import playButton from './icons8-spielen-100.png';
import pauseButton from './icons8-stop-100.png';
import './App.css';

const INITIAL_SPEED = 5;
const MAX_SPEED = 50;

const algoOptions = [
  { value: "0", label: "Select Algorithm" },
  { value: "1", label: "Nearest Insertion" },
  { value: "2", label: "Farthest Insertion" },
  { value: "3", label: "Nearest Neighbor" },
  { value: "4", label: "Nearest Neighbor Look Ahead (made up)" },
  { value: "5", label: "Brute Force" },
  { value: "7", label: "Christofides" }
];

const localSearchOptions = [
  { value: "0", label: "Select Algorithm" },
  { value: "1", label: "2-opt" },
  { value: "2", label: "3-opt" }
];

export function App() {
  const [addingNodes, setAddingNodes] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [clearingBoard, setClearingBoard] = useState(false);
  const [algo, setAlgo] = useState("Not Selected");
  const [localSearch, setLocalSearch] = useState("Not Selected");
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [pathToPic, setPathToPic] = useState(playButton);
  const [isPlaying, setIsPlaying] = useState(true);
  const [runAlgoText, setRunAlgoText] = useState("Run Algorithm");
  const [localSearchText, setLocalSearchText] = useState("Run Algorithm");
  const [removeEdges, setRemoveEdges] = useState(false);

  // Helper function for delayed operations
  const delay = (time) => new Promise(resolve => setTimeout(resolve, time / speed));

  const handleAlgoSelect = (e) => {
    setAddingNodes(false);
    setIsRunning(false);
    setAlgo(e.label);
  };

  const handleLocalSearchSelect = (e) => {
    setAddingNodes(false);
    setIsRunning(false);
    setLocalSearch(e.label);
  };

  const handleSpeedSelect = (value) => {
    setIsRunning(false);
    setSpeed(value);
  };

  const handleSetIsPlaying = (bool) => {
    setIsPlaying(bool);
    setPathToPic(bool ? pauseButton : playButton);
  };

  const handleRunAlgoButton = async () => {
    setAddingNodes(false);
    setClearingBoard(false);
    
    if (runAlgoText === "Run Algorithm") {
      setRemoveEdges(false);
      setIsRunning(true);
      setRunAlgoText("Remove Edges");
      setLocalSearchText("Run local search");
      setPathToPic(pauseButton);
    } else {
      setPathToPic(playButton);
      setRemoveEdges(true);
      setIsRunning(false);
      setRunAlgoText("Run Algorithm");
      setLocalSearchText("Run Algorithm");
    }

    await delay(500);
    setIsRunning(false);
  };

  const handleLocalSearchButton = async () => {
    setAddingNodes(false);
    setClearingBoard(false);
    setRemoveEdges(false);
    setIsRunning(true);
    setPathToPic(pauseButton);
    
    if (localSearchText === "Run Algorithm") {
      setLocalSearchText("Run local search");
    }
    if (runAlgoText === "Run Algorithm") {
      setRunAlgoText("Remove Edges");
    }

    await delay(500);
    setIsRunning(false);
  };

  const handlePlayPauseButton = () => {
    if (isPlaying) {
      handleSetIsPlaying(false);
    } else {
      handleSetIsPlaying(true);
    }
  };

  const handleAddNodesButton = () => {
    setAddingNodes(!addingNodes);
    setIsRunning(false);
    setClearingBoard(false);
  };

  // Initialize board
  const addNodesButtonRef = useRef();
  useEffect(() => {
    const button = addNodesButtonRef.current;
    button.click();
    const timer = setTimeout(() => button.click(), 3);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <header className="banner">
        <div className="banner__container">
          <h1>Route Optimization Visualizer</h1>
        </div>
      </header>

      <div className="dropdownContainer">
        <Select
          className="dropdown"
          options={algoOptions}
          onChange={handleAlgoSelect}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
        />
      </div>

      <div className="dropdownContainer">
        <Select
          className="dropdown"
          options={localSearchOptions}
          onChange={handleLocalSearchSelect}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
        />
      </div>

      <div className="sliderContainer">
        <label id="slider-label">Choose speed by sliding</label>
        <ReactSlider
          className="slider"
          ariaLabelledby="slider-label"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          max={MAX_SPEED}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          defaultValue={INITIAL_SPEED}
          onChange={handleSpeedSelect}
        />
      </div>

      <main className="Main">
        <div className="Canvas">
          <ReactP5Wrapper
            sketch={sketch}
            addingNodes={addingNodes}
            isRunning={isRunning}
            clearinBoard={clearingBoard}
            algo={algo}
            speed={speed}
            removeEdges={removeEdges}
            localSearch={localSearch}
            isPlaying={isPlaying}
            setIsPlaying={handleSetIsPlaying}
          />
        </div>
      </main>

      <div className="Buttons">
        <button
          ref={addNodesButtonRef}
          className="RunButton"
          onClick={handleAddNodesButton}
        >
          {addingNodes ? 'Stop adding Nodes' : 'Add Nodes'}
        </button>
        <button
          className="RunButton"
          onClick={handleRunAlgoButton}
        >
          {runAlgoText}
        </button>
        <button
          className="RunButton"
          onClick={handleLocalSearchButton}
        >
          {localSearchText}
        </button>
        <button
          className="RunButton"
          onClick={() => {
            setAddingNodes(false);
            setIsRunning(false);
            setClearingBoard(!clearingBoard);
          }}
        >
          Clear Board
        </button>
        <input
          type="image"
          src={pathToPic}
          className="PlayButton"
          onClick={handlePlayPauseButton}
          alt="Play/Pause"
        />
      </div>
    </>
  );
}

export default App;