create table "User" (
	user_id varchar(255) primary key,
	Email varchar(255) unique not null,
	full_name varchar(255) not null,
	Gender varchar(50),
	Bio text,
	ProfilePictureURL varchar(500),
	DateOfBirth date,
	Address varchar(500),
	PasswordHash varchar(255) not null,
	CreatedDate timestamp default current_timestamp,
	LastLogin timestamp,
	IsAdmin boolean default false
);