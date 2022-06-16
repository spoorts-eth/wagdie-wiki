FROM requarks/wiki:2
WORKDIR /wiki
ENV DB_TYPE postgres
ENV DB_SSL 1
ENV HEROKU 1
ENV PGSSLMODE no-verify
# ENV SSL_ACTIVE 1
# ENV LETSENCRYPT_DOMAIN wagdie.wiki
# ENV LETSENCRYPT_EMAIL spaawts@gmail.com
CMD ["node", "server"]
# Overwrite ssl.js (see the comment in the file)
COPY overrides/ssl.js server/controllers/ssl.js