function analyzeEmail() {

  const SHEET_ID = "GOOGLE_SHEET_ID";
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return;

  const apiKey = "GROQ_API_KEY";

  // Loop through rows starting from row 2 (skip headers)
  for (let row = 2; row <= lastRow; row++) {

    const status = sheet.getRange(row, 8).getValue();
    const emailText = sheet.getRange(row, 1).getValue();

    if (!emailText) continue;          // skip empty rows
    if (status === "DONE") continue;   // skip processed rows

    sheet.getRange(row, 8).setValue("PROCESSING");

    const prompt = `
You are an assistant that analyzes emails.

Return ONLY valid JSON.
Do NOT add any text outside JSON.

JSON format:
{
  "summary": "string",
  "action_items": ["string", "string"],
  "urgency": "Low | Medium | High",
  "suggested_reply": "string",
  "category": "Request | Complaint | Information | Finance | Legal | Other"
}

Rules:
- Keep summary short and clear
- Extract real action items
- Determine urgency realistically
- Write a polite and professional reply
- Be concise

Email:
${emailText}
`;

    try {

      const response = UrlFetchApp.fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "post",
          contentType: "application/json",
          headers: {
            Authorization: "Bearer " + apiKey
          },
          payload: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
          }),
          muteHttpExceptions: true
        }
      );

      const result = JSON.parse(response.getContentText());
      const aiText = result.choices[0].message.content.trim();
      const parsed = JSON.parse(aiText);

      sheet.getRange(row, 2).setValue(parsed.summary || "");
      sheet.getRange(row, 3).setValue((parsed.action_items || []).join("\n"));
      sheet.getRange(row, 4).setValue(parsed.urgency || "");
      sheet.getRange(row, 5).setValue(parsed.suggested_reply || "");
      sheet.getRange(row, 6).setValue(parsed.category || "");
      sheet.getRange(row, 7).setValue(new Date());
      sheet.getRange(row, 8).setValue("DONE");

      break; // process only one row per run

    } catch (error) {

      Logger.log(error);
      sheet.getRange(row, 8).setValue("ERROR");
      break;

    }
  }
}
