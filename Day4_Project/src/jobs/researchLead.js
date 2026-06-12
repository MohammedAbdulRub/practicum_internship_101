const Groq = require('groq-sdk');
const pool = require('../db/index');
const { logAgent } = require('../db/agentLogQueries');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function researchLead(lead) {
  await logAgent({ lead_id: lead.id, agent: 'research', status: 'started' });
  try {
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a B2B sales research analyst. Given a lead\'s details, produce concise research notes covering: ' +
            '(1) likely company type and size, (2) probable role or seniority of this contact, ' +
            '(3) pain points a CRM could solve for them, ' +
            '(4) what their source channel signals about intent. ' +
            'Under 120 words. Plain prose, no bullet symbols.',
        },
        {
          role: 'user',
          content:
            `Name: ${lead.name}\n` +
            `Email: ${lead.email}\n` +
            `Company: ${lead.company || 'Unknown'}\n` +
            `Source: ${lead.source || 'Unknown'}\n` +
            `Notes: ${lead.notes || 'None'}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.4,
    });

    const research = chat.choices[0]?.message?.content?.trim() ?? '';

    await pool.query('UPDATE leads SET research_notes = $1 WHERE id = $2', [research, lead.id]);
    await logAgent({ lead_id: lead.id, agent: 'research', status: 'completed' });
    console.log(`[agent-1] lead ${lead.id} (${lead.name}) research saved`);

    return research;
  } catch (err) {
    await logAgent({ lead_id: lead.id, agent: 'research', status: 'failed', message: err.message });
    console.error(`[agent-1] failed for lead ${lead.id}:`, err.message);
    throw err;
  }
}

module.exports = { researchLead };
