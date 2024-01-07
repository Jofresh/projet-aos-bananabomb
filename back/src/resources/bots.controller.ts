import { Router } from 'express';
import { AiLearningService } from './ai_learning.service';
import fs from 'fs';
/**
 * Nous créeons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const BotsController = Router()
const aiLearningClass = new AiLearningService()

BotsController.get('/bot-movement', (req, res) => {
   let mapReq = req.body.map;
   let formatmap = aiLearningClass.formatMap(mapReq);
   let indexMap = aiLearningClass.generateIdMap(formatmap);
   let data = fs.readFileSync(process.cwd()+'\\src\\resources\\ai_learning_db.json', 'utf-8');
   let JSONdata = JSON.parse(data);
   if(JSONdata.include(indexMap)){
      return {nextMoves: JSONdata[indexMap]}
   }
   else{
      const ACTIONS = [ "LEFT", "UP", "DOWN", "RIGHT"]
      let obj = null
      for (let i = 0; i < 3; i++){
         let randomAction = ACTIONS[Math.floor((Math.random() * 4))]
         if (obj == null){
            obj = randomAction
         }
         else{
            obj = obj + "," + randomAction
         }
      } 
      aiLearningClass.newLearning(formatmap);
      return res.status(200).json(obj);
   }
  
})


BotsController.post('/set-game', (req, res) => {
  const DIFFICULTY = [ "EASY", "MEDIUM", "HARD"]
  //const games:Game = {id: 1, difficulty: 'EASY', map: '3x3'}
  const randomDifficulty = DIFFICULTY[Math.floor((Math.random() * DIFFICULTY.length))]
  console.log(req.body)
  const obj = { difficulty: randomDifficulty }
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