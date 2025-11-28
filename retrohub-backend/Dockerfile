# ----------- Backend Stage -----------
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5001
CMD ["npm", "start"]
