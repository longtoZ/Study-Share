create table "Subject" (
	subject_id varchar(255) primary key,
	name varchar(255) not null,
	description text,
)

insert into "Subject" (subject_id, name, description) values
('MATH101', 'Mathematics', 'Basic Mathematics course covering algebra, geometry, and calculus.'),
('PHY101', 'Physics', 'Introduction to Physics covering mechanics, thermodynamics, and electromagnetism.'),
('CHEM101', 'Chemistry', 'Fundamentals of Chemistry including organic and inorganic chemistry.'),
('BIO101', 'Biology', 'Basic Biology course covering cell biology, genetics, and ecology.'),
('CS101', 'Computer Science', 'Introduction to Computer Science including programming and algorithms.'),
('HIST101', 'History', 'World History from ancient times to the modern era.'),
('GEOG101', 'Geography', 'Physical and human geography concepts and principles.'),
('ENG101', 'English Literature', 'Study of English literature from various periods.'),
('ECO101', 'Economics', 'Principles of Economics including microeconomics and macroeconomics.'),
('PSY101', 'Psychology', 'Introduction to Psychology covering human behavior and mental processes.'),
('OTHER', 'Other', 'Any other subject not listed above.');

alter table "Material" 