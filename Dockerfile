# Définir l'image de base avec Node.js 14.15.1
FROM --platform=linux/amd64  node:16.13.0 as build

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Mettre à jour npm
RUN npm install -g npm

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Add App User
RUN useradd -m app_user

# Chown du répertoire app au user applicatif
RUN chown -R app_user:app_user .

# Changer d'utilisateur
USER app_user

CMD [ "node", "src/index.js"]