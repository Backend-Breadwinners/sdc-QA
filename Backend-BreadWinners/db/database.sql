DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS photos CASCADE;


CREATE TABLE Questions
(
 id                serial NOT NULL,
 product_id        varchar(30) NOT NULL,
 body              character varying(500) NOT NULL,
 date_written      character varying(30) NOT NULL,
 asker_name        character varying(30) NOT NULL,
 asker_email       character varying(50) NOT NULL,
 reported      boolean NOT NULL,
 helpful       int NOT NULL,
 PRIMARY KEY ( id )
);

CREATE TABLE Answers
(
 id          serial NOT NULL,
 question_id int NOT NULL,
 body        character varying(500) NOT NULL,
 date        character varying(30) NOT NULL,
 answer_name character varying(30) NOT NULL,
 answer_email character varying(50) NOT NULL,
 reported boolean NOT NULL,
 helpful int NOT NULL,
 PRIMARY KEY ( id ),
 FOREIGN KEY ( question_id ) REFERENCES Questions ( id )
);

CREATE TABLE photos
(
 id        serial NOT NULL,
 answer_id int NOT NULL,
 photos    varchar(4000) NOT NULL,
 date TIMESTAMPTZ DEFAULT NOW(),
 PRIMARY KEY ( id ),
 FOREIGN KEY ( answer_id ) REFERENCES Answers ( id )
);
