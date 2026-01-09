-- Delete ugly/test dummy events
-- These are events with random test names

DELETE FROM events WHERE id IN (9, 11, 13, 14, 15);

-- Or delete by pattern (events with gibberish names):
-- DELETE FROM events WHERE title REGEXP '^[0-9]+$' OR title REGEXP '^[a-z][0-9]+$';

-- Keep the good events:
-- 7: Picnic
-- 8: Họp nhóm Warm-Calendar (Dời Lịch)
-- 10: Thi cuoi ky
