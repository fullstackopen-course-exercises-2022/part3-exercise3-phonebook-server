const express = require('express');
const app = express();

let notes = [
    {
        id: 1,
        content: "Hello World!",
        createAt: "2022-16-02",
        important: true
    },
    {
        id: 2,
        content: "Client World!",
        createAt: "2022-17-02",
        important: false
    },
    {
        id: 3,
        content: "Hello Client!",
        createAt: "2022-16-02",
        important: true
    },
]

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.post('/api/notes', (req, res) => {
    const generateId = () => {
        const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0
        return maxId + 1
    }

    const note = req.body;
    if(!note.content) {
        res.status(404).json('Enter some text!')
    }

    const formData = {
        content: note.content,
        important: note.important || false,
        id: generateId(),
        createdAt: new Date()
    }
    notes = notes.concat(formData)
    console.log(note)
    res.json(formData);
});

app.get('/api/notes', (req, res) => {
    res.send(notes);
});

app.get('/api/notes/:id', (req, res) => {
    const noteId = Number(req.params.id);
    const note = notes.find((note) => note.id === noteId)
    if(note) {
        res.json({ data: note, msg: `Note id: ${noteId}, found!`});
    } else {
        res.status(404).json({ msg: `Note id ${noteId}, not found!` })
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = Number(req.params.id);
    notes = notes.filter(note => note.id !== noteId);
    res.status(204).end();
})

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Connected to PORT: ${PORT}`);
})
