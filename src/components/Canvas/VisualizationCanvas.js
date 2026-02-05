import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

/**
 * Visualization canvas component
 * Wraps the ReactP5Wrapper with a cleaner interface
 *
 * New simplified architecture:
 * - Receives commands via sketchCommand prop
 * - Calls callbacks when operations complete
 * - No complex state synchronization
 */
export function VisualizationCanvas({
  sketch,
  addingNodes,
  algo,
  speed,
  localSearch,
  isPlaying,
  setIsPlaying,
  sketchCommand,
  onConstructionComplete,
  onLocalSearchComplete,
  onClearComplete,
  onRemoveEdgesComplete,
}) {
  return (
    <main className="main-content">
      <div className="canvas-container">
        <ReactP5Wrapper
          sketch={sketch}
          addingNodes={addingNodes}
          algo={algo}
          speed={speed}
          localSearch={localSearch}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          sketchCommand={sketchCommand}
          onConstructionComplete={onConstructionComplete}
          onLocalSearchComplete={onLocalSearchComplete}
          onClearComplete={onClearComplete}
          onRemoveEdgesComplete={onRemoveEdgesComplete}
        />
      </div>
    </main>
  );
}
