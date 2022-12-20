
export default class Attack{

    static DEFAULT_COOLDOWN = 0.75;
    static PRIORITY_COOLDOWN_RATIO = 0.75;

    /**
     * Creates an attack object.
     * @param {String} name The attack's name.
     * @param {String} description A description of the attack.
     * @param {String} damageClass The type of attack (physical/special/status).
     * @param {Number} power The power of the attack.
     * @param {AttackType} type The attack type.
     * @param {Number} accuracy The attack's accuracy 0 < x <= 1
     * @param {boolean} priority Whether this attack is a priority move
     */
    constructor(name, description, damageClass, power, type, accuracy, cooldown = Attack.DEFAULT_COOLDOWN, priority = false){
        this.name = name;
        this.description = description;
        this.damageClass = damageClass;
        this.power = power;
        this.type = type.charAt(0).toUpperCase() + type.slice(1);
        this.accuracy = accuracy;
        this.priority = priority;
        this.cooldown = cooldown * (priority ? Attack.PRIORITY_COOLDOWN_RATIO : 1);
    }

}