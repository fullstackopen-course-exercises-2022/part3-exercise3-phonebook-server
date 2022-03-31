const mongoose = require('mongoose');

if(process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://root:${password}@cluster0.2nykr.mongodb.net/phonebookDB?retryWrites=true&w=majority`;

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
}, {timestamps: true})

const Person = mongoose.model('person', personSchema);

// const createPerson = new Person({
//     name: "Emmanuel Okuchukwu",
//     number: "+44 7415 639792"
// })
//
// createPerson.save().then(() => {
//     console.log('Person Saved to Database!');
// });

Person.find({}).then((result) => {
    console.log(`Person Object: ${result}`);
    mongoose.connection.close();
})
