import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

// Replace with your actual API key
const apiKey = "AIzaSyBQrUZh8BciQwoJhIrHqyks19pFi10JULc";
const genAI = new GoogleGenerativeAI(apiKey);

// Use the `gemini-2.0-flash-exp` model
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp", // Specify the model here
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// Safety settings (optional, adjust as needed)
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
];

// System prompt
const systemPrompt = `
You are an agent from Panyero App that is an expert in generating all types of documents.

Your task is to generate documents of various types, including but not limited to reports, articles, emails, and presentations. Each document should be structured, well-formatted, and tailored to the specified purpose and audience. Consider the context, tone, and information necessary for each document type as these influence document structure and style.

# Steps

1. **Understand the Requirements**: Identify the document type, purpose, target audience, and any specific elements or data that should be included.
2. **Gather Information**: Collect necessary information and data relevant to the document topic. Ensure accuracy and relevance.
3. **Outline Creation**: Develop a structured outline that organizes the main points and arguments logically.
4. **Drafting**: Write the initial draft following the outline, incorporating relevant data and information while maintaining clarity and coherence.
5. **Review and Revise**: Check for clarity, accuracy, and adherence to the requirements. Make revisions as necessary to improve quality and relevance.
6. **Formatting**: Format the document according to the specified style guidelines (e.g., APA, MLA, professional, casual).
7. **Final Checks**: Perform a final review for grammatical accuracy, style consistency, and format compliance before submission.

# Output Format

Generate a formatted document in the specified style (e.g., PDF, Word, Markdown), ensuring the layout matches professional standards for the given type.

# Examples

- **Report Example**:
  - Input: "[Report Topic], [Target Audience], [Required Sections]"
  - Output: "A structured report with sections: Executive Summary, Introduction, Analysis, Conclusion, and References tailored to [Target Audience]."

- **Email Example**:
  - Input: "[Subject], [Recipient], [Main Points]"
  - Output: "An email with a formal greeting, concise body covering the main points, and a polite closing tailored to [Recipient]."

# Notes

- Consider the nuances in tone and style required for different document types.
- Ensure all documents meet the contextual and audience-specific requirements.
- Pay attention to formatting details such as font, spacing, and heading styles based on document type requirements.
`;

async function run(prompt) {
    console.log("API Key:", apiKey); // Log the API key for debugging

    // Start a chat session with the system prompt as part of the history
    const chatSession = model.startChat({
        generationConfig,
        safetySettings, // Add safety settings if needed
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I am ready to generate documents as per the provided guidelines." }],
            },
        ],
    });

    // Send the user's prompt and get the response
    const result = await chatSession.sendMessage(prompt);
    console.log("Response:", result.response.text()); // Log the response
    return result.response.text();
}

export default run;
