const { expect, assert } = require('chai');
const { generateSubjectLinePrompt } = require('../src/utils/prompts.js');

describe('Testing prompts.js', function () {
  it('test valid generateSubjectLinePrompt', function (done) {
    let emailBody = 'This is a test email body.';
    let style = 'professional';
    let result = generateSubjectLinePrompt(emailBody, style);
    assert.isOk(result, 'result is not null');
    assert.typeOf(result, 'string', 'result is a string');
    assert.equal(
      result,
      `Given the following email body, suggest a ${style} subject line with a high likelihood to be opened:\n\n${emailBody}\n\nSuggested subject line:\n\n- Use no more than 60 characters.\n- Avoid vague and overly promotional wording.\n- Make it self-evident and clear what the email is about.\n- Personalize the subject line.\n\nPlease generate a subject line that meets these criteria:`,
      'result is correct'
    );
    done();
  });
});
