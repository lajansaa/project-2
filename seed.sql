-- -- populate categories
-- INSERT INTO categories(title) VALUES ('Category 1');
-- INSERT INTO categories(title) VALUES ('Category 2');
-- INSERT INTO categories(title) VALUES ('Category 3');

-- populate query_reports
INSERT INTO query_reports(title, description, query, user_id, category_id) VALUES ('Report 1', 'This is Report 1', 'SELECT * FROM data_source', 1, 1);
INSERT INTO query_reports(title, description, query, user_id, category_id) VALUES ('Report 2', 'This is Report 2', 'SELECT * FROM data_source', 1, 2);
INSERT INTO query_reports(title, description, query, user_id, category_id) VALUES ('Report 3', 'This is Report 3', 'SELECT * FROM data_source', 1, 3);
