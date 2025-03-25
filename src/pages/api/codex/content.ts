import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { path: requestedPath } = req.query;
    
    if (!requestedPath || typeof requestedPath !== 'string') {
      return res.status(400).json({ message: 'Path parameter is required' });
    }

    // Construct the full path to the markdown file
    const fullPath = path.join(process.cwd(), 'src', 'pages', 'codex', 'data', requestedPath + '.md');
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Read the markdown file
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    res.status(200).send(content);
  } catch (error) {
    console.error('Error reading markdown file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 