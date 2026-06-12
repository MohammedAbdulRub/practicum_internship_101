const leadEvents       = require('./leadEvents');
const { scoreLead }    = require('../jobs/scoreLead');
const { runAgentPipeline } = require('../jobs/agentPipeline');

leadEvents.on('lead.created', (lead) => {
  scoreLead(lead).catch(err =>
    console.error(`[scorer] uncaught for lead ${lead.id}:`, err.message)
  );
});

leadEvents.on('lead.created', (lead) => {
  runAgentPipeline(lead).catch(err =>
    console.error(`[pipeline] uncaught for lead ${lead.id}:`, err.message)
  );
});
