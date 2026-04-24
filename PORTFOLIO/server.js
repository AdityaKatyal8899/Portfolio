require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './'))); // Serve your static portfolio files

// MongoDB Details
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "UpVoteBase";
const collectionName = "votes";
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log(`✅ Connected to MongoDB: ${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

connectDB();

// Helper for Discord
async function sendDiscordNotification(projectId, count) {
  if (!discordWebhook) return;
  
  const message = {
    embeds: [{
      title: "🚀 New UpVote!",
      description: `**${projectId}** just got an upvote!`,
      color: 0xff4d6d,
      fields: [
        { name: "Total Votes", value: `${count}`, inline: true },
        { name: "Status", value: count >= 20 ? "🔥 Publicly Visible" : "⏳ Growing", inline: true }
      ],
      timestamp: new Date()
    }]
  };

  try {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  } catch (err) {
    console.error("Discord notification failed:", err);
  }
}

// API Routes
app.get('/api/vote', async (req, res) => {
  try {
    const votes = await db.collection(collectionName).find({}).toArray();
    const voteMap = votes.reduce((acc, curr) => {
      acc[curr.projectId] = curr.count;
      return acc;
    }, {});
    res.json(voteMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/vote', async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) return res.status(400).json({ error: "Missing projectId" });

  try {
    const result = await db.collection(collectionName).findOneAndUpdate(
      { projectId },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: 'after' }
    );

    // Some MongoDB driver versions return result.value or result directly
    const newCount = result.value ? result.value.count : result.count;
    
    await sendDiscordNotification(projectId, newCount);

    // Return updated map
    const allVotes = await db.collection(collectionName).find({}).toArray();
    const voteMap = allVotes.reduce((acc, curr) => {
      acc[curr.projectId] = curr.count;
      return acc;
    }, {});
    
    res.json(voteMap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html for any other route (SPA style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
