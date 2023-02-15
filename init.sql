drop table if exists user_info;

create table user_info(
  id VARCHAR(30) NOT NULL,
  pw VARCHAR(200) NOT NULL,
  salt VARCHAR(200) NOT NULL,
  CONSTRAINT user_info_pk PRIMARY KEY(id)
);