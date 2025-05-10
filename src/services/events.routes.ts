import { Router, Request, Response } from 'express';
import kafkaService from '../services/kafka-service';
import protoService, { EventMessage } from '../services/proto-service';

const router = Router();

// POST endpoint to create and publish a new event
router.post('/', async (req: Request, res: Response) => {
  try {
    const { nameId, timestamp, fields, resourceType, inputType, projectId } = req.body;
    
    // Validate required fields
    if (!nameId || !timestamp || !resourceType || !inputType || !projectId) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }
    
    // Create event object
    const event: EventMessage = {
      nameId,
      timestamp,
      fields: fields || {},
      resourceType,
      inputType,
      projectId
    };
    
    // Publish event to Kafka
    await kafkaService.publishEvent(event);
    
    return res.status(201).json({
      message: 'Event published successfully',
      event
    });
  } catch (error) {
    console.error('Error publishing event:', error);
    return res.status(500).json({ 
      error: 'Failed to publish event' 
    });
  }
});

// GET sample event structure
router.get('/sample', (req: Request, res: Response) => {
  const sampleEvent: EventMessage = {
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
  console.log(protoService.encodeEvent(sampleEvent));
  
  res.json(sampleEvent);
});

export default router;