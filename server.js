// 3.1: This is phonebook backend step1 ==============================================================
const express = require('express');
const app = express();
let persons = require('./persons');
const PORT = 3001;

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the persons API</h1>');
})

app.use(express.json());

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
    persons = persons.filter((person) => person.id !== personId);
    res.status(204).end();
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