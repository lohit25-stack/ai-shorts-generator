// src/api/server.ts
import express from 'express';
import * as cors from 'cors';
import bodyParser from 'body-parser';
import generateRoute from './generate';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', generateRoute);

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}/api/generate`);
});