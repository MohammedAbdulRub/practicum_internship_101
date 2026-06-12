const Groq = require('groq-sdk');
const pool = require('../db/index');
const { logAgent } = require('../db/agentLogQueries');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function writeMessage(lead, research) {
  const chat = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a B2B sales copywriter. Using the research notes provided, write a personalized ' +
          'cold outreach email opener (3–4 sentences). Reference the company and what the lead source ' +
          'signals about their intent. No subject line. No sign-off. Just the opening paragraph.',
      },
      {
        role: 'user',
        content:
          `Lead: ${lead.name} at ${lead.company || 'their company'}\n\n` +
          `Research:\n${research}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return chat.choices[0]?.message?.content?.trim() ?? '';
}

async function qaCheck(message) {
  const chat = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a QA reviewer for B2B sales outreach. ' +
          'Check this message for personalization, professionalism, and clarity. ' +
          'Reply with exactly one word: PASS or FAIL.',
      },
      {
        role: 'user',
        content: message,
      },
    ],
    max_tokens: 5,
    temperature: 0.1,
  });

  const verdict = chat.choices[0]?.message?.content?.trim().toUpperCase() ?? 'FAIL';
  return verdict.startsWith('PASS');
}

async function generateOutreach(lead, research) {
  await logAgent({ lead_id: lead.id, agent: 'outreach', status: 'started' });
  try {
    let message = await writeMessage(lead, research);
    let passed  = await qaCheck(message);

    await logAgent({
      lead_id: lead.id,
      agent:   'outreach-qa',
      status:  passed ? 'qa-pass' : 'qa-fail',
      message: 'attempt=1',
    });

    if (!passed) {
      console.log(`[agent-2] QA failed for lead ${lead.id} — regenerating`);
      message = await writeMessage(lead, research);
      passed  = await qaCheck(message);

      await logAgent({
        lead_id: lead.id,
        agent:   'outreach-qa',
        status:  passed ? 'qa-pass' : 'qa-fail',
        message: 'attempt=2',
      });

      if (!passed) {
        console.warn(`[agent-2] QA failed twice for lead ${lead.id} — saving best attempt`);
      }
    }

    await pool.query('UPDATE leads SET outreach_message = $1 WHERE id = $2', [message, lead.id]);
    await logAgent({
      lead_id: lead.id,
      agent:   'outreach',
      status:  'completed',
      message: `qa=${passed ? 'pass' : 'fail-saved'}`,
    });
    console.log(`[agent-2] lead ${lead.id} (${lead.name}) outreach saved (qa=${passed ? 'pass' : 'fail'})`);
  } catch (err) {
    await logAgent({ lead_id: lead.id, agent: 'outreach', status: 'failed', message: err.message });
    console.error(`[agent-2] failed for lead ${lead.id}:`, err.message);
    throw err;
  }
}

module.exports = { generateOutreach };
