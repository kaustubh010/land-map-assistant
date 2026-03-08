import { HfInference } from "@huggingface/inference";

export interface ExtractedLandData {
  ownerName?: string;
  plotNumber?: string;
  aadhaarNumber?: string;
  area?: number;
  history?: Transaction[];
  north?: number;
  south?: number;
  east?: number;
  west?: number;
}

export interface Transaction {
  date?: string; // Start date
  endDate?: string;
  type: string;
  owner?: string;
  area?: number;
  documentNo?: string;
  remarks?: string;
}

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

/**
 * Converts Coordinates (DMS or DD) string to Decimal Degrees (DD).
 * Supports: 29° 56' 45.3" N OR 26.8124° N
 */
function parseCoordinate(coordStr: string | number): number | undefined {
  if (typeof coordStr === 'number') return coordStr;
  
  // Try DMS first
  const dmsMatch = coordStr.match(/(\d+)\s*°\s*(\d+)\s*'\s*(\d+(?:\.\d+)?)\s*"\s*([NSEW])/i);
  if (dmsMatch) {
    const degrees = parseFloat(dmsMatch[1]);
    const minutes = parseFloat(dmsMatch[2]);
    const seconds = parseFloat(dmsMatch[3]);
    const direction = dmsMatch[4].toUpperCase();
    let dd = degrees + (minutes / 60) + (seconds / 3600);
    if (direction === 'S' || direction === 'W') dd = dd * -1;
    return dd;
  }

  // Try Decimal Degrees
  const ddMatch = coordStr.match(/(\d+(?:\.\d+)?)\s*°\s*([NSEW])/i);
  if (ddMatch) {
    let dd = parseFloat(ddMatch[1]);
    const direction = ddMatch[2].toUpperCase();
    if (direction === 'S' || direction === 'W') dd = dd * -1;
    return dd;
  }

  // Pure number
  const num = parseFloat(coordStr);
  if (!isNaN(num)) return num;

  return undefined;
}

/**
 * Parses raw OCR text to extract structured land record information using Hugging Face AI.
 */
export async function extractDataFromText(text: string): Promise<ExtractedLandData> {
  const prompt = `
Extract structured land record data from the following OCR text. 
Return ONLY a valid JSON object matching this schema:
{
  "ownerName": "string",
  "plotNumber": "string",
  "aadhaarNumber": "string",
  "area": number (in Hectares),
  "north": "string or number",
  "south": "string or number",
  "east": "string or number",
  "west": "string or number",
  "history": [
    {
      "date": "DD/MM/YYYY",
      "endDate": "DD/MM/YYYY or null",
      "type": "Sale/Lease/Initial/Gift",
      "owner": "string",
      "area": number,
      "documentNo": "string",
      "remarks": "string"
    }
  ]
}

OCR Text:
"""
${text}
"""

Important:
- If coordinates are in DMS (e.g. 29° 56' 45.3" N), keep them as strings.
- If coordinates are in Decimal (e.g. 26.8124° N), keep them as strings.
- Parse "Jamabandi" tables for history.
- Ensure "area" is a number.
`;

  try {
    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { role: "system", content: "You are a specialized land record data extraction AI. You extract precise details from OCR text into valid JSON." },
        { role: "user", content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    const jsonStr = content?.match(/\{[\s\S]*\}/)?.[0];
    
    if (!jsonStr) {
      console.error("AI did not return valid JSON:", content);
      return {};
    }

    const data = JSON.parse(jsonStr) as ExtractedLandData;

    // Post-process coordinates
    if (data.north) data.north = parseCoordinate(data.north as any);
    if (data.south) data.south = parseCoordinate(data.south as any);
    if (data.east) data.east = parseCoordinate(data.east as any);
    if (data.west) data.west = parseCoordinate(data.west as any);

    return data;
  } catch (error) {
    console.error("Hugging Face AI extraction failed:", error);
    // Return empty object on failure so the system doesn't crash
    return {};
  }
}
