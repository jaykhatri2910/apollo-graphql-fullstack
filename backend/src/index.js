const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const { getUser } = require('./middleware/auth');

dotenv.config();

const startServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUser(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hiring-test';

  console.log('MONGO_URI->',MONGO_URI)
  let targetUri = MONGO_URI;
  try {
    await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 2500 });
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    if (targetUri.includes('//mongo:') || targetUri.includes('//mongo/')) {
      console.warn(`⚠ Could not connect to container host "${targetUri}".`);
      console.log('ℹ Attempting fallback to local MongoDB instance (mongodb://localhost:27017/hiring-test)...');
      try {
        targetUri = 'mongodb://localhost:27017/hiring-test';
        await mongoose.connect(targetUri, { serverSelectionTimeoutMS: 3000 });
        console.log('✓ MongoDB connected (via local fallback)');
        app.listen(PORT, () => {
          console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
        });
      } catch (fallbackErr) {
        console.error('MongoDB connection error:', fallbackErr);
      }
    } else {
      console.error('MongoDB connection error:', err);
    }
  }
};

startServer();
