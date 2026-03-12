/*
  # Seed Sample Data for IT Platform Bangladesh
  
  ## Overview
  This migration populates the database with sample data for demonstration purposes.
  
  ## Data Inserted
  
  ### 1. Categories
  - Software Development
  - Web Applications
  - AI & Machine Learning
  - Mobile Apps
  
  ### 2. Products
  - Sample software products with pricing
  - Featured products
  - Various categories
  
  ### 3. Lead Sources
  - Website Contact Form
  - Social Media
  - Referral
  - Direct Contact
  
  ### 4. Sample Leads
  - Various lead statuses
  - Different priorities
  
  ### 5. Email Templates
  - Welcome email
  - Follow-up templates
  - Newsletter templates
  
  ### 6. Content Templates
  - Social media templates
  - Platform-specific content
*/

-- Insert Categories
INSERT INTO categories (name, slug, description, icon, sort_order, is_active) VALUES
  ('Software Development', 'software-development', 'Custom software solutions for businesses', 'bi-laptop', 1, true),
  ('Web Applications', 'web-applications', 'Modern web applications and SaaS platforms', 'bi-globe', 2, true),
  ('AI & Machine Learning', 'ai-ml', 'Artificial intelligence and machine learning solutions', 'bi-robot', 3, true),
  ('Mobile Apps', 'mobile-apps', 'iOS and Android mobile applications', 'bi-phone', 4, true),
  ('Cloud Services', 'cloud-services', 'Cloud infrastructure and migration', 'bi-cloud', 5, true),
  ('Cybersecurity', 'cybersecurity', 'Security solutions and consulting', 'bi-shield-check', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs
DO $$
DECLARE
  cat_software_id uuid;
  cat_web_id uuid;
  cat_ai_id uuid;
  cat_mobile_id uuid;
BEGIN
  SELECT id INTO cat_software_id FROM categories WHERE slug = 'software-development' LIMIT 1;
  SELECT id INTO cat_web_id FROM categories WHERE slug = 'web-applications' LIMIT 1;
  SELECT id INTO cat_ai_id FROM categories WHERE slug = 'ai-ml' LIMIT 1;
  SELECT id INTO cat_mobile_id FROM categories WHERE slug = 'mobile-apps' LIMIT 1;

  -- Insert Products
  IF cat_software_id IS NOT NULL THEN
    INSERT INTO products (category_id, name, slug, description, short_description, price, image_url, is_featured, is_active, stock_status)
    VALUES
      (cat_web_id, 'E-commerce Platform Pro', 'ecommerce-platform-pro', 
       'Full-featured e-commerce platform with payment integration, inventory management, and analytics.',
       'Complete online store solution', 999.00,
       'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
       true, true, 'in_stock'),
      
      (cat_software_id, 'Business CRM Suite', 'business-crm-suite',
       'Comprehensive CRM system for managing customer relationships, sales pipeline, and marketing campaigns.',
       'All-in-one CRM solution', 799.00,
       'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
       true, true, 'in_stock'),
      
      (cat_ai_id, 'AI Chatbot Pro', 'ai-chatbot-pro',
       'Intelligent chatbot with natural language processing for 24/7 customer support automation.',
       '24/7 customer support AI', 599.00,
       'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
       true, true, 'in_stock'),
      
      (cat_web_id, 'Project Management System', 'project-management-system',
       'Complete project management solution with task tracking, team collaboration, and reporting.',
       'Manage projects efficiently', 499.00,
       'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800',
       false, true, 'in_stock'),
      
      (cat_mobile_id, 'Mobile App Starter Kit', 'mobile-app-starter',
       'Cross-platform mobile app development kit with pre-built components and authentication.',
       'Build apps faster', 399.00,
       'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=800',
       false, true, 'in_stock'),
      
      (cat_ai_id, 'AI Content Generator', 'ai-content-generator',
       'AI-powered content generation tool for blogs, social media, and marketing materials.',
       'Generate content with AI', 299.00,
       'https://images.pexels.com/photos/5900195/pexels-photo-5900195.jpeg?auto=compress&cs=tinysrgb&w=800',
       false, true, 'in_stock')
    ON CONFLICT (slug) DO NOTHING;
  END IF;
END $$;

-- Insert Lead Sources
INSERT INTO lead_sources (name, type) VALUES
  ('Website Contact Form', 'organic'),
  ('Facebook Ads', 'paid'),
  ('LinkedIn', 'social'),
  ('Referral', 'referral'),
  ('Direct Contact', 'direct'),
  ('Google Ads', 'paid'),
  ('Email Campaign', 'marketing')
ON CONFLICT DO NOTHING;

-- Insert Sample Email Templates
INSERT INTO email_templates (name, subject, body_html, body_text, category) VALUES
  ('Welcome Email', 'Welcome to IT Platform Bangladesh!',
   '<h1>Welcome!</h1><p>Thank you for choosing IT Platform Bangladesh. We''re excited to have you on board.</p>',
   'Welcome! Thank you for choosing IT Platform Bangladesh.',
   'welcome'),
  
  ('Lead Follow-up', 'Following up on your inquiry',
   '<h2>Hi there!</h2><p>We wanted to follow up on your recent inquiry. Our team is ready to help you.</p>',
   'Hi there! We wanted to follow up on your recent inquiry.',
   'follow-up'),
  
  ('Monthly Newsletter', 'IT Platform BD - Monthly Newsletter',
   '<h1>Monthly Newsletter</h1><p>Here are the latest updates from IT Platform Bangladesh.</p>',
   'Monthly Newsletter - Latest updates from IT Platform Bangladesh',
   'newsletter'),
  
  ('Project Proposal', 'Your Custom Project Proposal',
   '<h2>Project Proposal</h2><p>We''ve prepared a custom proposal based on your requirements.</p>',
   'Your custom project proposal is ready for review.',
   'sales')
ON CONFLICT DO NOTHING;

-- Insert Content Templates
INSERT INTO content_templates (name, content, platform, category) VALUES
  ('Product Launch Post', 'Exciting news! 🚀 We''re launching [PRODUCT_NAME]. Check it out: [LINK] #TechInnovation #SoftwareDevelopment',
   'facebook', 'product'),
  
  ('LinkedIn Company Update', 'We''re thrilled to announce [ANNOUNCEMENT]. Learn more about how we''re transforming businesses with technology.',
   'linkedin', 'announcement'),
  
  ('Instagram Product Showcase', '✨ Introducing [PRODUCT_NAME] ✨\n\nTransform your business with our latest solution.\n\n#Tech #Innovation #Business',
   'instagram', 'product'),
  
  ('YouTube Video Description', 'In this video, we showcase [TOPIC]. \n\nLearn how IT Platform Bangladesh can help your business grow.\n\nVisit: [WEBSITE]',
   'youtube', 'video')
ON CONFLICT DO NOTHING;

-- Note: We don't insert actual user data (leads, customers, etc.) as they should be created through the application