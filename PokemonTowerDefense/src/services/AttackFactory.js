import StatusCondition from "./StatusConditionFactory.js";
import StatusConditionName from "../enums/StatusConditionName.js";
import { MOVES, timer } from "../globals.js";
import Attack from "../objects/Attack.js";
import PokemonStatusCondition from "../objects/PokemonStatusCondition.js";
import StatusMove from "../objects/StatusMove.js";
import StatusConditionFactory from "./StatusConditionFactory.js";

export default class AttackFactory{
    static createAttack(attackName){
        const match = MOVES.filter(m => 
                m.name.replace('-', ' ').toLowerCase() == attackName.toLowerCase())
                .filter(a => a != undefined)[0]

        // Move not found in moves dataset
        if(!match)
            return null;

        // Use other method for status moves
        if (match.damage_class == 'status')
            return AttackFactory.createStatusMove(attackName);

        const attack = new Attack(match.name, match.effectDescription, match.damage_class, match.power, match.type, match.accuracy, match.priority);
        let newAttackName = '';
        const splitAttack = attack.name.replace('-', ' ').split(' ');
        splitAttack.forEach((word, index) => {
            word = word.charAt(0).toUpperCase() + word.slice(1);
            newAttackName += word;
            if (index != splitAttack.length-1)
            newAttackName += ' ';
        });
        attack.name = newAttackName;

        return attack;
    }

    static createStatusMove(attackName){
        const match = MOVES.filter(m => 
            m.name.replace('-', ' ').toLowerCase() == attackName.toLowerCase())
            .filter(a => a != undefined)[0]

        if(!match)
            return null;

        const splitAttack = attackName.replace('-', ' ').split(' ');
        let formattedAttackName = "";
        splitAttack.forEach((word, index) => {
            word = word.charAt(0).toUpperCase() + word.slice(1);
            formattedAttackName += word;
            if (index != splitAttack.length-1)
            formattedAttackName += ' ';
        });

        switch(attackName.toLowerCase().replace(" ", "-")){
            case 'poison-powder':
                return generateStatusMove(formattedAttackName, match, StatusConditionName.Poisoned, 1)
            case 'string-shot':
                return generateStatusMove(formattedAttackName, match, StatusConditionName.Slowed, 2)
            case 'sing':
                return generateStatusMove(formattedAttackName, match, StatusConditionName.Asleep, 5)
            }
        
    }
}

/**
 * Creates a status move
 * @param {String} name The name of the attack
 * @param {Object} attackData The attack data
 * @param {StatusConditionName} statusConditionName The name of the status condition this causes
 * @param {Number} cooldown The cooldown time for the attack.
 * @returns A new StatusMove
 */
function generateStatusMove(name, attackData, statusConditionName, cooldown){
    return new StatusMove(name, attackData.effectDescription, attackData.damage_class, attackData.power, attackData.type, attackData.accuracy, statusConditionName, cooldown)
}

export const EXISTING_STATUS_MOVE_NAMES = [
    'poison-powder',
    'string-shot',
    'sing'
]