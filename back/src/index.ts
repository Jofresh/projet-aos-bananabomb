import cors from 'cors'
import express from 'express'
import { config } from '~/config'
import { BotsController  } from '~/resources/bots.controller'
import { ExceptionsHandler } from '~/middlewares/exceptions.handler'
import { UnknownRoutesHandler } from '~/middlewares/unknownRoutes.handler'

/**
 * On créé une nouvelle "application" express
 */
const app = express()

app.use(express.json())

app.use(cors())

app.use('/', BotsController)

app.get('/', (req, res) => res.send('🏠'))

app.all('*', UnknownRoutesHandler)

app.use(ExceptionsHandler)

app.listen(config.API_PORT, () => console.log('Silence, ça tourne.'))