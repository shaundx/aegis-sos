import { NextResponse } from "next/server";
import twilio from "twilio";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY!);
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
  try {
    const { location, type } = await req.json();

    // --- GOOGLE AI INTEGRATION ---
    // --- GOOGLE AI INTEGRATION ---
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We strictly limit the AI to 10 words to avoid the 30044 error
    const prompt = `Context: ${type} at ${location}. 
    Action: Provide a 10-word tactical instruction for a responder. 
    Rule: Do not use emojis or special characters. Use plain text only.`;

    const result = await model.generateContent(prompt);
    const aiBriefing = result.response.text().trim();

    // --- BROADCAST LOGIC ---
    const teamNumbers = [
      process.env.MY_PERSONAL_NUMBER, 
      "+918971816400", 
      "+918078092805"
    ];

    const smsPromises = teamNumbers.map((number) => 
     client.messages.create({
       // Keep the entire body short! 
       body: `AEGIS: ${type}@${location}. AI: ${aiBriefing}. HUD: https://aegis-app-topaz.vercel.app/hud`,
       from: process.env.TWILIO_PHONE_NUMBER,
       to: number as string,
     })
    );

    await Promise.all(smsPromises);
    return NextResponse.json({ success: true, briefing: aiBriefing });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}