// 3.1: This is phonebook backend step1 ==============================================================
const express = require('express');
const app = express();
const requestLogger = require('morgan');
const cors = require('cors');
let persons = require('./persons');
const mongoose = require("mongoose");
const constants = require("constants");
const PORT = process.env.PORT || 3001;
require('dotenv').config();

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the persons API</h1>');
})

const MONGOURI = process.env.MONGODB_URI

mongoose.connect(MONGOURI)
    .then(() => {
        console.log('Connected successfully to MongoDB Atlas');
    })
    .catch((error) => console.log('ERROR Connecting to MongoDB Atlas: ', error.message));

const personSchema = mongoose.Schema({
    name: String,
    number: String
}, { timestamps: true })

personSchema.set('toJSON', {
    transform: (doc, option) => {
        option.id = option._id.toString();
        delete option._id
        delete option.__v
    }
})

const Person = mongoose.model('person', personSchema);

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));


const logger = requestLogger((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'Content-Length'), '_',
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body)
    ].join(" ")
})

app.use(logger);

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name || !body.number) {
        return res.status(422).json({ msg: 'A field is empty!' });
    }

    const nameTaken = Person.findOne({ name: body.name });

    if(!nameTaken) {
        return res.status(422).json({ error: 'That name is already taken!' })
    }

    const addPerson = new Person({
        name: body.name,
        number: body.number
    })

    addPerson.save()
        .then((personSaved) => {
            res.status(201).json(personSaved)
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ error: 'Problem with the server.' })
        });
})


app.get('/api/persons', (req, res) => {
    Person.find({}).then((result) => {
        console.log(`Person Object: ${result}`);
        res.json(result);
    })
})

app.get('/api/persons/info', (req, res) => {
    const getTotalPersons = `PhoneBook has info for ${persons.length} persons`
    const getCurrentTime = new Date()
    res.send(`<h1>${getTotalPersons}</h1><br /> <h1>${getCurrentTime}</h1>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    const personId = req.params.id;
    Person.findById(personId)
    .then((person) => {
        res.status(200).json(person);
    })
    .catch((error) => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
    const personId = req.params.id;
    const content = req.body;
    Person.findByIdAndUpdate(personId, content, { new: true })
    .then((updatedPerson) => {
        res.status(200).json(updatedPerson);
        console.log(updatedPerson);
    })
    .catch((error) => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
    const personId = req.params.id;
    Person.findByIdAndDelete(personId)
    .then(() => {
        res.status(204).end()
    })

    //    Alternative method to delete a recordx
    // Person.deleteOne({ findPerson: findPerson })
    // .then(() => {
    //     res.status(204).end()
    // })
    .catch((error) => next(error));
})

const errorHandler = (error, req, res, next) => {
    console.error('Define:', error.name);
    if(error.name === "CastError") {
        res.status(400).json({ msg: "Malformed Id." });
    }
    next(error);
}

app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
})