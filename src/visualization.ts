import fs from 'fs';
import path from 'path';

// This script generates an HTML visualization of the JSON vs Protocol Buffers benchmark results
// You should run this after running the benchmark.ts script

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Try to read the benchmark results
// In a real scenario, this would parse the actual results from a results file
// For this example, we'll use placeholder data that will be replaced with actual results
const serializationTimeJSON = 'SERIALIZATION_TIME_JSON';
const serializationTimeProto = 'SERIALIZATION_TIME_PROTO';
const deserializationTimeJSON = 'DESERIALIZATION_TIME_JSON';
const deserializationTimeProto = 'DESERIALIZATION_TIME_PROTO';
const fileSizeJSON = 'FILE_SIZE_JSON';
const fileSizeProto = 'FILE_SIZE_PROTO';

// Generate HTML with Charts.js
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JSON vs Protocol Buffers Comparison</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
        }
        h1, h2 {
            text-align: center;
            color: #2c3e50;
        }
        h1 {
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
        }
        .chart-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-bottom: 30px;
        }
        .chart-box {
            width: 45%;
            min-width: 400px;
            margin: 15px;
            background-color: white;
            border-radius: 6px;
            padding: 15px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .summary {
            background-color: #f8f9fa;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
        }
        canvas {
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .improvement {
            color: #4CAF50;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.9em;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>JSON vs Protocol Buffers Performance Comparison</h1>
        
        <div class="summary">
            <h3>Key Findings</h3>
            <p>This visualization compares the performance of JSON and Protocol Buffers for serializing and deserializing 100,000 sensor events.</p>
        </div>

        <div class="chart-container">
            <div class="chart-box">
                <h2>Serialization Time (ms)</h2>
                <canvas id="serializationChart"></canvas>
            </div>
            <div class="chart-box">
                <h2>Deserialization Time (ms)</h2>
                <canvas id="deserializationChart"></canvas>
            </div>
            <div class="chart-box">
                <h2>File Size (MB)</h2>
                <canvas id="fileSizeChart"></canvas>
            </div>
            <div class="chart-box">
                <h2>Performance Improvement (%)</h2>
                <canvas id="improvementChart"></canvas>
            </div>
        </div>

        <h2>Detailed Results</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>JSON</th>
                    <th>Protocol Buffers</th>
                    <th>Improvement</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Serialization Time</td>
                    <td>${serializationTimeJSON} ms</td>
                    <td>${serializationTimeProto} ms</td>
                    <td class="improvement" id="serializationImprovement"></td>
                </tr>
                <tr>
                    <td>Deserialization Time</td>
                    <td>${deserializationTimeJSON} ms</td>
                    <td>${deserializationTimeProto} ms</td>
                    <td class="improvement" id="deserializationImprovement"></td>
                </tr>
                <tr>
                    <td>File Size</td>
                    <td>${fileSizeJSON} MB</td>
                    <td>${fileSizeProto} MB</td>
                    <td class="improvement" id="fileSizeImprovement"></td>
                </tr>
            </tbody>
        </table>

        <div class="summary">
            <h3>Conclusions</h3>
            <p>Protocol Buffers offer significant advantages over JSON:</p>
            <ul>
                <li><strong>Size Efficiency:</strong> Protocol Buffers generate smaller payloads, reducing network bandwidth and storage requirements.</li>
                <li><strong>Processing Speed:</strong> Both serialization and deserialization are faster with Protocol Buffers.</li>
                <li><strong>Schema Definition:</strong> Protocol Buffers enforce a schema, ensuring data consistency.</li>
            </ul>
            <p>These benefits become increasingly important as the volume of data grows, making Protocol Buffers an excellent choice for high-throughput systems and IoT applications.</p>
        </div>

        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
    </div>

    <script>
        // Calculate improvement percentages
        const serializationTimeJSON = parseFloat('${serializationTimeJSON}');
        const serializationTimeProto = parseFloat('${serializationTimeProto}');
        const deserializationTimeJSON = parseFloat('${deserializationTimeJSON}');
        const deserializationTimeProto = parseFloat('${deserializationTimeProto}');
        const fileSizeJSON = parseFloat('${fileSizeJSON}');
        const fileSizeProto = parseFloat('${fileSizeProto}');

        const serializationImprovement = ((serializationTimeJSON - serializationTimeProto) / serializationTimeJSON * 100).toFixed(2) + '%';
        const deserializationImprovement = ((deserializationTimeJSON - deserializationTimeProto) / deserializationTimeJSON * 100).toFixed(2) + '%';
        const fileSizeImprovement = ((fileSizeJSON - fileSizeProto) / fileSizeJSON * 100).toFixed(2) + '%';

        document.getElementById('serializationImprovement').textContent = serializationImprovement;
        document.getElementById('deserializationImprovement').textContent = deserializationImprovement;
        document.getElementById('fileSizeImprovement').textContent = fileSizeImprovement;

        // Chart configurations
        // Serialization Time Chart
        new Chart(document.getElementById('serializationChart'), {
            type: 'bar',
            data: {
                labels: ['JSON', 'Protocol Buffers'],
                datasets: [{
                    label: 'Time (ms)',
                    data: [serializationTimeJSON, serializationTimeProto],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    borderColor: ['#FF6384', '#36A2EB'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Deserialization Time Chart
        new Chart(document.getElementById('deserializationChart'), {
            type: 'bar',
            data: {
                labels: ['JSON', 'Protocol Buffers'],
                datasets: [{
                    label: 'Time (ms)',
                    data: [deserializationTimeJSON, deserializationTimeProto],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    borderColor: ['#FF6384', '#36A2EB'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // File Size Chart
        new Chart(document.getElementById('fileSizeChart'), {
            type: 'bar',
            data: {
                labels: ['JSON', 'Protocol Buffers'],
                datasets: [{
                    label: 'Size (MB)',
                    data: [fileSizeJSON, fileSizeProto],
                    backgroundColor: ['#FF6384', '#36A2EB'],
                    borderColor: ['#FF6384', '#36A2EB'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Improvement Chart
        new Chart(document.getElementById('improvementChart'), {
            type: 'bar',
            data: {
                labels: ['Serialization', 'Deserialization', 'File Size'],
                datasets: [{
                    label: 'Improvement (%)',
                    data: [
                        parseFloat(serializationImprovement),
                        parseFloat(deserializationImprovement),
                        parseFloat(fileSizeImprovement)
                    ],
                    backgroundColor: '#4CAF50',
                    borderColor: '#4CAF50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    </script>
</body>
</html>`;

// Write the HTML file
const htmlFilePath = path.join(outputDir, 'comparison.html');
fs.writeFileSync(htmlFilePath, html);

console.log(`HTML visualization template created at: ${htmlFilePath}`);
console.log('Note: You will need to manually update the placeholder values with actual benchmark results after running the benchmark.');

// Create a script to update the visualization with actual results
const updateScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the benchmark results
// This assumes benchmark.ts has been run and has written the results
const outputDir = path.join(__dirname, '../output');
const reportPath = path.join(outputDir, 'comparison-report.md');
const htmlTemplatePath = path.join(outputDir, 'comparison.html');
const finalHtmlPath = path.join(outputDir, 'comparison-final.html');

// Extract results from the report
try {
  const reportContent = fs.readFileSync(reportPath, 'utf8');
  
  // Use regex to extract values
  const getValueRegex = (label) => {
    const regex = new RegExp(label + ':\\\\s*(\\\\d+(\\\\.\\\\d+)?)');
    const match = reportContent.match(regex);
    return match ? match[1] : 'N/A';
  };
  
  const serializationTimeJSON = getValueRegex('JSON: ');
  const protoSerializationMatch = reportContent.match(/Protocol Buffers: (\\d+(\\.\\d+)?)ms/);
  const serializationTimeProto = protoSerializationMatch ? protoSerializationMatch[1] : 'N/A';
  
  const jsonDeserialization = reportContent.match(/JSON: (\\d+(\\.\\d+)?)ms\\\\n- Protocol/);
  const deserializationTimeJSON = jsonDeserialization ? jsonDeserialization[1] : 'N/A';
  
  const protoDeserialization = reportContent.match(/Protocol Buffers: (\\d+(\\.\\d+)?)ms\\\\n- \\\\*\\\\*Improvement/);
  const deserializationTimeProto = protoDeserialization ? protoDeserialization[1] : 'N/A';
  
  const jsonFileSize = reportContent.match(/JSON file size: (\\d+(\\.\\d+)?) MB/);
  const fileSizeJSON = jsonFileSize ? jsonFileSize[1] : 'N/A';
  
  const protoFileSize = reportContent.match(/Protocol Buffers file size: (\\d+(\\.\\d+)?) MB/);
  const fileSizeProto = protoFileSize ? protoFileSize[1] : 'N/A';
  
  // Read the HTML template
  let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf8');
  
  // Replace placeholders with actual values
  htmlContent = htmlContent.replace(/SERIALIZATION_TIME_JSON/g, serializationTimeJSON);
  htmlContent = htmlContent.replace(/SERIALIZATION_TIME_PROTO/g, serializationTimeProto);
  htmlContent = htmlContent.replace(/DESERIALIZATION_TIME_JSON/g, deserializationTimeJSON);
  htmlContent = htmlContent.replace(/DESERIALIZATION_TIME_PROTO/g, deserializationTimeProto);
  htmlContent = htmlContent.replace(/FILE_SIZE_JSON/g, fileSizeJSON);
  htmlContent = htmlContent.replace(/FILE_SIZE_PROTO/g, fileSizeProto);
  
  // Write the final HTML file
  fs.writeFileSync(finalHtmlPath, htmlContent);
  console.log(\`Updated visualization with actual results: \${finalHtmlPath}\`);
  
} catch (error) {
  console.error('Error updating visualization:', error);
  console.log('Make sure you have run the benchmark.ts script first.');
}
`;

const updateScriptPath = path.join(__dirname, '../update-visualization.js');
fs.writeFileSync(updateScriptPath, updateScript);
fs.chmodSync(updateScriptPath, '755'); // Make the script executable

console.log(`Created update script at: ${updateScriptPath}`);