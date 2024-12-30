import { NextFunction, Request, Response } from "express";

// Define the type for the asynchronous route handler
interface AsyncRequestHandlerType {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

// Define the asyncHandler function
export const asyncHandler =
  (fn: AsyncRequestHandlerType) =>
  // Return a new asynchronous function
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Try to execute the asynchronous route handler
      await fn(req, res, next);
    } catch (error: any) {
      // If an error occurs, log it and send a JSON response with error details
      console.log("Error Occured = ", error);
      res.status(error.statusCode || 500).json({
        error: true,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
      });
    }
  };
