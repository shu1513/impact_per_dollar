// middlewares/validators.ts
import { Request, Response, NextFunction } from 'express';
import { isCreateCustomerBody } from '../utils/typeGuards';

export const validateCreateCustomer = (
    req: Request, 
    res: Response, 
    next: NextFunction
  ): void => {  // Explicitly set return type to void
    if (!isCreateCustomerBody(req.body)) {
      res.status(400).json({ message: "Invalid request body" });
      return; // Just return, don't return the response
    }
    
    next();
  };