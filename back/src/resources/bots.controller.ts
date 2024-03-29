import { Router } from 'express'
import fs from 'fs'
import path from 'path'

import { FILE_DB_PATH } from '~/config'
import { DIFFICULTY, DIRECTION } from '~~/types/Game'
import AILearningInstance from './ai_learning.service'

let jsonStateBeforeGame = 0
let jsonStateAfterGame = 0

const BotsController = Router()

// This endpoint is called by the front to get the next moves of the bot
BotsController.post('/bot-movement', (req, res) => {
  const formattedMap = AILearningInstance.formatMap(req.body.map || [])
  const mapId = AILearningInstance.generateIdMap(formattedMap)

  const dbFile = fs.readFileSync(path.join(__dirname, FILE_DB_PATH), 'utf-8')
  const parsedFile = JSON.parse(dbFile)
  if (parsedFile[mapId]) {
    return res.status(200).json({ nextMoves: parsedFile[mapId], source: 'AI' })
  }

  AILearningInstance.newLearning(formattedMap)

  // Picks three random moves
  const ACTIONS = Object.values(DIRECTION)
  const nextMoves = Array.from({ length: 3 }, () => ACTIONS[Math.floor(Math.random() * ACTIONS.length)]).join('')
  return res.status(200).json({ nextMoves, source: 'random' })
})

// This endpoint is called by the front to initialize the game
BotsController.post('/game', (req, res) => {
  jsonStateBeforeGame = AILearningInstance.readFile()

  const difficulty = req.body.difficulty

  if (!!difficulty && Object.values(DIFFICULTY).includes(difficulty)) {
    // ... should set the difficulty here
    return res.status(200).json('Succès dans la définition de la difficulté.')
  }

  // Picks a random difficulty
  const difficulties = Object.values(DIFFICULTY)
  const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]

  // ... should set the difficulty here
  return res.status(200).json('Succès dans la définition de la difficulté.')
})

// This endpoint is called by the front to stop the game
BotsController.delete('/game', (req, res) => {
  try {
    jsonStateAfterGame = AILearningInstance.readFile()
    return res.status(200).json({ success: 'Succès dans la suppression de la partie.' })
  } catch (e) {
    return res.json({ error: 'Erreur dans la suppression de la partie.' })
  }
})

// This endpoint is called by the front to get the learning rate of the bot
BotsController.get('/learning-rate', (req, res) => {
  try {
    const newResult = jsonStateAfterGame - jsonStateBeforeGame
    const percentageResult =  100 * (newResult / jsonStateAfterGame)
    return res.status(200).json({ success: true, learnedPathsNumber: newResult, percentageResult })
  } catch (e) {
    return res.status(500).json({ error: "Erreur dans le calcul du taux d'apprentissage." })
  }
})

export { BotsController }
