create database if not exists flexpath_final;
use flexpath_final;

drop table if exists users, roles, books, reviews, wishlists, wishlist_books;

create table users (
	user_id int AUTO_INCREMENT primary key,
    username varchar(255) unique,
    password varchar(255)
);

create table roles (
    username varchar(255) not null,
    role varchar(255) not null,
    primary key (username, role),
    foreign key (username) references users(username) on delete cascade
);


insert into users (username, password) values ('admin', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('admin', 'ADMIN');

insert into users (username, password) values ('user', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('user', 'USER');

insert into users (username, password) values ('dude', '$2a$10$tBTfzHzjmQVKza3VSa5lsOX6/iL93xPVLlLXYg2FhT6a.jb1o6VDq');
insert into roles (username, role) values ('dude', 'USER');


create table books (
    id BIGINT AUTO_INCREMENT primary key,
    title varchar(255) not null,
    author varchar(255) not null,
    pub_year int, 
    isbn_13 text,
    pages int
);

alter table books add constraint uq_title_author unique (title, author);

create table reviews (
    id BIGINT AUTO_INCREMENT primary key,
    username varchar(255) not null,
    book_id BIGINT not null,
    review_text text,
    star_rating int not null,
    review_date DATE not null,
    foreign key (book_id) references books(id) on delete cascade,
    foreign key (username) references users(username) on delete cascade
);

create table wishlists (
	id BIGINT AUTO_INCREMENT primary key,
    username varchar(255) not null,
    name varchar(255) not null,
    is_public boolean not null default FALSE,
    foreign key (username) references users(username) on delete cascade,
    UNIQUE (username, name)
);
-- you will join the following database with 
create table wishlist_books (
	wishlist_id bigint NOT NULL, -- doesn't have to be primary key because we can make a PAIR of keys a primary key (see below)
    book_id bigint NOT NULL,
    time_added TIMESTAMP not null default CURRENT_TIMESTAMP,
    PRIMARY KEY (wishlist_id, book_id),   -- same book can't be added twice
    FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE, -- 
    FOREIGN KEY (book_id)     REFERENCES books(id)     ON DELETE CASCADE
);

INSERT INTO books (title, author, isbn_13, pub_year, pages)
VALUES ("Bury My Heart at Wounded Knee", "Dee Brown", "9780805086843", 1970, 512);

INSERT INTO books (title, author, pub_year, isbn_13)
VALUES ('Let The Great World Spin', 'Colum McCann', 2009, "9780812973990");

INSERT INTO reviews (book_id, username, review_text, review_date, star_rating)
VALUES (1, "admin", "Bury My Heart at Wounded Knee wound me up!", CURDATE(), 10);

INSERT INTO reviews (book_id, username, review_text, review_date, star_rating)
VALUES (2, "dude", "That was close!", CURDATE(), 6);

INSERT INTO wishlists (username, name)
VALUES ('dude', 'my first wishlist!');

INSERT INTO wishlist_books (wishlist_id, book_id, time_added)
VALUES (1, 2, CURDATE());

INSERT INTO wishlist_books (wishlist_id, book_id, time_added)
VALUES (1, 1, CURDATE());