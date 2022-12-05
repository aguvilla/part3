const Note = require('./models/note')
const { request } = require('express')
const express = require('express')
const app = express()
const cors = require('cors')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const generateId = () =>{
  const maxId = notes.length > 0
  ? Math.max(...notes.map(n => n.id))
  :0
  return maxId + 1
}


app.get('/api/notes',(request,response) =>{
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  
  const note = notes.find(note =>note.id === id)
  
  if(note){
    response.json(note)}
  else{
    response.status(404).end()
  }  
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.post('/api/notes',(request, response) =>{
  const body = request.body
  
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    import: body.important || false,
    date: new Date(),
    id: generateId(),
  }
  
  notes = notes.concat(note)
  
  response.json(note)

})



app.listen(PORT,() =>{
console.log(`Server running on port ${PORT}`)})