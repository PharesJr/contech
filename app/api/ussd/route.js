export async function POST(req) {
  try {
    // Get the raw body as text
    const rawBody = await req.text();

    // Log raw body for debugging
    console.log("Raw Request Body:", rawBody);

    // Parse application/x-www-form-urlencoded data
    const parsedBody = new URLSearchParams(rawBody);
    const body = {
      sessionId: parsedBody.get("sessionId") || "",
      serviceCode: parsedBody.get("serviceCode") || "",
      phoneNumber: parsedBody.get("phoneNumber") || "",
      text: parsedBody.get("text") || "",
    };

    // Log parsed request for debugging
    console.log("Received USSD Request:", body);

    let response = "";
    const { text } = body;

    // Handle user input based on the 'text' value
    if (text === "") {
      response = `CON Welcome to Site Safety Reporting
1. Report Incident
2. View Safety Tips
3. Emergency Contacts
4. Exit`;
    } 
    // Report Incident Flow
    else if (text === "1") {
      response = `CON Select Incident Type
1. Injury
2. Hazard
3. Equipment Failure
4. Near Miss
5. Other`;
    } 
    else if (
      text === "1*1" || text === "1*2" ||
      text === "1*3" || text === "1*4" ||
      text === "1*5"
    ) {
      response = `CON Enter brief description of the incident`;
    } 
    else if (text.match(/^1\*[1-5]\*[^*]+$/)) {
      response = `CON Enter location (e.g., Block A, Floor 2)`;
    } 
    else if (text.match(/^1\*[1-5]\*[^*]+\*[^*]+$/)) {
      response = `CON Select severity level
1. Low - No immediate danger
2. Medium - Potential risk
3. High - Immediate action required
4. Critical - Life threatening`;
    } 
    else if (text.match(/^1\*[1-5]\*[^*]+\*[^*]+\*[1-4]$/)) {
      const parts = text.split("*");
      const typeIndex = parseInt(parts[1]) - 1;
      const types = ["Injury", "Hazard", "Equipment Failure", "Near Miss", "Other"];
      const type = types[typeIndex];
      const description = parts[2];
      const location = parts[3];
      const severityIndex = parseInt(parts[4]) - 1;
      const severities = ["Low", "Medium", "High", "Critical"];
      const severity = severities[severityIndex];

      // TODO: Save to database here

      const incidentId = `INC${Date.now().toString().slice(-6)}`;

      response = `END Thank you for reporting!
Incident ID: ${incidentId}
Type: ${type}
Severity: ${severity}
Your report has been submitted and the site safety team has been notified.`;
    } 
    // View Safety Tips Flow
    else if (text === "2") {
      response = `CON Select Safety Topic
1. Working at Heights
2. Heavy Machinery
3. Personal Protective Equipment
4. Back to Main Menu`;
    } 
    else if (text === "2*1") {
      response = `END SAFETY TIPS - HEIGHTS:
- Always use fall protection
- Inspect harnesses before use
- Secure all tools
- Never work in high winds
- Report damaged guardrails`;
    } 
    else if (text === "2*2") {
      response = `END SAFETY TIPS - MACHINERY:
- Only operate if trained
- Check for faulty parts
- Use all safety guards
- Keep clear of moving parts
- Follow lockout procedures`;
    } 
    else if (text === "2*3") {
      response = `END SAFETY TIPS - PPE:
- Hard hats required at all times
- Use proper eye protection
- Wear high-visibility clothing
- Use ear protection in noisy areas
- Check PPE condition daily`;
    } 
    else if (text === "2*4") {
      response = `CON Welcome to Site Safety Reporting
1. Report Incident
2. View Safety Tips
3. Emergency Contacts
4. Exit`;
    } 
    // Emergency Contacts
    else if (text === "3") {
      response = `END EMERGENCY CONTACTS:
Site Safety Officer: 555-0123
Project Manager: 555-0124
Medical Emergency: 555-0125
Fire Department: 911`;
    } 
    // Exit
    else if (text === "4") {
      response = `END Thank you for using Site Safety Reporting. Stay safe!`;
    } 
    // Fallback
    else {
      response = `END Invalid selection. Please dial again.`;
    }

    console.log("Sending USSD Response:", response);

    return new Response(response, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error("Error processing USSD request:", error);
    return new Response("END Server error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
