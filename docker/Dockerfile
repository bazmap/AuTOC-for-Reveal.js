FROM node:20

WORKDIR /reveal

# Installer git et cloner reveal.js
RUN apt-get update && apt-get install -y git \
    && git clone https://github.com/hakimel/reveal.js.git . \
    && npm install

# Installer les plugins
RUN git clone https://github.com/janschoepke/reveal_external.git /tmp/reveal_external \
    && cp -r /tmp/reveal_external/external /reveal/plugin/ \
    && rm -rf /tmp/reveal_external

# Exposer les ports
EXPOSE 8000
EXPOSE 35729

# Lancer npm
CMD ["npm", "start", "--", "--host=0.0.0.0"]
