import { Router } from 'express';
import IALearningInstance from './ai_learning.service';
import fs from 'fs';
import path from 'path';

const BotsController = Router()
let jsonStateBeforeGame = 0
let jsonStateAfterGame = 0
let newResult = 0

BotsController.post('/bot-movement', (req, res) => {
   let mapReq = req.body.map || [];
   let formatmap = IALearningInstance.formatMap(mapReq);
   let indexMap = IALearningInstance.generateIdMap(formatmap);
   let data = fs.readFileSync(path.join(__dirname, 'ai_learning_db.json'), 'utf-8');
   let JSONdata = JSON.parse(data);
   if (!!JSONdata[indexMap]){
      return res.json({ nextMoves: JSONdata[indexMap]})
   } else{
      const ACTIONS = [ "L", "U", "D", "R"]
      let obj = null
      for (let i = 0; i < 3; i++){
         let randomAction = ACTIONS[Math.floor((Math.random() * 4))]
         if (obj == null){
            obj = randomAction
         }
         else{
            obj = obj + randomAction
         }
      }
      IALearningInstance.newLearning(formatmap);
      return res.status(200).json({ nextMoves: obj });
   }
})

BotsController.post('/set-game', (req, res) => {
  const DIFFICULTY = [ "EASY", "MEDIUM", "HARD"]
  //const games:Game = {id: 1, difficulty: 'EASY', map: '3x3'}
  const randomDifficulty = DIFFICULTY[Math.floor((Math.random() * DIFFICULTY.length))]
 console.log(req.body)
  const obj = { difficulty: randomDifficulty }
   jsonStateBeforeGame = IALearningInstance.readFile()
  try{
     return res.status(200).json("Succès dans l'initialisation de la partie.")
   } catch(NotFoundException){
   return res.json("Erreur dans l'initialisation de la partie.")
}
})

BotsController.delete('/stop-game', (req, res) => {
  jsonStateAfterGame = IALearningInstance.readFile()
  newResult = jsonStateAfterGame - jsonStateBeforeGame
  try{
    return res.status(200).json("Succès dans la suppression de la partie." + " " + "Chemin apprit par l'IA :" + " " + newResult)
} catch(NotFoundException){
    return res.json("Erreur dans la suppression de la partie.")
}
})

BotsController.get('/claim-result', (req, res) => {
   let percentageResult =  100 * (newResult / jsonStateAfterGame) 
   try{
      return res.status(200).json("Voici le taux d'apprentissage de l'IA sur cette partie : " + percentageResult + "%")
   } catch(NotFoundException){
      return res.json("Erreur dans la récupération du résultat de l'apprentissage de l'IA.")
   }
})
/**
* On expose notre controller pour l'utiliser dans `src/index.ts`
*/
export { BotsController }