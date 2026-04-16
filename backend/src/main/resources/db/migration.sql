ALTER TABLE hashtags ADD COLUMN IF NOT EXISTS tag_type varchar(10);
ALTER TABLE hashtags ADD COLUMN IF NOT EXISTS category varchar(20);
INSERT INTO hashtags (tag, tag_type, category) VALUES ('이미지', 'FIXED', 'media_type') ON CONFLICT DO NOTHING;
INSERT INTO hashtags (tag, tag_type, category) VALUES ('gif', 'FIXED', 'media_type') ON CONFLICT DO NOTHING;
INSERT INTO hashtags (tag, tag_type, category) VALUES ('10대', 'FIXED', 'age_group') ON CONFLICT DO NOTHING;
INSERT INTO hashtags (tag, tag_type, category) VALUES ('20대', 'FIXED', 'age_group') ON CONFLICT DO NOTHING;
INSERT INTO hashtags (tag, tag_type, category) VALUES ('30대', 'FIXED', 'age_group') ON CONFLICT DO NOTHING;
