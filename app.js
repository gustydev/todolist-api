require('dotenv').config();
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.set('strictQuery', 'false')

main()
.then(() => {
    console.log('Conectado ao mongoDB')
})
.catch((err) => console.log('Erro ao conectar ao mongoDB: ', err));

async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`App listening on port ${port}`)})