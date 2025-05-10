#!/usr/bin/env node

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
    const regex = new RegExp(label + ':\\s*(\\d+(\\.\\d+)?)');
    const match = reportContent.match(regex);
    return match ? match[1] : 'N/A';
  };
  
  const serializationTimeJSON = getValueRegex('JSON: ');
  const protoSerializationMatch = reportContent.match(/Protocol Buffers: (\d+(\.\d+)?)ms/);
  const serializationTimeProto = protoSerializationMatch ? protoSerializationMatch[1] : 'N/A';
  
  const jsonDeserialization = reportContent.match(/JSON: (\d+(\.\d+)?)ms\\n- Protocol/);
  const deserializationTimeJSON = jsonDeserialization ? jsonDeserialization[1] : 'N/A';
  
  const protoDeserialization = reportContent.match(/Protocol Buffers: (\d+(\.\d+)?)ms\\n- \\*\\*Improvement/);
  const deserializationTimeProto = protoDeserialization ? protoDeserialization[1] : 'N/A';
  
  const jsonFileSize = reportContent.match(/JSON file size: (\d+(\.\d+)?) MB/);
  const fileSizeJSON = jsonFileSize ? jsonFileSize[1] : 'N/A';
  
  const protoFileSize = reportContent.match(/Protocol Buffers file size: (\d+(\.\d+)?) MB/);
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
  console.log(`Updated visualization with actual results: ${finalHtmlPath}`);
  
} catch (error) {
  console.error('Error updating visualization:', error);
  console.log('Make sure you have run the benchmark.ts script first.');
}
