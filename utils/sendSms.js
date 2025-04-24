// app/lib/sendSMS.js
const AfricasTalking = require("africastalking");

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.SMS_API,
  username: process.env.SMS_USERNAME,
});

export async function sendSMS({ to, message, from }) {
  try {
    const result = await africastalking.SMS.send({
      to,
      message,
      from: "AFTKNG",
    });
    console.log(result);
    return result; // Return result for further use
  } catch (ex) {
    console.error(ex);
    throw ex; // Throw error for handling in the calling function
  }
}
