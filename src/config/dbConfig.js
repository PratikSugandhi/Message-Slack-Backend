import mongoose from 'mongoose';

import { DEV_DB_URL, NODE_ENV, PROD_DB_URL } from './serverConfig.js';

// generally in industry there are two db development and production leverl so here it is logic that wheaterh db url is either of development or production 
export default async function connectDB() {
  try {
    if (NODE_ENV === 'development') {
      await mongoose.connect(DEV_DB_URL);
    } else if (NODE_ENV === 'production') {
      await mongoose.connect(PROD_DB_URL);
    }
    
    console.log(`Connected to mongodb database from ${NODE_ENV} environment`);
  } catch (error) {
    console.log('Error connecting to database', error);
  }
}