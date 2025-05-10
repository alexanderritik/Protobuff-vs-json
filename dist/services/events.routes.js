"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const kafka_service_1 = __importDefault(require("../services/kafka-service"));
const proto_service_1 = __importDefault(require("../services/proto-service"));
const router = (0, express_1.Router)();
// POST endpoint to create and publish a new event
router.post('/', async (req, res) => {
    try {
        const { nameId, timestamp, fields, resourceType, inputType, projectId } = req.body;
        // Validate required fields
        if (!nameId || !timestamp || !resourceType || !inputType || !projectId) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }
        // Create event object
        const event = {
            nameId,
            timestamp,
            fields: fields || {},
            resourceType,
            inputType,
            projectId
        };
        // Publish event to Kafka
        await kafka_service_1.default.publishEvent(event);
        return res.status(201).json({
            message: 'Event published successfully',
            event
        });
    }
    catch (error) {
        console.error('Error publishing event:', error);
        return res.status(500).json({
            error: 'Failed to publish event'
        });
    }
});
// GET sample event structure
router.get('/sample', (req, res) => {
    const sampleEvent = {
        nameId: 'temperature-sensor-1',
        timestamp: new Date().toISOString(),
        fields: {
            'temperature': '25.4',
            'humidity': '60.2',
            'location': 'room-101'
        },
        resourceType: 'sensor',
        inputType: 'temperature',
        projectId: 'home-monitoring'
    };
    console.log(proto_service_1.default.encodeEvent(sampleEvent));
    res.json(sampleEvent);
});
exports.default = router;
