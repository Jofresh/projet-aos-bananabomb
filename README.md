# BananaBomb Project

Bienvenue dans le monde explosif de BananaBomb, un jeu inspiré du célèbre Bomberman! 

## Installation

Pour installer le projet, vous avez deux solutions: une solution Docker (plus simple) et une solution manuelle.

### Solution 1 : Docker
1. Dans un terminal, clonez le repository GitHub: 

   ```bash
   git clone https://github.com/Jofresh/projet-aos-bananabomb.git
   cd projet-aos-bananabomb
   ```

2. Assurez-vous d'avoir Docker installé sur votre machine.

3. Lancez Docker Compose pour déployer l'application:

   ```bash
   docker-compose up -d --build
   ```

4. Accédez à l'application depuis votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173). _L'API est accessible à l'adresse [http://localhost:3000](http://localhost:3000)._

5. Pour arrêter l'application, utilisez la commande suivante:

   ```bash
   docker-compose down
   ```

### Solution 2 : manuelle
1. Dans un terminal, clonez le repository GitHub: 

   ```bash
   git clone https://github.com/Jofresh/projet-aos-bananabomb.git
   cd projet-aos-bananabomb
   ```

2. Assurez-vous d'avoir Node.js et npm installés sur votre machine.

3. Dans un premier terminal, lancez l'API:

   ```bash
   cd back
   npm install
   npm run dev
   ```

4. Dans un second terminal, lancez l'application:

   ```bash
   cd front
   npm install
   npm run dev
   ```

5. Accédez à l'application depuis votre navigateur à l'adresse [http://localhost:5173](http://localhost:5173). _L'API est accessible à l'adresse [http://localhost:3000](http://localhost:3000)._

6. Pour arrêter l'application, utilisez la combinaison de touches `Ctrl + C` dans les deux terminaux.

Amusez-vous bien avec BananaBomb!