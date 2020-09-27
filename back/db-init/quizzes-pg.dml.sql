insert into participants (pseudo, nom, prenom) values
	('cdarwin', 'DARWIN', 'Charles'), 
    ('aeinstein', 'EINSTEIN', 'Albert'),
    ('wshakespeare', 'SHAKESPEARE', 'William'), 
    ('sweil', 'WEIL', 'Simone'),
    ('nmandela', 'MANDELA', 'Nelson');

insert into quizzes (libelle, date_creation) values
	('Quiz sur SQL', TO_DATE('23/09/2020','DD/MM/YYYY')),
    ('Quiz sur Java', TO_DATE('24/09/2020','DD/MM/YYYY'));
      
-- '' = caractere d'echappement (caractere double)
insert into questions (code, libelle, numero_ordre, id_quiz) values 
	('CD01', 'Qu''est-ce qu''une clef primaire ?', 1, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('23/09/2020','DD/MM/YYYY'))),
    ('CD02', 'Qu''est-ce qu''une clef étrangère ?', 2, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('23/09/2020','DD/MM/YYYY'))),
	('CD05', 'Qu''est-ce qu''un index ?', 3, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('23/09/2020','DD/MM/YYYY'))),
	('CD03', 'Qu''est-ce qu''une classe ?', 1, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('24/09/2020','DD/MM/YYYY'))),
    ('CD04', 'Qu''est-ce qu''une méthode ?', 2, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('24/09/2020','DD/MM/YYYY'))),
    ('CD06', 'Qu''est-ce qu''une interface ?', 3, (select q.id_quiz from quizzes q where q.date_creation = TO_DATE('24/09/2020','DD/MM/YYYY')));
	