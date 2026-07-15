import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "UpVoteBase";
const collectionName = "votes";
const discordWebhook = process.env.DISCORD_WEBHOOK_URL;

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

async function sendDiscordNotification(projectId: string, count: number) {
  if (!discordWebhook) return;

  const message = {
    embeds: [
      {
        title: "🚀 New UpVote!",
        description: `**${projectId}** just got an upvote!`,
        color: 0xff4d6d,
        fields: [
          { name: "Total Votes", value: `${count}`, inline: true },
          { name: "Status", value: count >= 20 ? "🔥 Publicly Visible" : "⏳ Growing", inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(discordWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
  } catch (err) {
    console.error("Discord notification failed:", err);
  }
}

export async function GET() {
  if (!uri) {
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 500 });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const votes = await collection.find({}).toArray();
    const voteMap = votes.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.projectId] = curr.count;
      return acc;
    }, {});

    return NextResponse.json(voteMap);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!uri) {
    return NextResponse.json({ error: "MONGODB_URI not set" }, { status: 500 });
  }

  try {
    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(
      { projectId },
      { $inc: { count: 1 } },
      { upsert: true, returnDocument: "after" }
    );

    // Modern MongoDB driver puts the updated document directly in result, or result might be a ModifyResult
    const newCount = result?.count ?? (result as any)?.value?.count ?? 0;

    await sendDiscordNotification(projectId, newCount);

    const allVotes = await collection.find({}).toArray();
    const voteMap = allVotes.reduce((acc: Record<string, number>, curr: any) => {
      acc[curr.projectId] = curr.count;
      return acc;
    }, {});

    return NextResponse.json(voteMap);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
