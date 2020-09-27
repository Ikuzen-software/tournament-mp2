CREATE TABLE quizzes (  
	id_quiz SERIAL PRIMARY KEY,  
	libelle varchar(255) NOT NULL, 
	date_creation date NOT NULL
); 

CREATE TABLE participants (  
	id_participant SERIAL PRIMARY KEY,  
	pseudo varchar(20) NOT NULL, 
	nom varchar(255) NOT NULL, 
	prenom varchar(255) NOT NULL
); 

CREATE TABLE questions (  
	id_question SERIAL PRIMARY KEY,  
	code varchar(5) NOT NULL, 
	libelle varchar(90) NOT NULL, 
	numero_ordre int NOT NULL, 
	-- raccourci pour creer clef etrangere
	id_quiz integer NOT NULL REFERENCES quizzes
);

-- creer un index apres la creation de la table
CREATE INDEX id_quiz_index ON questions (id_quiz);
