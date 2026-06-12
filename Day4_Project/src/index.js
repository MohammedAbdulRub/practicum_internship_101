require('dotenv').config();
require('./events/handlers');
const path    = require('path');
const express = require('express');
const leadsRouter     = require('./routes/leads');
const customersRouter = require('./routes/customers');
const ordersRouter    = require('./routes/orders');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/leads',     leadsRouter);
app.use('/customers', customersRouter);
app.use('/orders',    ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMB CRM API running on port ${PORT}`);
});
