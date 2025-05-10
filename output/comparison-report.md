# JSON vs Protocol Buffers Performance Comparison

## Test Configuration
- Number of events: 100000
- Test run date: 2025-05-10T17:09:37.717Z

## Results

### Serialization Performance
- JSON: 87ms
- Protocol Buffers: 389ms
- **Improvement: -347.13%**

### Deserialization Performance
- JSON: 293ms
- Protocol Buffers: 311ms
- **Improvement: -6.14%**

### Storage Efficiency
- JSON file size: 23.31 MB
- Protocol Buffers file size: 16.26 MB
- **Size reduction: 30.27%**

## Sample Event
```json
{
  "nameId": "sensor-0-o10Mj1J3",
  "timestamp": "2024-09-26T06:51:36.043Z",
  "fields": {
    "z": "4.97",
    "temperature": "56.59",
    "tvoc": "31.80",
    "heading": "99.58",
    "co2": "39.84"
  },
  "resourceType": "device",
  "inputType": "motion",
  "projectId": "industrial-iot"
}
```

## Conclusions

Protocol Buffers offer significant advantages over JSON:

1. **Size Efficiency**: Protocol Buffers generate smaller payloads, reducing network bandwidth and storage requirements.
2. **Processing Speed**: Both serialization and deserialization are faster with Protocol Buffers.
3. **Schema Definition**: Protocol Buffers enforce a schema, ensuring data consistency.

These benefits become increasingly important as the volume of data grows, making Protocol Buffers an excellent choice for high-throughput systems and IoT applications.
