const Groq = require('groq-sdk');
const pool = require('../db/index');
const { logAgent } = require('../db/agentLogQueries');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function scoreLead(lead) {
  await logAgent({ lead_id: lead.id, agent: 'scorer', status: 'started' });
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a B2B sales lead scoring assistant. ' +
            'Given a lead\'s details, respond with ONLY a single integer from 0 to 100 ' +
            'representing how promising this lead is as a paying customer. ' +
            '0 = very low quality, 100 = extremely high value. No explanation — just the number.',
        },
        {
          role: 'user',
          content:
            `Name: ${lead.name}\n` +
            `Email: ${lead.email}\n` +
            `Company: ${lead.company || 'Unknown'}\n` +
            `Source: ${lead.source || 'Unknown'}`,
        },
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    const raw   = chat.choices[0]?.message?.content?.trim() ?? '0';
    const score = Math.min(100, Math.max(0, parseInt(raw, 10) || 0));

    await pool.query('UPDATE leads SET score = $1 WHERE id = $2', [score, lead.id]);
    await logAgent({ lead_id: lead.id, agent: 'scorer', status: 'completed', message: `score=${score}` });
    console.log(`[scorer] lead ${lead.id} (${lead.name}) scored ${score}`);
  } catch (err) {
    await logAgent({ lead_id: lead.id, agent: 'scorer', status: 'failed', message: err.message });
    console.error(`[scorer] failed to score lead ${lead.id}:`, err.message);
  }
}

module.exports = { scoreLead };
