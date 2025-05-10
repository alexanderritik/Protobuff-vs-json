#!/bin/bash

# Enable error reporting
set -e

# Display header
echo "==============================================="
echo "JSON vs Protocol Buffers Benchmark"
echo "==============================================="

# Create output directory if it doesn't exist
mkdir -p output

# Check if TypeScript is compiled
if [ ! -d "dist" ] || [ ! -f "dist/benchmark.js" ]; then
  echo "Building TypeScript files..."
  npx tsc
fi

# Run the benchmark
echo "Running benchmark..."
node dist/benchmark.js

# Generate visualization
echo "Generating visualization..."
node dist/visualization.js

# Update visualization with actual results
echo "Updating visualization with actual results..."
node ./update-visualization.js

echo "==============================================="
echo "Benchmark complete!"
echo "Results are available in the output directory:"
echo "- Raw data: output/events.json and output/events.proto.bin"
echo "- Report: output/comparison-report.md"
echo "- Visualization: output/comparison-final.html"
echo "==============================================="

# Open the visualization in the default browser if possible
if command -v xdg-open &> /dev/null; then
  xdg-open output/comparison-final.html
elif command -v open &> /dev/null; then
  open output/comparison-final.html
elif command -v start &> /dev/null; then
  start output/comparison-final.html
else
  echo "Please open output/comparison-final.html in your browser to view the results"
fi