import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  res.status(200).json(users);
};