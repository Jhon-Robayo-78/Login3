create database if not exists userManager;

use userManager;

create table user(
         id int not null auto_increment unique,
         username varchar(30) not null,
         email varchar(30) not null unique,
         password varchar(100) not null,
         primary key(email)
);
/* idata es id de la información que proporciona la api de presupuesto */
create table presupuesto(
		 idata varchar(100) not null unique,
         montoinicial float default 0.0, 
         id_fk int not null,
         primary key(idata),
         foreign key(id_fk) references user(id)
);

create table bolsillos(
         id int not null auto_increment unique,
         derivado float default 0.0,
         userId int not null,
         foreign key(userId) references user(id)
);

ALTER TABLE bolsillos
ADD PRIMARY KEY (id);
