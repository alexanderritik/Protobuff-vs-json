import express from 'express';
import path from 'path';
import fs from 'fs';
import protoService from './services/proto-service';

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from output directory
app.use('/output', express.static(path.join(__dirname, '../output')));

// Define routes
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON vs Protocol Buffers Explorer</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            padding: 20px;
            background-color: #f8f9fa;
        }
        .data-container {
            height: 500px;
            overflow-y: auto;
            font-family: monospace;
            white-space: pre-wrap;
            font-size: 0.9rem;
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        .header {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        h1 {
            color: #343a40;
        }
        .btn-primary {
            background-color: #0d6efd;
        }
        .stats {
            background-color: #e9f7ef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 5px solid #28a745;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="mb-4">JSON vs Protocol Buffers Data Explorer</h1>
            <p>This tool allows you to explore the data generated for the benchmark in both JSON and Protocol Buffers formats.</p>
        </div>

        <div class="row mb-4">
            <div class="col-md-6">
                <div class="stats">
                    <h4>Data Access Statistics</h4>
                    <div id="stats">Loading statistics...</div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="d-flex justify-content-end mb-3">
                    <div class="input-group" style="max-width: 300px;">
                        <span class="input-group-text">Event Index</span>
                        <input type="number" id="eventIndex" class="form-control" value="0" min="0">
                        <button class="btn btn-primary" id="loadEvent">Load Event</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">JSON Format</h5>
                        <span class="badge bg-secondary" id="jsonSize">0 bytes</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="data-container" id="jsonData">Loading...</div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-4">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Protocol Buffers Format</h5>
                        <span class="badge bg-secondary" id="protoSize">0 bytes</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="data-container" id="protoData">Loading...</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Benchmark Results</h5>
                    </div>
                    <div class="card-body">
                        <iframe src="/output/comparison-final.html" style="width: 100%; height: 600px; border: none;"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Load initial data
            loadEvent(0);
            loadStats();

            // Set up event listener for button
            document.getElementById('loadEvent').addEventListener('click', function() {
                const index = parseInt(document.getElementById('eventIndex').value);
                loadEvent(index);
            });
        });

        async function loadStats() {
            try {
                const response = await fetch('/api/stats');
                const stats = await response.json();

                // Update stats display
                let statsHtml = \`
                    <table class="table table-sm">
                        <tr>
                            <td><b>Total Events:</b></td>
                            <td>\${stats.totalEvents}</td>
                        </tr>
                        <tr>
                            <td><b>JSON File Size:</b></td>
                            <td>\${formatBytes(stats.jsonFileSize)}</td>
                        </tr>
                        <tr>
                            <td><b>Proto File Size:</b></td>
                            <td>\${formatBytes(stats.protoFileSize)}</td>
                        </tr>
                        <tr>
                            <td><b>Size Reduction:</b></td>
                            <td>\${stats.sizeReduction}%</td>
                        </tr>
                    </table>
                \`;

                document.getElementById('stats').innerHTML = statsHtml;
            } catch (error) {
                console.error('Error loading stats:', error);
                document.getElementById('stats').textContent = 'Error loading statistics.';
            }
        }

        async function loadEvent(index) {
            try {
                // Show loading
                document.getElementById('jsonData').textContent = 'Loading...';
                document.getElementById('protoData').textContent = 'Loading...';

                // Fetch the event data
                const response = await fetch(\`/api/event/\${index}\`);
                const data = await response.json();

                // Update JSON view
                document.getElementById('jsonData').textContent = JSON.stringify(data.jsonData, null, 2);
                document.getElementById('jsonSize').textContent = formatBytes(data.jsonSize);

                // Update Proto view - show the hexadecimal representation and the parsed data
                const protoContent = \`// Binary data (first 100 bytes shown):
\${data.protoHex}

// Parsed Protocol Buffer data:
\${JSON.stringify(data.protoData, null, 2)}\`;
                
                document.getElementById('protoData').textContent = protoContent;
                document.getElementById('protoSize').textContent = formatBytes(data.protoSize);
            } catch (error) {
                console.error('Error fetching event:', error);
                document.getElementById('jsonData').textContent = 'Error loading data.';
                document.getElementById('protoData').textContent = 'Error loading data.';
            }
        }

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    </script>
</body>
</html>
  `;
  res.send(html);
});

// API route to get statistics
app.get('/api/stats', (req, res) => {
  try {
    const outputDir = path.join(__dirname, '../output');
    const jsonFilePath = path.join(outputDir, 'events.json');
    const protoFilePath = path.join(outputDir, 'events.proto.bin');

    // Check if files exist
    if (!fs.existsSync(jsonFilePath) || !fs.existsSync(protoFilePath)) {
      return res.status(404).json({ error: 'Benchmark data files not found. Run the benchmark first.' });
    }

    // Get file sizes
    const jsonFileSize = fs.statSync(jsonFilePath).size;
    const protoFileSize = fs.statSync(protoFilePath).size;

    // Calculate size reduction
    const sizeReduction = ((jsonFileSize - protoFileSize) / jsonFileSize * 100).toFixed(2);

    // Try to determine total events by reading the JSON file
    let totalEvents = 0;
    try {
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      totalEvents = Array.isArray(jsonData) ? jsonData.length : 0;
    } catch (error) {
      console.error('Error reading JSON data for stats:', error);
    }

    res.json({
      totalEvents,
      jsonFileSize,
      protoFileSize,
      sizeReduction
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// API route to get a specific event in both formats
app.get('/api/event/:index', (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const outputDir = path.join(__dirname, '../output');
    const jsonFilePath = path.join(outputDir, 'events.json');
    const protoFilePath = path.join(outputDir, 'events.proto.bin');

    // Check if files exist
    if (!fs.existsSync(jsonFilePath) || !fs.existsSync(protoFilePath)) {
      return res.status(404).json({ error: 'Benchmark data files not found. Run the benchmark first.' });
    }

    // Get JSON data
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    
    // Validate index
    if (index < 0 || index >= jsonData.length) {
      return res.status(400).json({ error: `Invalid index. Must be between 0 and ${jsonData.length - 1}` });
    }

    const singleJsonData = jsonData[index];
    const jsonSize = Buffer.from(JSON.stringify(singleJsonData)).length;

    // Get Proto data using length prefixing
    const protoReadData = fs.readFileSync(protoFilePath);
    
    let currentEvent = null;
    let protoBytes: Buffer | null = null;
    let offset = 0;
    let currentIndex = 0;

    while (offset < protoReadData.length && currentIndex <= index) {
      // Read message length (4 bytes)
      const messageLength = protoReadData.readUInt32LE(offset);
      offset += 4;
      
      // Extract the message
      const messageBuffer = protoReadData.subarray(offset, offset + messageLength);
      
      if (currentIndex === index) {
        // This is the event we want
        protoBytes = messageBuffer;
        currentEvent = protoService.decodeEvent(messageBuffer);
        break;
      }
      
      offset += messageLength;
      currentIndex++;
    }

    if (!currentEvent || !protoBytes) {
      return res.status(404).json({ error: 'Event not found in Protocol Buffers data' });
    }

    // Convert binary data to hex string for display
    // Only show first 100 bytes to keep it manageable
    const displayLength = Math.min(protoBytes.length, 100);
    let hexView = '';
    for (let i = 0; i < displayLength; i++) {
      hexView += protoBytes[i].toString(16).padStart(2, '0') + ' ';
      if ((i + 1) % 16 === 0) hexView += '\n';
    }
    if (protoBytes.length > 100) hexView += '\n... (truncated)';

    res.json({
      jsonData: singleJsonData,
      jsonSize,
      protoData: currentEvent,
      protoSize: protoBytes.length,
      protoHex: hexView
    });
  } catch (error) {
    console.error('Error getting event:', error);
    res.status(500).json({ error: 'Failed to get event data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Data Explorer running at http://localhost:${PORT}`);
});