CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Testest Testes', 'tester.test', 'Testing for Testers');
insert into blogs (url, title) values ('anon.no', 'Anonymous Title');
