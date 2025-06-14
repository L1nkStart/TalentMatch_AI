-- Insert default email configuration if none exists
INSERT INTO email_configuration (name, host, port, username, password, use_tls, is_active)
SELECT 
  'Configuración Principal', 
  'mail.laguerramendez.com', 
  993, 
  'Usuario@laguerramendez.com', 
  '', 
  true, 
  false
WHERE NOT EXISTS (
  SELECT 1 FROM email_configuration LIMIT 1
);
