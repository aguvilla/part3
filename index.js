require('dotenv').config()

const express = require('express')

const app = express()

const cors = require('cors')

const Note = require('./models/note')

const { PORT } = process.env

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

app.get('/api/notes', (request, response) => {
	Note.find({}).then((notes) => response.json(notes))
})

app.get('/api/notes/:id', (request, response, next) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch((error) => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end()
		})
		.catch((error) => next(error))
})

app.post('/api/notes', (request, response, next) => {
	const { body } = request
	const note = new Note({
		content: body.content,
		important: body.important || false,
		date: new Date(),
	})
	note
		.save()
		.then((savedNote) => savedNote.toJSON())
		.then((savedAndFormattedNote) => {
			response.json(savedAndFormattedNote)
		})
		.catch((error) => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
	const { body } = request

	const note = {
		content: body.content,
		important: body.important,
	}
	Note.findByIdAndUpdate(request.params.id, note, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote)
		}).catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	}
	if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	return (next(error))
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
