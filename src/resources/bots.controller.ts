import { Router } from 'express'
import { BadRequestException, NotFoundException } from '~/utils/exceptions'
import { Game } from '~~/types/Game'
/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const BotsController = Router()

BotsController.get('/bot-movement', (req, res) => {
  const DIRECTIONS = [ "LEFT", "UP", "DOWN", "RIGHT"]
  const ACTIONS = ["PLANT_BOMB", "MOVE"]
  // TODO : utiliser l'IA plutôt qu'une direction random
  const randomDirection = DIRECTIONS[Math.floor((Math.random() * DIRECTIONS.length))]
  const randomAction = ACTIONS[Math.floor((Math.random() * 2))]
  let obj = null
  if (randomAction == "PLANT_BOMB"){
    obj = { action: randomAction}
  }
  else{
    obj = { action: randomAction, direction: randomDirection}
  }
  return res.status(200).json(obj)
})

BotsController.post('/set-game', (req, res) => {
  const DIFFICULTY = [ "EASY", "MEDIUM", "HARD"]
  const games:Game = {id: 1, difficulty: 'EASY', map: '3x3'}
  /*
  const randomDifficulty = DIFFICULTY[Math.floor((Math.random() * DIFFICULTY.length))]
  const obj = { difficulty: randomDifficulty }
  */
 try{
    return res.status(200).json("Succès dans l'initialisation de la partie.")
 } catch(NotFoundException){
    return res.json("Erreur dans l'initialisation de la partie.")
 }
})

BotsController.delete('/delete-game', (req, res) => {
 try{
    return res.status(200).json("Succès dans la suppression de la partie.")
 } catch(NotFoundException){
    return res.json("Erreur dans la suppression de la partie.")
 }
})

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { BotsController }