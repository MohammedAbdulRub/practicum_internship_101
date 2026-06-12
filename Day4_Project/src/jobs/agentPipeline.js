const { researchLead }       = require('./researchLead');
const { generateOutreach }   = require('./generateOutreach');
const { markPendingApproval } = require('../db/leadsQueries');

async function runAgentPipeline(lead) {
  try {
    const research = await researchLead(lead);   // Agent 1 — writes research_notes
    await generateOutreach(lead, research);        // Agent 2 — uses research, writes outreach_message
    await markPendingApproval(lead.id);            // flag for human review
    console.log(`[pipeline] lead ${lead.id} marked pending_approval=true`);
  } catch (err) {
    console.error(`[pipeline] failed for lead ${lead.id}:`, err.message);
  }
}

module.exports = { runAgentPipeline };
