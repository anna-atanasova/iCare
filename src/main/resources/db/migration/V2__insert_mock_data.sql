-- V2: Insert mock data for mental health app
SET search_path = mental_health_app, public;

-- ========== INSERT USERS ==========
-- Insert base users (therapists and patients)
INSERT INTO "user" (username, name, surname, email, password) VALUES
-- Therapists
('dr.smith', 'John', 'Smith', 'john.smith@therapy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'), -- password: therapist123
('dr.johnson', 'Emily', 'Johnson', 'emily.johnson@therapy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('dr.williams', 'Michael', 'Williams', 'michael.williams@therapy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('dr.brown', 'Sarah', 'Brown', 'sarah.brown@therapy.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
-- Patients
('alice.wonder', 'Alice', 'Wonder', 'alice.wonder@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'), -- password: patient123
('bob.builder', 'Bob', 'Builder', 'bob.builder@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('charlie.chaplin', 'Charlie', 'Chaplin', 'charlie.chaplin@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('diana.prince', 'Diana', 'Prince', 'diana.prince@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('ethan.hunt', 'Ethan', 'Hunt', 'ethan.hunt@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('fiona.gallagher', 'Fiona', 'Gallagher', 'fiona.gallagher@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('george.miller', 'George', 'Miller', 'george.miller@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('hannah.montana', 'Hannah', 'Montana', 'hannah.montana@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- ========== INSERT THERAPISTS ==========
INSERT INTO therapist (id_user, office_location, degree, years_exp) VALUES
(1, 'Building A, Room 101, Downtown Medical Center', 'Ph.D. in Clinical Psychology', 15),
(2, 'Building B, Suite 205, Wellness Plaza', 'Psy.D. in Counseling Psychology', 10),
(3, 'Building C, Floor 3, Mental Health Institute', 'M.D. Psychiatry', 20),
(4, 'Building A, Room 150, Downtown Medical Center', 'Ph.D. in Clinical Psychology', 8);

-- ========== INSERT PATIENTS ==========
INSERT INTO patient (id_user, id_therapist) VALUES
(5, 1),  -- Alice with Dr. Smith
(6, 1),  -- Bob with Dr. Smith
(7, 2),  -- Charlie with Dr. Johnson
(8, 2),  -- Diana with Dr. Johnson
(9, 3),  -- Ethan with Dr. Williams
(10, 3), -- Fiona with Dr. Williams
(11, 4), -- George with Dr. Brown
(12, 4); -- Hannah with Dr. Brown

-- ========== INSERT BLOGS ==========
INSERT INTO blog (id_patient, title, content, date_of_post) VALUES
(5, 'Small Steps Forward', 'Today was a good day. I finally managed to go outside for a walk without feeling too anxious. Small steps!', '2024-12-01 10:30:00+00'),
(5, 'Therapy Session Reflections', 'Had my therapy session today. We talked about coping mechanisms. Feeling hopeful.', '2024-12-05 14:15:00+00'),
(6, 'Discovering Painting', 'Started a new hobby - painting. It really helps me relax and express my feelings.', '2024-12-02 09:20:00+00'),
(7, 'Breathing Through It', 'Rough day today. But I remembered what my therapist said about breathing exercises. They helped!', '2024-12-03 16:45:00+00'),
(8, 'Gratitude Post', 'Grateful for my support system. My therapist and this community have been amazing.', '2024-12-04 11:00:00+00'),
(9, 'Mindfulness Journey', 'Been practicing mindfulness meditation. It''s harder than I thought but I''m getting better.', '2024-12-06 08:30:00+00'),
(10, '6 Month Milestone', 'Today marks 6 months in therapy. Looking back, I''ve come so far. Proud of myself!', '2024-12-07 13:20:00+00'),
(11, 'Progress Isn''t Linear', 'Sometimes it feels like two steps forward, one step back. But progress is progress.', '2024-12-08 15:10:00+00'),
(12, 'The Power of Journaling', 'Discovered journaling helps me process my emotions better. Why didn''t I try this sooner?', '2024-12-09 10:45:00+00');

-- ========== INSERT COMMENTS ==========
INSERT INTO comment (id_blog, id_patient, content, date_of_comment) VALUES
(1, 6, 'So proud of you! Those small steps add up to big changes.', '2024-12-01 12:00:00+00'),
(1, 7, 'You''ve got this! Keep going!', '2024-12-01 14:30:00+00'),
(2, 8, 'Therapy has been life-changing for me too. Glad you''re finding it helpful!', '2024-12-05 16:00:00+00'),
(3, 5, 'I love painting too! It''s such a great outlet.', '2024-12-02 11:15:00+00'),
(4, 9, 'Breathing exercises are a game changer. Glad they worked for you!', '2024-12-03 18:00:00+00'),
(5, 10, 'Your posts always inspire me. Thank you for sharing!', '2024-12-04 12:30:00+00'),
(6, 11, 'Meditation is tough at first but so worth it. Keep at it!', '2024-12-06 10:00:00+00'),
(7, 12, 'Congratulations on 6 months! That''s a huge milestone!', '2024-12-07 14:45:00+00'),
(8, 5, 'Exactly! Progress isn''t always linear. You''re doing great.', '2024-12-08 16:30:00+00'),
(9, 6, 'Journaling has been my go-to for years. Welcome to the club!', '2024-12-09 11:20:00+00');

-- ========== INSERT LIKES ==========
INSERT INTO patient_likes_blog (id_patient, id_blog) VALUES
(6, 1),
(7, 1),
(8, 1),
(5, 3),
(9, 3),
(10, 5),
(11, 5),
(12, 5),
(5, 7),
(6, 7),
(7, 7),
(8, 9),
(9, 9);

-- ========== INSERT DIARY ENTRIES ==========
INSERT INTO diary (id_patient, date, daily_rating, content) VALUES
-- Alice's diary entries
(5, '2024-12-01', 7, 'Went for a walk today. Felt good to be outside.'),
(5, '2024-12-02', 6, 'A bit anxious today but managed to get through it.'),
(5, '2024-12-03', 7, 'Therapy session was helpful. Feeling positive.'),
(5, '2024-12-04', 8, 'Good day overall. Practiced my coping strategies.'),
(5, '2024-12-05', 8, 'Feeling hopeful about my progress.'),
-- Bob's diary entries
(6, '2024-12-01', 6, 'Started painting. It helps me relax.'),
(6, '2024-12-02', 8, 'Really enjoyed my painting session today!'),
(6, '2024-12-03', 7, 'Feeling creative and calm.'),
(6, '2024-12-04', 7, 'Another good day with my art.'),
-- Charlie's diary entries
(7, '2024-12-01', 5, 'Rough day. Struggled a bit.'),
(7, '2024-12-02', 6, 'Slightly better. Used breathing exercises.'),
(7, '2024-12-03', 5, 'Still challenging but I''m trying.'),
(7, '2024-12-04', 7, 'Better day. Breathing exercises really help.'),
-- Diana's diary entries
(8, '2024-12-01', 8, 'Grateful for my support system.'),
(8, '2024-12-02', 9, 'Excellent day! Feeling very positive.'),
(8, '2024-12-03', 8, 'Continuing to make progress.'),
(8, '2024-12-04', 9, 'Therapy is really working for me.');

-- ========== INSERT CONSULTATIONS ==========
INSERT INTO consultation (id_patient, id_therapist, date, date_of_payment, price, advice) VALUES
-- Dr. Smith's consultations
(5, 1, '2024-12-10', '2024-12-10', 120.00, 'Alice has made excellent progress with her anxiety management. She consistently applies coping strategies discussed in sessions. Continue with current treatment plan and CBT focus.'),
(6, 1, '2024-12-10', '2024-12-10', 120.00, 'Bob has shown significant improvement in emotional regulation through painting. Encourage continued creative expression as a therapeutic outlet.'),
(5, 1, '2024-11-30', '2024-12-01', 120.00, 'Monthly check-in: Alice reports feeling more confident in social situations. Recommend continuing weekly sessions and maintaining medication regimen.'),
-- Dr. Johnson's consultations
(7, 2, '2024-12-10', '2024-12-10', 130.00, 'Charlie is responding well to DBT techniques. Breathing exercises have become a valuable tool for managing acute stress. Continue current approach.'),
(8, 2, '2024-12-11', '2024-12-11', 130.00, 'Diana demonstrates strong engagement with therapy. Her gratitude and positive outlook suggest excellent therapeutic alliance. Maintain current treatment plan.'),
(8, 2, '2024-11-22', '2024-11-25', 130.00, 'Follow-up session with Diana. Continue current treatment approach as she responds very well.'),
-- Dr. Williams's consultations
(9, 3, '2024-12-10', '2024-12-10', 150.00, 'Ethan shows dedication to mindfulness practice despite initial challenges. Progress is steady. Consider introducing advanced meditation techniques next month.'),
(10, 3, '2024-12-11', '2024-12-11', 150.00, 'Fiona has reached a significant milestone at 6 months. Her self-awareness and coping skills have improved dramatically. Proud of her progress.'),
-- Dr. Brown's consultations
(11, 4, '2024-12-10', '2024-12-10', 125.00, 'George understands that recovery is not linear. His acceptance of setbacks shows maturity. Continue supportive therapy and mindfulness practices.'),
(12, 4, '2024-12-11', '2024-12-11', 125.00, 'Hannah has discovered journaling as an effective emotional processing tool. Excellent self-initiated coping mechanism. Encourage daily practice.');

-- ========== INSERT THERAPIES ==========
INSERT INTO therapy (name, dose, exp_date, id_consultation) VALUES
('Sertraline (Zoloft)', '50mg daily', '2025-12-31', 1),
('Cognitive Behavioral Therapy (CBT)', 'Weekly sessions', '2026-12-31', 1),
('Sertraline (Zoloft)', '50mg daily', '2025-12-31', 2),
('Fluoxetine (Prozac)', '20mg daily', '2025-11-30', 4),
('Dialectical Behavior Therapy (DBT)', 'Weekly sessions', '2026-12-31', 4),
('Escitalopram (Lexapro)', '10mg daily', '2025-10-31', 7),
('Bupropion (Wellbutrin)', '150mg twice daily', '2026-01-31', 7),
('Alprazolam (Xanax)', '0.5mg as needed', '2025-06-30', 9),
('Mindfulness-Based Stress Reduction', 'Bi-weekly sessions', '2026-12-31', 9);

