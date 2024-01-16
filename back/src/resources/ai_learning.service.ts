import fs from 'fs'
import path from 'path'
import { FILE_DB_PATH } from '~/config'
import { bestPath, gameTile } from '~~/types/ai'
import { DIRECTION } from '~~/types/Game'

class AILearning {
  formatMap(map: gameTile[]) {
    try {
      const botPosition = map.filter(caseMap => caseMap.value === 1)[0]
      return map.filter(caseMap => (caseMap.x <= botPosition.x + 3) && (caseMap.y <= botPosition.y + 3) && (caseMap.x >= botPosition.x - 3) && (caseMap.y >= botPosition.y - 3))
    } catch (e) {
      console.log(e)
    }

    return []
  }

  newLearning(givenMap: gameTile[]) {
    const possibleDirections = Object.values(DIRECTION)

    let bestPathValue = 0
    let bestPath: bestPath = { firstStep: 'N', secondStep: 'N', thirdStep: 'N' }

    try {
      for (let k = 1; k < 1000; k++) {
        const parsedMap: gameTile[] = JSON.parse(JSON.stringify(givenMap))
        let botPosition = parsedMap.find(coords => coords.value === 1) || { x: 0, y: 0, value: 0 }

        let currentPathValue = 0
        let pathValue = ''
        for (let j = 0; j < 3; j++) {
          const newPosBot: gameTile = {
            x: botPosition.x,
            y: botPosition.y,
            value: botPosition.value
          }

          const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)]
          pathValue += randomDirection.charAt(0)
          switch (randomDirection) {
          case DIRECTION.LEFT:
            // TODO : typo
            // eslint-disable-next-line no-case-declarations
            const canMove = parsedMap.filter(coords => (coords.x == newPosBot.x - 1) && (coords.y == newPosBot.y) && (coords.value != 0)).length > 0
            if (newPosBot.x > 0 && canMove) {
              newPosBot.x = newPosBot.x - 1
              const tmpValue = parsedMap.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0]
              newPosBot.value = tmpValue.value
              currentPathValue = currentPathValue + newPosBot.value
            }
            break
          case DIRECTION.UP:
            if(newPosBot.y > 0 && parsedMap.filter(coords => (coords.x == newPosBot.x) && (coords.y == newPosBot.y - 1) && (coords.value != 0))){
              newPosBot.y = newPosBot.y - 1
              const tmpValue = parsedMap.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0]
              newPosBot.value = tmpValue.value
              currentPathValue = currentPathValue + newPosBot.value
            }
            break
          case DIRECTION.DOWN:
            if(parsedMap.filter(coords => coords.y == newPosBot.y + 1).length && parsedMap.filter(coords => (coords.x == newPosBot.x) && (coords.y == newPosBot.y + 1) && (coords.value != 0))){
              newPosBot.y = newPosBot.y + 1
              const tmpValue = parsedMap.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0]
              newPosBot.value = tmpValue.value
              currentPathValue = currentPathValue + newPosBot.value
            }
            break
          case DIRECTION.RIGHT:
            if(parsedMap.filter(coords => coords.x == newPosBot.x + 1).length && parsedMap.filter(coords => (coords.x == newPosBot.x + 1) && (coords.y == newPosBot.y) && (coords.value != 0))){
              newPosBot.x = newPosBot.x + 1
              const tmpValue = parsedMap.filter(coords => coords.x == newPosBot.x && coords.y == newPosBot.y )[0]
              newPosBot.value = tmpValue.value
              currentPathValue = currentPathValue + newPosBot.value
            }
            break
          default:
          }

          parsedMap.filter(coords => coords.x == botPosition.x && coords.y == botPosition.y).forEach(coords => {
            coords.value = 3
          })

          botPosition = {
            x: newPosBot.x,
            y: newPosBot.y,
            value: 1
          }
        }

        if (currentPathValue > bestPathValue) {
          bestPathValue = currentPathValue
          bestPath = {
            firstStep: pathValue.charAt(0),
            secondStep: pathValue.charAt(1),
            thirdStep: pathValue.charAt(2)
          }
        }
      }

      const idMap = this.generateIdMap(givenMap)
      this.writeInFile(idMap, bestPath)
    } catch (e) {
      console.log(e)
    }

    return 'Working fine'
  }

  writeInFile(id: string, result: bestPath) {
    try {
      const computedPath = result.firstStep + result.secondStep + result.thirdStep

      const file = fs.readFileSync(path.join(__dirname, FILE_DB_PATH), 'utf-8')
      const parsedFile = JSON.parse(file)

      const fileContent = {
        ...parsedFile,
        [id]: computedPath
      }

      fs.writeFileSync(path.join(__dirname, FILE_DB_PATH), JSON.stringify(fileContent))
    } catch (e) {
      console.log(e)
    }
  }

  generateIdMap(map: gameTile[]) {
    return map.reduce((acc, gameTile) => acc + (gameTile.value || 0), '')
  }

  readFile() {
    const file = fs.readFileSync(path.join(__dirname, FILE_DB_PATH), 'utf-8')
    const parsedFile = JSON.parse(file)
    return Object.keys(parsedFile).length || 0
  }
}

export default new AILearning()
