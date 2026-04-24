const { MongoClient } = require('mongodb');

// Environment variables (Set these in Vercel Dashboard)
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "UpVoteBase";
const collectionName = "votes";
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

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
    // In Vercel Node.js 18+, fetch is global.
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  } catch (err) {
    console.error("Discord notification failed:", err);
  }
}

module.exports = async (req, res) => {
  if (!uri) return res.status(500).json({ error: "MONGODB_URI not set" });

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    if (req.method === 'GET') {
      const votes = await collection.find({}).toArray();
      const voteMap = votes.reduce((acc, curr) => {
        acc[curr.projectId] = curr.count;
        return acc;
      }, {});
      return res.status(200).json(voteMap);
    }

    if (req.method === 'POST') {
      const { projectId } = req.body;
      if (!projectId) return res.status(400).json({ error: "Missing projectId" });

      const result = await collection.findOneAndUpdate(
        { projectId },
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: 'after' }
      );

      // result.value might be null on upsert depending on driver, but returnDocument: 'after' should help
      const newCount = result.count || (result.value ? result.value.count : 0);
      
      await sendDiscordNotification(projectId, newCount);

      const allVotes = await collection.find({}).toArray();
      const voteMap = allVotes.reduce((acc, curr) => {
        acc[curr.projectId] = curr.count;
        return acc;
      }, {});
      
      return res.status(200).json(voteMap);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
