import React, {useState, useEffect, useRef} from "react";
import './App.css';
import { ReactP5Wrapper } from "react-p5-wrapper";
import sketch from "./sketch.js";
import Select from "react-select";
import ReactSlider from "react-slider";
import 'rc-slider/assets/index.css';

export function App() {

  async function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time/speed));
  }
  const [addingNodes, setAddingNodes] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [clearingBoard, setClearingBoard] = useState(false);
  //const algo = 'Nearest Neighbor';
  const [algo, setSelectedAlgo] = useState("Not Selected");
  const [localSearch, setSelectedLocalSearch] = useState("Not Selected");
  const [speed, setSpeed] = useState(5);
  const algoOptions = [
    { value: "0", label: "Select Algorithm" },
    { value: "1", label: "Nearest Insertion" },
    { value: "2", label: "Farthest Insertion" },
    { value: "3", label: "Nearest Neighbor" },
    { value: "4", label: "Nearest Neighbor Look Ahead (made up)" },
    { value: "5", label: "Brute Force" },
   // { value: "6", label: "Cluster naively" },
    { value: "7", label: "Christofides" }
  ];
  const localSearchOptions = [
    { value: "0", label: "Select Algorithm" },
    { value: "1", label: "2-opt" }
  ];
  const handleAlgoSelect = (e) => {
    setAddingNodes(false);
    setIsRunning(false);
    setSelectedAlgo(e.label);
  };
  const handleLocalSearchSelect = (e) => {
    setAddingNodes(false);
    setIsRunning(false);
    setSelectedLocalSearch(e.label);
  };
  const handleSpeedSelect = (value) => {
    setIsRunning(false);
    setSpeed(value);
  };
  const [runAlgoText, setRunAlgoText] = useState("Run Algorithm");
  const [localSearchText, setLocalSearchText] = useState("Run Algorithm");

  const handleRunAlgoButton = async () => {
    setAddingNodes(false);
    setClearingBoard(false);
    if (runAlgoText == "Run Algorithm") {
      setremoveEdges(false);
      setIsRunning(true);
      setRunAlgoText("Remove Edges");
      setLocalSearchText("Run local search");
    }
    else {
      setremoveEdges(true);
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
    setremoveEdges(false);
    setIsRunning(true); 
    if (localSearchText == "Run Algorithm") {
      setLocalSearchText("Run local search");
    }
    if (runAlgoText == "Run Algorithm") {
      setRunAlgoText("Remove Edges");
      // only then will we set isRunning to false, because if we do that we can run local search
      // if we don't set it, we can only run local search again, after it got changed
      await delay(500);
      setIsRunning(false); 
    }

  };
  

  const [removeEdges, setremoveEdges] = useState(false);


  //in the beginning we click the AddNodesButton 2, because of weird bug that it only works after clicking at least once
  const btn =useRef();
  useEffect(() => {btn.current.click(); setTimeout(() => btn.current.click(), 3);},[]); //setTimeout(() => {console.log('ha'); inputRef.current.handleClick() ; setAddingNodes(false); },2000);}, []);
  
  return (
    <>
    
    <div className="banner">
      <div className="banner__container">
        <h id="banner">Route Optimization Visualizer</h>
      </div>
    </div>

      
      <div className = "dropdownContainer"> 
        <Select className = "dropdown"
          options={algoOptions}
          onChange={handleAlgoSelect}        
          value={algoOptions.find(function (option) {
            return option.value === algo;
          })}
          defaultValue={{ label: "Select Algorithm", value: 0 }}
          label="Single select"
        />
      </div>

      <div className = "dropdownContainer"> 
        <Select className = "dropdown"
          options={localSearchOptions}
          onChange={handleLocalSearchSelect}        
          value={localSearchOptions.find(function (option) {
            return option.value === localSearch;
          })}
          defaultValue={{ label: "Select Local Search", value: 0 }}
          label="Single select"
        />
      </div>


      <div className = "sliderContainer">
      <label id="slider-label">Chose speed by sliding</label>
        <ReactSlider className = "slider"
        ariaLabelledby="slider-label"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        max = {50}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        defaultValue= {5}
        onChange ={handleSpeedSelect}
        />
      </div>
    

    <div className = "Main">
      <div className="Canvas">
        <ReactP5Wrapper sketch={sketch} addingNodes = {addingNodes} isRunning = {isRunning} 
                      clearinBoard = {clearingBoard} algo = {algo} speed = {speed} removeEdges = {removeEdges}
                      localSearch = {localSearch} /> 
      </div>
    </div>

  
    <div className = "Buttons">
      <button ref = {btn} className = "AddNodesButton" 
        onClick={()=>{
                  setAddingNodes(!addingNodes);
                  setIsRunning(false);
                  setClearingBoard(false);
                  } }>
                    {addingNodes ? 'Stop adding Nodes' : 'Add Nodes'}
        </button>
        <button className = "RunAlgoButton" 
                onClick={async ()=>{
                  await handleRunAlgoButton();
                  } }>
                    {runAlgoText}
        </button>
        <button className = "RunLocalSearchButton" 
                onClick={async ()=>{
                  await handleLocalSearchButton();
                  } }>
                    {localSearchText}
        </button>
        <button className = "ClearBoardButton" 
                onClick={()=>{
                  setAddingNodes(false);
                  setIsRunning(false);
                  setClearingBoard(!clearingBoard);
                } }>
          Clear Bord
        </button>
      </div>
      
    </>
  );
};

export default App;