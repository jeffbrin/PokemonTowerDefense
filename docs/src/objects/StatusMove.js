import Attack from "./Attack.js";

export default class StatusMove extends Attack{
    constructor(name, description, damageClass, power, type, accuracy, statusConditionName, cooldown){
        super(name, description, damageClass, power, type, accuracy, cooldown);
        this.statusConditionName = statusConditionName;
    }

    attack(attacker, target){
        target.getAttacked(this, attacker);
    }
}