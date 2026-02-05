import React, { useState, useEffect, useRef } from "react";
import Tour from "reactour";
import sketch from "./sketch.js";
import playButton from './icons8-spielen-100.png';
import pauseButton from './icons8-stop-100.png';
import { tutorialSteps } from './tutorialSteps.js';
import { AlgorithmSelector, LocalSearchSelector, SpeedControl, ActionButtons } from './components/ControlPanel/index.js';
import { VisualizationCanvas } from './components/Canvas/VisualizationCanvas.js';
import { ANIMATION } from './constants/config.js';
import './App.css';

const INITIAL_SPEED = ANIMATION.DEFAULT_SPEED;
const MAX_SPEED = ANIMATION.MAX_SPEED;

/**
 * Simplified App Component
 *
 * Design Principles:
 * 1. React is the single source of truth for all state
 * 2. Each button has one clear purpose
 * 3. No dual-purpose buttons
 * 4. Sketch executes commands, doesn't manage state
 */
export function App() {
  // ============ STATE ============
  // UI State
  const [addingNodes, setAddingNodes] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPlaying, setIsPlaying] = useState(true);
  const [pathToPic, setPathToPic] = useState(playButton);

  // Algorithm State
  const [algo, setAlgo] = useState("Not Selected");
  const [localSearch, setLocalSearch] = useState("Not Selected");

  // Execution State
  const [hasTour, setHasTour] = useState(false); // Does a tour exist?
  const [isExecuting, setIsExecuting] = useState(false); // Is something currently running?

  // Alert State
  const [showAlgoAlert, setShowAlgoAlert] = useState(false);
  const [showLocalSearchAlert, setShowLocalSearchAlert] = useState(false);

  // Commands to sketch (one-time signals)
  const [sketchCommand, setSketchCommand] = useState(null);

  // ============ HANDLERS ============

  const handleAlgoSelect = (e) => {
    setAlgo(e.label);
    setShowAlgoAlert(false);
  };

  const handleLocalSearchSelect = (e) => {
    setLocalSearch(e.label);
    setShowLocalSearchAlert(false);
  };

  const handleSpeedSelect = (value) => {
    setSpeed(value);
  };

  const handleSetIsPlaying = (bool) => {
    setIsPlaying(bool);
    setPathToPic(bool ? pauseButton : playButton);
  };

  const handleRunAlgorithm = () => {

    // Validate algorithm is selected
    if (algo === "Not Selected" || algo === "Select Algorithm") {
      setShowAlgoAlert(true);
      setTimeout(() => setShowAlgoAlert(false), 3000);
      return;
    }

    // Set execution state
    setIsExecuting(true);
    setAddingNodes(false);
    setPathToPic(pauseButton);

    // Send command to sketch
    setSketchCommand({
      type: 'runConstructionAlgorithm',
      algorithm: algo,
      timestamp: Date.now() // Ensure React detects the change
    });
  };

  const handleRunLocalSearch = () => {

    // Validate tour exists
    if (!hasTour) {
      return;
    }

    // Validate local search algorithm is selected
    if (localSearch === "Not Selected" || localSearch === "Select Algorithm") {
      setShowLocalSearchAlert(true);
      setTimeout(() => setShowLocalSearchAlert(false), 3000);
      return;
    }

    // Set execution state
    setIsExecuting(true);
    setAddingNodes(false);
    setPathToPic(pauseButton);

    // Send command to sketch
    setSketchCommand({
      type: 'runLocalSearch',
      algorithm: localSearch,
      timestamp: Date.now()
    });
  };

  const handleAddNodes = () => {
    setAddingNodes(!addingNodes);
  };

  const handleRemoveEdges = () => {

    if (!hasTour) {
      return;
    }

    // Clear tour state
    setHasTour(false);

    // Send command to sketch
    setSketchCommand({
      type: 'removeEdges',
      timestamp: Date.now()
    });
  };

  const handleClearBoard = () => {

    setAddingNodes(false);
    setHasTour(false);
    setIsExecuting(false);
    setPathToPic(playButton);

    // Send command to sketch
    setSketchCommand({
      type: 'clearBoard',
      timestamp: Date.now()
    });
  };

  const handlePlayPause = () => {

    if (isExecuting) {
      // Currently executing: Toggle play/pause
      handleSetIsPlaying(!isPlaying);
    } else if (!hasTour) {
      // No tour yet: Run construction algorithm (if selected)
      if (algo === "Not Selected" || algo === "Select Algorithm") {
        setShowAlgoAlert(true);
        setTimeout(() => setShowAlgoAlert(false), 3000);
      } else {
        handleRunAlgorithm();
      }
    } else if (hasTour) {
      // Has tour: Run local search (if selected)
      if (localSearch === "Not Selected" || localSearch === "Select Algorithm") {
        setShowLocalSearchAlert(true);
        setTimeout(() => setShowLocalSearchAlert(false), 3000);
      } else {
        handleRunLocalSearch();
      }
    }
  };

  // ============ CALLBACKS FROM SKETCH ============

  const onConstructionComplete = () => {
    setIsExecuting(false);
    setHasTour(true);
    setPathToPic(playButton);
    setSketchCommand(null); // Clear command
  };

  const onLocalSearchComplete = () => {
    setIsExecuting(false);
    setPathToPic(playButton);
    setSketchCommand(null); // Clear command
  };

  const onClearComplete = () => {
    setSketchCommand(null); // Clear command
  };

  const onRemoveEdgesComplete = () => {
    setSketchCommand(null); // Clear command
  };

  const onNodeAdded = () => {
    // When a node is added after a tour exists, invalidate the tour
    // The tour is no longer complete for all nodes
    if (hasTour) {
      setHasTour(false);
    }
  };

  // ============ INITIALIZATION ============

  const addNodesButtonRef = useRef();
  useEffect(() => {
    const button = addNodesButtonRef.current;
    button.click();
    const timer = setTimeout(() => button.click(), 3);
    return () => clearTimeout(timer);
  }, []);

  const closeTour = () => {
    setIsTourOpen(false);
  };

  // ============ RENDER ============

  return (
    <>
      {/* Header Banner */}
      <header className="header-banner">
        <div className="header-container">
          <h1 className="header-title">Route Optimization Visualizer</h1>
        </div>
      </header>

      {/* Algorithm Selection */}
      <AlgorithmSelector
        value={algo}
        onChange={handleAlgoSelect}
        showAlert={showAlgoAlert}
      />

      {/* Local Search Selection */}
      <LocalSearchSelector
        value={localSearch}
        onChange={handleLocalSearchSelect}
        showAlert={showLocalSearchAlert}
      />

      {/* Speed Slider */}
      <SpeedControl
        value={INITIAL_SPEED}
        onChange={handleSpeedSelect}
        maxSpeed={MAX_SPEED}
      />

      {/* Canvas Section */}
      <VisualizationCanvas
        sketch={sketch}
        addingNodes={addingNodes}
        algo={algo}
        speed={speed}
        localSearch={localSearch}
        isPlaying={isPlaying}
        setIsPlaying={handleSetIsPlaying}
        sketchCommand={sketchCommand}
        onConstructionComplete={onConstructionComplete}
        onLocalSearchComplete={onLocalSearchComplete}
        onClearComplete={onClearComplete}
        onRemoveEdgesComplete={onRemoveEdgesComplete}
        onNodeAdded={onNodeAdded}
      />

      {/* Buttons Section */}
      <ActionButtons
        addingNodes={addingNodes}
        hasTour={hasTour}
        runAlgoText="Run Algorithm" // Always the same
        localSearchText="Run Local Search"
        localSearchDisabled={!hasTour}
        pathToPic={pathToPic}
        addNodesButtonRef={addNodesButtonRef}
        onAddNodes={handleAddNodes}
        onRunAlgorithm={handleRunAlgorithm}
        onRunLocalSearch={handleRunLocalSearch}
        onRemoveEdges={handleRemoveEdges}
        onClear={handleClearBoard}
        onPlayPause={handlePlayPause}
      />

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
