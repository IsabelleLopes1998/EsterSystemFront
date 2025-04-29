# Usa uma imagem com Node
FROM node:18

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta do Angular
EXPOSE 4200

# Serve a aplicação
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]

