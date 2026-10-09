require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const base64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const mimeType = "image/png";

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
    const prompt = `Analyze this receipt and extract the structured data.
      Return ONLY a JSON object exactly matching this format, with no markdown:
      {
        "merchant": "string",
        "date": "ISO string",
        "items": [{ "name": "string", "quantity": number, "price": number, "participants": ["user_id_1"] }],
        "tax": number,
        "serviceCharge": number,
        "total": number
      }`;

    const imageParts = [{ inlineData: { data: base64Image, mimeType } }];
    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text().trim();
    console.log("Raw Response:");
    console.log(responseText);
    
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '');
    console.log("Parsed JSON:");
    console.log(JSON.parse(jsonStr));
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
