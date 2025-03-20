import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for waitlist
  app.post('/api/waitlist', async (req, res) => {
    try {
      const { name, email, interests } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }
      
      const newWaitlistEntry = await storage.addToWaitlist({
        name,
        email,
        interests: interests || 'all',
        createdAt: new Date()
      });
      
      res.status(201).json({ 
        message: 'Successfully added to waitlist', 
        data: newWaitlistEntry 
      });
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      res.status(500).json({ message: 'Failed to add to waitlist' });
    }
  });

  // API route for newsletter subscription
  app.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      const subscription = await storage.subscribeToNewsletter({
        email,
        createdAt: new Date()
      });
      
      res.status(201).json({ 
        message: 'Successfully subscribed to newsletter', 
        data: subscription 
      });
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: 'Failed to subscribe to newsletter' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
