create database if not exists flexpath_final;
use flexpath_final;

drop table if exists users, roles, books, reviews, wishlists;

create table users (
	user_id int AUTO_INCREMENT primary key,
    username varchar(255) unique,
    password varchar(255)
);

create table roles (
    username varchar(255) not null,
    role varchar(250) not null,
    primary key (username, role),
    foreign key (username) references users(username) on delete cascade
);


insert into users (username, password) values ('admin', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('admin', 'ADMIN');

insert into users (username, password) values ('user', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('user', 'USER');


create table books (
    id BIGINT AUTO_INCREMENT primary key,
    title varchar(510) not null,
    author varchar(510) not null,
    pub_year int, 
    isbn_13 text,
    pages int
);

create table reviews (
    id BIGINT AUTO_INCREMENT primary key,
    book_id BIGINT not null,
    review_text text,
    star_rating int not null,
    review_date DATE not null,
    foreign key (book_id) references books(id) on delete cascade
);

create table wishlists (
	id BIGINT AUTO_INCREMENT primary key,
    username varchar(250) not null,
    -- user_id int not null,
    name varchar(510) not null,
    foreign key (username) references users(username) on delete cascade
    -- foreign key (user_id) references users(user_id)
);

INSERT INTO books (title, author, isbn_13, pub_year, pages)
VALUES ("Bury My Heart at Wounded Knee", "Dee Brown", "9780805086843", 1970, 512);

INSERT INTO books (title, author, pub_year, isbn_13)
VALUES ('Let The Great World Spin', 'Colum McCann', 2009, "9780812973990");

INSERT INTO reviews (book_id, review_text, review_date, star_rating)
VALUES (1, "Bury My Heart at Wounded Knee wound me up!", CURDATE(), 10);

INSERT INTO reviews (book_id, review_text, review_date, star_rating)
VALUES (2, "That was close!", CURDATE(), 6);