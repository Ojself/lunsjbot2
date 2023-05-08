
WORKDIR /
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
ENV SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
EXPOSE 3000
CMD ["npm", "start"]