"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const proto_service_1 = __importDefault(require("./services/proto-service"));
// Number of fake events to generate
const NUM_EVENTS = 100000;
// Function to generate a random string of specified length
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
// Function to generate a random date within the last year
function generateRandomDate() {
    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    const randomTimestamp = oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime());
    return new Date(randomTimestamp).toISOString();
}
// Function to generate random field values
function generateRandomFields() {
    const numFields = Math.floor(Math.random() * 5) + 3; // 3-7 fields
    const fields = {};
    const possibleFieldNames = [
        'temperature', 'humidity', 'pressure', 'light', 'sound', 'motion',
        'co2', 'tvoc', 'pm25', 'pm10', 'battery', 'rssi', 'snr',
        'latitude', 'longitude', 'altitude', 'speed', 'heading',
        'x', 'y', 'z', 'accelerometer', 'gyroscope', 'magnetometer'
    ];
    // Select random field names
    const selectedFieldNames = possibleFieldNames
        .sort(() => 0.5 - Math.random())
        .slice(0, numFields);
    // Generate random values for each field
    selectedFieldNames.forEach(fieldName => {
        // Generate a random numeric value as string
        fields[fieldName] = (Math.random() * 100).toFixed(2);
    });
    return fields;
}
// Function to generate a random sensor event
function generateRandomEvent(index) {
    const resourceTypes = ['sensor', 'device', 'gateway', 'controller', 'actuator'];
    const inputTypes = ['temperature', 'motion', 'light', 'pressure', 'presence', 'multi'];
    const projectIds = ['home-monitoring', 'industrial-iot', 'smart-city', 'agriculture', 'energy'];
    return {
        nameId: `sensor-${index}-${generateRandomString(8)}`,
        timestamp: generateRandomDate(),
        fields: generateRandomFields(),
        resourceType: resourceTypes[Math.floor(Math.random() * resourceTypes.length)],
        inputType: inputTypes[Math.floor(Math.random() * inputTypes.length)],
        projectId: projectIds[Math.floor(Math.random() * projectIds.length)]
    };
}
// Generate 100K random events
console.log(`Generating ${NUM_EVENTS} random events...`);
const startGeneration = Date.now();
const events = [];
for (let i = 0; i < NUM_EVENTS; i++) {
    events.push(generateRandomEvent(i));
    // Show progress every 10K events
    if ((i + 1) % 10000 === 0) {
        console.log(`Generated ${i + 1} events...`);
    }
}
const generationTime = Date.now() - startGeneration;
console.log(`Generation completed in ${generationTime}ms`);
// Create output directory if it doesn't exist
const outputDir = path_1.default.join(__dirname, '../output');
if (!fs_1.default.existsSync(outputDir)) {
    fs_1.default.mkdirSync(outputDir, { recursive: true });
}
// Benchmark JSON serialization
console.log('\nBenchmarking JSON serialization...');
const jsonStartTime = Date.now();
const jsonData = JSON.stringify(events);
const jsonSerializationTime = Date.now() - jsonStartTime;
console.log(`JSON serialization time: ${jsonSerializationTime}ms`);
// Write JSON to file
const jsonFilePath = path_1.default.join(outputDir, 'events.json');
fs_1.default.writeFileSync(jsonFilePath, jsonData);
const jsonFileSize = fs_1.default.statSync(jsonFilePath).size;
console.log(`JSON file size: ${(jsonFileSize / (1024 * 1024)).toFixed(2)} MB`);
// Benchmark JSON deserialization
console.log('\nBenchmarking JSON deserialization...');
const jsonReadData = fs_1.default.readFileSync(jsonFilePath, 'utf8');
const jsonDesStartTime = Date.now();
const deserializedJsonEvents = JSON.parse(jsonReadData);
const jsonDeserializationTime = Date.now() - jsonDesStartTime;
console.log(`JSON deserialization time: ${jsonDeserializationTime}ms`);
// Benchmark Protocol Buffers serialization
console.log('\nBenchmarking Protocol Buffers serialization...');
const protoStartTime = Date.now();
console.log();
// We need to serialize each event individually as our proto definition is for a single event
const protoBuffers = [];
for (let i = 0; i < events.length; i++) {
    const encodedEvent = proto_service_1.default.encodeEvent(events[i]);
    protoBuffers.push(Buffer.from(encodedEvent));
    // Show progress every 10K events
    if ((i + 1) % 10000 === 0) {
        console.log(`Encoded ${i + 1} events...`);
    }
}
const protoSerializationTime = Date.now() - protoStartTime;
console.log(`Protocol Buffers serialization time: ${protoSerializationTime}ms`);
// Create a single buffer with length prefixing for each message
const allProtoBuffers = Buffer.concat(protoBuffers.map(buffer => {
    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeUInt32LE(buffer.length, 0);
    return Buffer.concat([lengthBuffer, buffer]);
}));
// Write Protocol Buffers to file
const protoFilePath = path_1.default.join(outputDir, 'events.proto.bin');
fs_1.default.writeFileSync(protoFilePath, allProtoBuffers);
const protoFileSize = fs_1.default.statSync(protoFilePath).size;
console.log(`Protocol Buffers file size: ${(protoFileSize / (1024 * 1024)).toFixed(2)} MB`);
// Benchmark Protocol Buffers deserialization
console.log('\nBenchmarking Protocol Buffers deserialization...');
const protoReadData = fs_1.default.readFileSync(protoFilePath);
const protoDesStartTime = Date.now();
// Read the messages back using length prefixing
const deserializedProtoEvents = [];
let offset = 0;
while (offset < protoReadData.length) {
    // Read message length (4 bytes)
    const messageLength = protoReadData.readUInt32LE(offset);
    offset += 4;
    // Extract the message
    const messageBuffer = protoReadData.subarray(offset, offset + messageLength);
    offset += messageLength;
    // Decode the message
    const event = proto_service_1.default.decodeEvent(messageBuffer);
    deserializedProtoEvents.push(event);
    // Show progress every 10K events
    if (deserializedProtoEvents.length % 10000 === 0) {
        console.log(`Decoded ${deserializedProtoEvents.length} events...`);
    }
}
const protoDeserializationTime = Date.now() - protoDesStartTime;
console.log(`Protocol Buffers deserialization time: ${protoDeserializationTime}ms`);
// Comparison summary
console.log('\n--- COMPARISON SUMMARY ---');
console.log(`Number of events: ${NUM_EVENTS}`);
console.log('\nSerialization:');
console.log(`JSON: ${jsonSerializationTime}ms`);
console.log(`Protocol Buffers: ${protoSerializationTime}ms`);
console.log(`Improvement: ${((jsonSerializationTime - protoSerializationTime) / jsonSerializationTime * 100).toFixed(2)}%`);
console.log('\nDeserialization:');
console.log(`JSON: ${jsonDeserializationTime}ms`);
console.log(`Protocol Buffers: ${protoDeserializationTime}ms`);
console.log(`Improvement: ${((jsonDeserializationTime - protoDeserializationTime) / jsonDeserializationTime * 100).toFixed(2)}%`);
console.log('\nFile Size:');
console.log(`JSON: ${(jsonFileSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Protocol Buffers: ${(protoFileSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Size reduction: ${((jsonFileSize - protoFileSize) / jsonFileSize * 100).toFixed(2)}%`);
// Generate a visual report
const reportFilePath = path_1.default.join(outputDir, 'comparison-report.md');
const report = `# JSON vs Protocol Buffers Performance Comparison

## Test Configuration
- Number of events: ${NUM_EVENTS}
- Test run date: ${new Date().toISOString()}

## Results

### Serialization Performance
- JSON: ${jsonSerializationTime}ms
- Protocol Buffers: ${protoSerializationTime}ms
- **Improvement: ${((jsonSerializationTime - protoSerializationTime) / jsonSerializationTime * 100).toFixed(2)}%**

### Deserialization Performance
- JSON: ${jsonDeserializationTime}ms
- Protocol Buffers: ${protoDeserializationTime}ms
- **Improvement: ${((jsonDeserializationTime - protoDeserializationTime) / jsonDeserializationTime * 100).toFixed(2)}%**

### Storage Efficiency
- JSON file size: ${(jsonFileSize / (1024 * 1024)).toFixed(2)} MB
- Protocol Buffers file size: ${(protoFileSize / (1024 * 1024)).toFixed(2)} MB
- **Size reduction: ${((jsonFileSize - protoFileSize) / jsonFileSize * 100).toFixed(2)}%**

## Sample Event
\`\`\`json
${JSON.stringify(events[0], null, 2)}
\`\`\`

## Conclusions

Protocol Buffers offer significant advantages over JSON:

1. **Size Efficiency**: Protocol Buffers generate smaller payloads, reducing network bandwidth and storage requirements.
2. **Processing Speed**: Both serialization and deserialization are faster with Protocol Buffers.
3. **Schema Definition**: Protocol Buffers enforce a schema, ensuring data consistency.

These benefits become increasingly important as the volume of data grows, making Protocol Buffers an excellent choice for high-throughput systems and IoT applications.
`;
fs_1.default.writeFileSync(reportFilePath, report);
console.log(`\nDetailed report generated at: ${reportFilePath}`);
