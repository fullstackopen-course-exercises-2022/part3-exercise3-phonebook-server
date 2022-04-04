const mongoose = require('mongoose')

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        require: true
    },
    number: {
        type: String,
        validate: {
            validator: function(n) {
                return /\d{3}-\d{8}/.test(n)
            },
            message: props => `${props.value} is not a valid phone number`
        },
        required: true
    }
}, { timestamps: true })

personSchema.set('toJSON', {
    transform: (doc, option) => {
        option.id = option._id.toString()
        delete option._id
        delete option.__v
    }
})

const Person = mongoose.model('person', personSchema)

module.exports = Person