import type { VercelRequest, VercelResponse } from '@vercel/node';
import countHandler from './stats/count.js';
import incrementHandler from './stats/increment.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return incrementHandler(req, res);
  }
  return countHandler(req, res);
}
