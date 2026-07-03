import express, { Request, Response } from 'express';

export const getHome = (req: Request, res: Response) => {
  res.json({
    message: 'TurfScore API Running'
  });
};
