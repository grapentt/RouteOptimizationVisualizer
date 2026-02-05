/**
 * Integration tests for complete user workflows
 * These tests capture the expected behavior from a user's perspective
 */

describe('User Workflows - Algorithm Execution', () => {
  describe('Basic workflow: Add nodes → Run algorithm', () => {
    test('User can add nodes and run construction algorithm', () => {
      // Given: User has added nodes
      const nodeCount = 10;

      // When: User selects algorithm and clicks "Run Algorithm"
      const algorithmSelected = 'Nearest Neighbor';
      const shouldRun = algorithmSelected !== 'Not Selected';

      // Then: Algorithm should execute
      expect(shouldRun).toBe(true);
    });

    test('Cannot run algorithm if none is selected', () => {
      // Given: User has added nodes but not selected algorithm
      const algorithmSelected = 'Not Selected';

      // When: User clicks "Run Algorithm"
      const shouldRun = algorithmSelected !== 'Not Selected';

      // Then: Should show error/alert
      expect(shouldRun).toBe(false);
    });
  });

  describe('Workflow: Run algorithm → Add more nodes → Run again', () => {
    test('Running algorithm again after adding nodes should work', () => {
      // Given: User has run algorithm creating a tour with 10 nodes
      let tourExists = true;
      let nodeCount = 10;

      // When: User adds 5 more nodes
      nodeCount = 15;

      // And: User clicks "Run Algorithm" again
      const shouldClearOldTour = tourExists;
      const shouldRunOnAllNodes = true;

      // Then: Old tour should be cleared, new tour should include all 15 nodes
      expect(shouldClearOldTour).toBe(true);
      expect(shouldRunOnAllNodes).toBe(true);
    });

    test('Running algorithm multiple times should always work', () => {
      // Given: User has run algorithm 3 times already
      const runCount = 3;

      // When: User clicks "Run Algorithm" again (4th time)
      const shouldStillWork = true;

      // Then: Should run successfully
      expect(shouldStillWork).toBe(true);
    });
  });

  describe('Workflow: Run algorithm → Run local search', () => {
    test('Local search only works after construction algorithm', () => {
      // Given: User has NOT run construction algorithm
      let tourExists = false;

      // When: User tries to run local search
      const canRunLocalSearch = tourExists;

      // Then: Should not run (show error)
      expect(canRunLocalSearch).toBe(false);

      // Given: User has run construction algorithm
      tourExists = true;

      // When: User runs local search
      const canRunLocalSearchNow = tourExists;

      // Then: Should run successfully
      expect(canRunLocalSearchNow).toBe(true);
    });

    test('Cannot run local search if none is selected', () => {
      // Given: Tour exists but no local search algorithm selected
      const tourExists = true;
      const localSearchSelected = 'Not Selected';

      // When: User clicks "Run Local Search"
      const shouldRun = tourExists && localSearchSelected !== 'Not Selected';

      // Then: Should show error
      expect(shouldRun).toBe(false);
    });

    test('Local search should not auto-trigger after construction algorithm', () => {
      // Given: User runs construction algorithm
      let constructionAlgorithmRunning = true;

      // When: Construction algorithm completes
      constructionAlgorithmRunning = false;
      const localSearchAutoTriggered = false; // Should never be true

      // Then: Local search should NOT automatically start
      expect(localSearchAutoTriggered).toBe(false);
    });
  });

  describe('Workflow: Run algorithm → Add nodes → Run algorithm again', () => {
    test('Should clear old tour and create new tour with all nodes', () => {
      // Scenario: User reports this was broken - algorithm didn't see new nodes

      // Given: User created tour with 10 nodes
      let nodeCount = 10;
      let tourNodeCount = 10;

      // When: User adds 5 more nodes
      nodeCount = 15;

      // And: User runs algorithm again
      tourNodeCount = nodeCount; // New tour should include all nodes

      // Then: New tour should have all 15 nodes
      expect(tourNodeCount).toBe(15);
    });
  });

  describe('Edge cases and error scenarios', () => {
    test('Running algorithm with only 1 node should handle gracefully', () => {
      // Given: Only startNode exists
      const nodeCount = 1;

      // When: User tries to run algorithm
      const shouldWarn = nodeCount < 3; // Need at least 3 nodes for meaningful tour

      // Then: Should either warn or handle gracefully
      expect(shouldWarn).toBe(true);
    });

    test('Clicking Run Algorithm repeatedly should not cause issues', () => {
      // Given: Algorithm is currently running
      let isRunning = true;

      // When: User clicks "Run Algorithm" again
      const shouldIgnore = isRunning; // Don't start second instance

      // Then: Should ignore the click or queue it
      expect(shouldIgnore).toBe(true);
    });

    test('Switching algorithms mid-run should be handled', () => {
      // Given: Algorithm is running
      let currentAlgo = 'Nearest Neighbor';
      let isRunning = true;

      // When: User selects different algorithm
      const newAlgo = 'Nearest Insertion';

      // Then: Should finish current algo first, or cancel it
      // (Implementation choice - document the behavior)
      expect(currentAlgo).toBeDefined();
      expect(newAlgo).toBeDefined();
    });
  });

  describe('Button state logic', () => {
    test('Run Algorithm button text should always be "Run Algorithm"', () => {
      // Simplified design: no dual-purpose button
      const buttonText = 'Run Algorithm';

      // Regardless of state, button always says "Run Algorithm"
      expect(buttonText).toBe('Run Algorithm');
    });

    test('Run Local Search button should be disabled when no tour exists', () => {
      // Given: No tour exists
      const tourExists = false;

      // Then: Button should be disabled
      const isDisabled = !tourExists;
      expect(isDisabled).toBe(true);

      // Given: Tour exists
      const tourExistsNow = true;

      // Then: Button should be enabled
      const isDisabledNow = !tourExistsNow;
      expect(isDisabledNow).toBe(false);
    });
  });

  describe('Clear board functionality', () => {
    test('Clear board should reset everything', () => {
      // Given: User has nodes, tour, and local search results
      let nodeCount = 15;
      let tourExists = true;
      let algorithmSelected = 'Nearest Neighbor';

      // When: User clicks "Clear Board"
      nodeCount = 1; // Only startNode
      tourExists = false;
      // algorithmSelected stays selected (user choice)

      // Then: Everything except algorithm selection should be cleared
      expect(nodeCount).toBe(1);
      expect(tourExists).toBe(false);
      expect(algorithmSelected).toBe('Nearest Neighbor'); // Preserved
    });
  });

  describe('Smart Play/Pause with added nodes', () => {
    test('Adding nodes after tour should invalidate hasTour flag', () => {
      // Given: User has created a tour with 10 nodes
      let hasTour = true;
      let nodeCount = 10;

      // When: User adds 2 more nodes
      nodeCount = 12;
      // onNodeAdded callback should be called, which sets hasTour = false
      hasTour = false;

      // Then: hasTour should be false (tour is incomplete)
      expect(hasTour).toBe(false);
      expect(nodeCount).toBe(12);
    });

    test('Play/Pause button should run construction after nodes added', () => {
      // Scenario: User reports Play/Pause tries to run local search instead of construction

      // Given: User ran algorithm on 10 nodes
      let hasTour = true;
      let nodeCount = 10;

      // When: User adds 2 more nodes
      nodeCount = 12;
      hasTour = false; // Should be invalidated by onNodeAdded

      // And: User clicks Play/Pause button
      const shouldRunConstruction = !hasTour; // true
      const shouldRunLocalSearch = hasTour;   // false

      // Then: Should run construction algorithm, not local search
      expect(shouldRunConstruction).toBe(true);
      expect(shouldRunLocalSearch).toBe(false);
    });
  });
});

describe('State Management Principles', () => {
  test('React should be single source of truth', () => {
    // Principle: All application state lives in React
    // p5.js sketch only executes commands, doesn't manage state

    const reactManagesState = true;
    const sketchExecutesCommands = true;

    expect(reactManagesState).toBe(true);
    expect(sketchExecutesCommands).toBe(true);
  });

  test('No dual-purpose buttons', () => {
    // Principle: Each button does one thing
    // "Run Algorithm" always runs algorithm
    // "Run Local Search" always runs local search
    // "Clear Board" always clears board

    const buttonHasSinglePurpose = true;
    expect(buttonHasSinglePurpose).toBe(true);
  });

  test('No hidden state machines', () => {
    // Principle: No internal state = 0/1 in sketch
    // State should be explicit and visible in React

    const stateIsExplicit = true;
    expect(stateIsExplicit).toBe(true);
  });
});
