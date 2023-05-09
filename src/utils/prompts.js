/**
 * @fileoverview This file contains the functions that generate the prompts to be sent to OpenAI.
 */

// promptStyles is an object that contains the different styles of subject lines that can be generated
const promptStyles = {
  exciting: 'exciting',
  professional: 'professional',
  respectful: 'respectful',
  mysterious: 'mysterious',
  humorous: 'humorous',
};

/**
 *
 * @param {string} emailBody
 * @param {string} style - one of { 'exciting', 'professional', 'respectful', 'mysterious', 'humorous' }
 * @returns {string} prompt - the prompt to be sent to OpenAI
 */
function generateSubjectLinePrompt(emailBody, style) {
  return `Given the following email body, suggest a ${style} subject line with a high likelihood to be opened:\n\n${emailBody}\n\nSuggested subject line:\n\n- Use no more than 60 characters.\n- Avoid vague and overly promotional wording.\n- Make it self-evident and clear what the email is about.\n- Personalize the subject line.\n\nPlease generate a subject line that meets these criteria:`;
}

module.exports = { generateSubjectLinePrompt, promptStyles };
