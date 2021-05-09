![logo-foodfy-chef](https://user-images.githubusercontent.com/66570560/114239633-b2c18500-995c-11eb-89e7-07998cb0b393.png)

## 💡 **Sobre o projeto**
Foodfy é uma aplicação MVC construída com **Javascript, NodeJS, Express, Nunjucks e PostgreSQL**. 
</br>Possui as funcionalidades de explorar, pesquisar e gerenciar receitas, chefs e usuários, além de contar com um sistema completo de login e recuperação de senha.
</br>*Esta aplicação foi construida para o desafio fullstack do Bootcamp Launchbase da Rocketseat.*

## 📑 **Funcionalidades**

- Explore diversas receitas e chefs;
- Gerencie receitas, chefs e usuários dentro da aplicação;
- Upload de imagens para as suas receitas e avatares;
- Pesquise receitas por um filtro na página home;
- Sistema de login e recuperação de senha;
- Área administrativa para os usuário cadastrado;

## 🎥 Video Walktrough
<strong>CLIENT WEB</strong>
![foodfy-video-client-edited-mp4](https://user-images.githubusercontent.com/66570560/114238132-83117d80-995a-11eb-8334-c82b1784fa44.gif)

<strong>ADMIN WEB</strong>
![foodfy-video-admin-edited-mp4](https://user-images.githubusercontent.com/66570560/114241039-eb625e00-995e-11eb-860d-b7daca1c1f74.gif)

## 🔧 **Tecnologias**
Este projeto foi desenvolvido com as seguintes tecnologias:

### Frontend:

- [HTML](https://)
- [CSS](https://)
- [Javascript](https://)
- [Nunjucks](https://)

### Backend:

- [NodeJS](https://)
- [Nodemailer](https://)
- [Express](https://)
- [Express Session](https://)
- [Multer](https://)
- [BcryptJS](https://)
- [PostgreSQL](https://)
- [Nodemon](https://)
- [Pg](https://)

## 💽 **Instalação**

Para clonar o Foodfy é necessário você já ter instalado em sua máquina o Node.js, Git e o PostgreSQL.

```
# Clone este repositório:
$ git clone https://github.com/rbpolim/foodfy.git

# Instalação das dependências:
$ npm install

# Crie o banco de dados e as respectivas tabelas utilizando
# Arquivo "database.sql".

# Popule o banco de dados usando o aquivo "seed.js":
$ node seed.js

# Rodar aplicação:
$ npm start
```

*Sua aplicação estará rodando no browser em: http://localhost:3000*

## 🔐 **Acesso a Área Administrativa** 

![foodfy_login_area](https://user-images.githubusercontent.com/66570560/117584699-cb9c9200-b0e4-11eb-9907-79ac0cf5fca3.png)

Após ter criado alguns usuários fakes com os comandos do arquivo ``seed.js``:
 
* Na página home da aplicação, clique em "Minha conta";
* Selecione um usuário/email da tabela "users";
* Digite o e-mail cadastrado e no campo da senha utilize a senha padrão "123456";

Observação: A fim testar todas as funcionalidades da aplicação, escolha um usuário que possua a credencial ``is_admin`` como ``true``.
