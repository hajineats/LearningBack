const express = require('express')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}
const password = process.argv[2]
const url =
    `mongodb+srv://fullstack:${password}@boilerplate.cu2ek.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true,
})

// Note.find({important:true}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })

// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2019-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2019-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2019-05-30T19:20:14.298Z",
        important: true
    }
]

app.get('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id)

    const note = notes.find(n=>n.id===id)
    if(note){
        res.json(note)
    }else{
        res.status(404).end()
    }
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    if(!body.content){
        return response.status(400).json({
            error:"content is missing"
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(notes)

})

app.delete('/api/notes/:id',(req,res)=>{
    const id = Number(req.params.id)
    notes = notes.filter(n=>n.id!==id)
    res.status(204).end()
})

app.get('/api/notes', (req,res)=>{
    Note.find({}).then(notes=>{
        res.json(notes)
    })
})
const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`)
})