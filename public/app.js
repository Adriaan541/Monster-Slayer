function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


const app = Vue.createApp({
    data() {
        return {
            maxPlayerHealth: 100,
            maxMonsterHealth: 150,
            playerHealth: 100,
            monsterHealth: 150,
            currentRound: 0,
            healthPotionsLeft: 3,
            winner: null,
            logMessages: []
        }
    },
    watch: {
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'monster';
            }
        },
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                this.winner = 'draw';
            } else if (value <= 0) {
                this.winner = 'player';
            }
        }
    },
    computed: {
        monsterBarStyle() {
            if (this.monsterHealth < 0) {
                return {width: 0 + '%' }
            }
            return {width: (this.monsterHealth/this.maxMonsterHealth)*100 + '%'}
        },
        playerBarStyle() {
            if (this.playerHealth < 0) {
                return {width: 0 + '%' }
            }
            return {width: (this.playerHealth/this.maxPlayerHealth)*100 + '%'}
        },
        specialAttackAvailable() {
            return this.currentRound % 3 !== 0
        },
        healingPotionAvailable() {
            return this.healthPotionsLeft > 0;
        }
    },
    methods: {
        startGame() {
            this.playerHealth = this.maxPlayerHealth;
            this.monsterHealth = this.maxMonsterHealth;
            this.currentRound = 0;
            this.winner = null;
            this.logMessages = [];
        },
        attackMonster() {
            this.currentRound++;
            const attackPoints = getRandomValue(5, 12);
            this.monsterHealth -= attackPoints;
            this.AddLogMessage('player', 'attack', attackPoints);
            this.attackPlayer();
        },
        attackPlayer() {
            const attackPoints = getRandomValue(7, 15);
            this.playerHealth -= attackPoints;
            this.AddLogMessage('monster', 'attack', attackPoints);
        },
        specialAttack() {
            this.currentRound++;
            const attackPoints = getRandomValue(15, 25);
            this.monsterHealth -= attackPoints;
            this.AddLogMessage('player', 'special attack', attackPoints);
            this.attackPlayer();
        },
        healPlayer() {
            this.currentRound++;
            this.healthPotionsLeft--;
            const healingPoints = getRandomValue(15, 25);
            this.playerHealth += healingPoints;
            if (this.playerHealth > this.maxPlayerHealth) {
                const actualHealingPoints = this.maxPlayerHealth - (this.playerHealth - healingPoints);
                this.AddLogMessage('player', 'heal', actualHealingPoints);
                this.playerHealth = this.maxPlayerHealth;
            } else {
                this.AddLogMessage('player', 'heal', healingPoints);
            }
            this.attackPlayer();
        },
        surrender() {
            this.winner = 'monster';
        },
        AddLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    }
});

app.mount('#game');
