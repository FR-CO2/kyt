INSERT INTO application_user (id,username,password, application_role)
       SELECT 1, 'admin','$2a$10$v.Vkaz5PddwFwDMsIOhiwOGeAHuGqZVDhaycH.e9v1iygr6LcDppu', 0
       WHERE NOT EXISTS (SELECT 1 FROM application_user WHERE id=1);

