// 3.1: This is phonebook backend step1 ==============================================================
const express = require('express');
const app = express();
const requestLogger = require('morgan');
const cors = require('cors');
let persons = require('./persons');
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the persons API</h1>');
})

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions));


// 3.7 & 3.8: This is phonebook backend step7 and 8 ==============================================================
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
// Step seven and eight ends here ================================================================================


app.get('/api/persons', (req, res) => {
    res.json(persons);
})

// Step one ends here ================================================================================


// 3.2: This is phonebook backend step2 ==============================================================
app.get('/api/persons/info', (req, res) => {
    const getTotalPersons = `PhoneBook has info for ${persons.length} persons`
    const getCurrentTime = new Date()
    res.send(`<h1>${getTotalPersons}</h1><br /> <h1>${getCurrentTime}</h1>`)
})
// Step two ends here ================================================================================


// 3.3: This is phonebook backend step3 ==============================================================
app.get('/api/persons/:id', (req, res) => {
    const personId = Number(req.params.id);
    const findPerson = persons.find(person => person.id === personId);
    if(findPerson) {
        res.json(findPerson);
    } else {
        res.status(404).end()
    }
    console.log(findPerson);
})

// Step three ends here ==============================================================================



// 3.4: This is phonebook backend step4 ==============================================================
app.delete('/api/persons/:id', (req, res) => {
    const personId = Number(req.params.id);
    const findPerson = persons.find(per => per.id === personId);

    if(!findPerson) {
        res.status(422).json({ msg: `${findPerson} is not found!` });
        console.log(`Person: ${findPerson}`)
    }

    persons = persons.filter((person) => person?.id !== personId);
    if(persons) {
        res.status(204).end();
    } else {
        res.status(400).json({ msg: `Unable to remove ${findPerson[0]?.name}!` })
        console.log(`Person: ${findPerson}`)
    }
})

// Step four ends here ===============================================================================



// 3.5: This is phonebook backend step5 ==============================================================
app.post('/api/persons', (req, res) => {
    const body = req.body;
    const generateId = () => {
        const maxId = persons.length > 0 ?
            Math.max(...persons.map(p => p.id)) : 0
        return maxId + 1;
    }

    // 3.6: This is phonebook backend step6 ==============================================================
    if(!body.name || !body.number) {
        res.status(422).json({ msg: 'A field is empty!' });
    }

    if(persons.find(person => person.name === body.name)) {
        res.status(422).json({ msg: 'That name is already taken!' })
    }
    // Step six ends here ================================================================================

    const formData = {
        id: generateId(),
        name: body.name,
        number: body.number,
        createdAt: new Date()
    }

    persons = persons.concat(formData);
    res.json(persons);
})

// Step five ends here ================================================================================

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
})