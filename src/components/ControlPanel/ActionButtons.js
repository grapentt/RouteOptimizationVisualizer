import React from 'react';

/**
 * Action buttons component for controlling the visualization
 * Simplified: each button has one clear purpose
 */
export function ActionButtons({
  addingNodes,
  hasTour,
  runAlgoText,
  localSearchText,
  localSearchDisabled,
  pathToPic,
  addNodesButtonRef,
  onAddNodes,
  onRunAlgorithm,
  onRunLocalSearch,
  onRemoveEdges,
  onClear,
  onPlayPause,
}) {
  return (
    <div className="button-group">
      <button
        ref={addNodesButtonRef}
        className="action-button add-nodes-button"
        onClick={onAddNodes}
      >
        {addingNodes ? 'Stop adding Nodes' : 'Add Nodes'}
      </button>
      <button
        className="action-button run-algorithm-button"
        onClick={onRunAlgorithm}
      >
        {runAlgoText}
      </button>
      <button
        className="action-button run-local-search-button"
        onClick={onRunLocalSearch}
        disabled={localSearchDisabled}
        style={{
          opacity: localSearchDisabled ? 0.5 : 1,
          cursor: localSearchDisabled ? 'not-allowed' : 'pointer'
        }}
      >
        {localSearchText}
      </button>
      <button
        className="action-button remove-edges-button"
        onClick={onRemoveEdges}
        disabled={!hasTour}
        style={{
          opacity: !hasTour ? 0.5 : 1,
          cursor: !hasTour ? 'not-allowed' : 'pointer'
        }}
      >
        Remove Edges
      </button>
      <button
        className="action-button"
        onClick={onClear}
      >
        Clear Board
      </button>
      <input
        type="image"
        src={pathToPic}
        className="play-button play-pause-button"
        onClick={onPlayPause}
        alt="Play/Pause"
      />
    </div>
  );
}
