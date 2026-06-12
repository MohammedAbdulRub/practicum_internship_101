-- Seed data for SMB CRM

INSERT INTO customers (name, email, phone, company) VALUES
  ('Alice Nguyen',   'alice@brightlogic.io',   '+1-415-555-0101', 'BrightLogic Inc.'),
  ('Carlos Reyes',   'carlos@swiftops.co',     '+1-312-555-0182', 'SwiftOps Co.'),
  ('Priya Sharma',   'priya@nexatech.com',     '+91-98765-43210', 'NexaTech Ltd.'),
  ('David Okonkwo',  'david@greenroots.ng',    '+234-801-234-5678','GreenRoots NG'),
  ('Sofia Lindqvist','sofia@nordicmade.se',    '+46-70-123-4567', 'Nordic Made AB');

INSERT INTO leads (name, email, phone, company, source, status, score, notes, assigned_to) VALUES
  ('James Carter',   'james@startupx.io',   '+1-650-555-0110', 'StartupX',       'website',      'new',       0,  'Filled out pricing form',           'rep_sarah'),
  ('Mei Zhou',       'mei@cloudedge.cn',    '+86-138-0013-8000','CloudEdge',      'referral',     'contacted', 40, 'Referred by Alice Nguyen',          'rep_tom'),
  ('Rania Hassan',   'rania@delta-fin.ae',  '+971-50-123-4567', 'DeltaFin',       'event',        'qualified', 72, 'Met at SaaS Summit Dubai',          'rep_sarah'),
  ('Lucas Ferreira', 'lucas@bravobr.com',   '+55-11-91234-5678','BravoBR',        'cold_outreach','new',       0,  NULL,                                'rep_tom'),
  ('Anya Petrova',   'anya@pixelcraft.ru',  '+7-916-123-45-67', 'PixelCraft',     'website',      'contacted', 25, 'Downloaded whitepaper',             'rep_sarah'),
  ('Ben Osei',       'ben@accratech.gh',    '+233-20-123-4567', 'AccraTech',      'referral',     'converted', 91, 'Converted — see customer record',   'rep_tom'),
  ('Clara Walsh',    'clara@irishsoft.ie',  '+353-87-123-4567', 'IrishSoft',      'website',      'lost',      15, 'Went with competitor',              'rep_sarah');

INSERT INTO orders (customer_id, product_name, amount, status) VALUES
  (1, 'CRM Starter Plan',       299.00, 'delivered'),
  (1, 'Analytics Add-on',       99.00,  'processing'),
  (2, 'CRM Pro Plan',           599.00, 'delivered'),
  (3, 'CRM Enterprise Plan',   1499.00, 'pending'),
  (4, 'CRM Starter Plan',       299.00, 'shipped'),
  (5, 'Onboarding Package',     249.00, 'delivered'),
  (5, 'CRM Pro Plan',           599.00, 'delivered');
