import React, { useState, useEffect, useRef } from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import Select from "react-select";
import { tutorialSteps } from './tutorialSteps.js';
import ReactSlider from "react-slider";
import Tour from "reactour";
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
  const [algoHasRun, setAlgoHasRun] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(true);

  const closeTour = () => {
    setIsTourOpen(false);
  };

  // Helper function for delayed operations
  const delay = (time) => new Promise(resolve => setTimeout(resolve, time / speed));

  const handleAlgoSelect = (e) => {
    setAddingNodes(false);
    setIsRunning(false);
    setAlgo(e.label);
    setAlgoHasRun(false);
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

  const checkAlgorithmSelected = () => {
    if (algo === "Not Selected" || algo === "Select Algorithm") {
      setShowAlert(true);
      console.log("Alert");
      setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
      return false;
    }
    return true;
  };

  const handleRunAlgoButton = async () => {
    if (runAlgoText === "Run Algorithm" && !checkAlgorithmSelected()) {
      return;
    }

    setAddingNodes(false);
    setClearingBoard(false);
    
    if (runAlgoText === "Run Algorithm") {
      setRemoveEdges(false);
      setIsRunning(true);
      setRunAlgoText("Remove Edges");
      setLocalSearchText("Run local search");
      setPathToPic(pauseButton);
      setAlgoHasRun(true);
    } else {
      setPathToPic(playButton);
      setRemoveEdges(true);
      setIsRunning(false);
      setRunAlgoText("Run Algorithm");
      setLocalSearchText("Run Algorithm");
      setAlgoHasRun(false);
    }

    await delay(500);
    setIsRunning(false);
  };

  const handleLocalSearchButton = async () => {
    if (!checkAlgorithmSelected()) {
      return;
    }

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

  const handlePlayPauseButton = async () => {
    if (isRunning) {
      handleSetIsPlaying(!isPlaying);
      return;
    }

    if (algo !== "Not Selected" && algo !== "Select Algorithm" && !algoHasRun) {
      await handleRunAlgoButton();
      return;
    }

    if (algoHasRun && localSearch !== "Not Selected" && localSearch !== "Select Algorithm") {
      await handleLocalSearchButton();
      return;
    }

    if (!algoHasRun && !checkAlgorithmSelected()) {
      return;
    }

    handleSetIsPlaying(!isPlaying);
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
      {/* Header Banner */}
      <header className="header-banner">
        <div className="header-container">
          <h1 className="header-title">Route Optimization Visualizer</h1>
        </div>
      </header>
  
      {/* Algorithm Selection */}
      <div className="dropdown-wrapper">
        <div className={showAlert ? "select-warning" : ""}>
          <Select
            className="dropdown-menu algorithm-select"
            options={algoOptions}
            onChange={handleAlgoSelect}
            defaultValue={{ label: "Select Algorithm", value: 0 }}
          />
        </div>
      </div>
  
      {/* Local Search Selection */}
      <div className="dropdown-wrapper">
        <Select
          className="dropdown-menu local-search-select"
          options={localSearchOptions}
          onChange={handleLocalSearchSelect}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
        />
      </div>
  
      {/* Speed Slider */}
      <div className="slider-wrapper">
        <label id="slider-label">Choose speed by sliding</label>
        <ReactSlider
          className="slider-input speed-slider"
          ariaLabelledby="slider-label"
          thumbClassName="slider-thumb"
          trackClassName="slider-track"
          max={MAX_SPEED}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
          defaultValue={INITIAL_SPEED}
          onChange={handleSpeedSelect}
        />
      </div>
  
      {/* Canvas Section */}
      <main className="main-content">
        <div className="canvas-container">
          <ReactP5Wrapper
            sketch={sketch}
            addingNodes={addingNodes}
            isRunning={isRunning}
            clearingBoard={clearingBoard}
            algo={algo}
            speed={speed}
            removeEdges={removeEdges}
            localSearch={localSearch}
            isPlaying={isPlaying}
            setIsPlaying={handleSetIsPlaying}
          />
        </div>
      </main>
  
      {/* Buttons Section */}
      <div className="button-group">
        <button
          ref={addNodesButtonRef}
          className="action-button add-nodes-button"
          onClick={handleAddNodesButton}
        >
          {addingNodes ? 'Stop adding Nodes' : 'Add Nodes'}
        </button>
        <button
          className="action-button run-algorithm-button"
          onClick={handleRunAlgoButton}
        >
          {runAlgoText}
        </button>
        <button
          className="action-button run-local-search-button"
          onClick={handleLocalSearchButton}
        >
          {localSearchText}
        </button>
        <button
          className="action-button"
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
          className="play-button play-pause-button"
          onClick={handlePlayPauseButton}
          alt="Play/Pause"
        />
      </div>
  
      {/* Tutorial Walkthrough */}
      <Tour
        steps={tutorialSteps}
        isOpen={isTourOpen}
        onRequestClose={closeTour}
        showNumber={false}
        showButtons={true}
        showNavigation={true}
        showNavigationNumber={false}
        nextButton="Next"
        prevButton="Previous"
        lastStepNextButton="Finish"
        accentColor="#5cb85c"
      />
    </>
  );  
}

export default App;