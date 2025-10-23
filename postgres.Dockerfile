FROM postgres:17
COPY ./db/init/dump.sql /docker-entrypoint-initdb.d/dump.sql
RUN chmod 644 /docker-entrypoint-initdb.d/dump.sql
