'use strict';

/**
 * A "private" object
 */
class Helper {
    constructor(repLogs) {
        this.repLogs = repLogs;
    }

    calculateTotalWeight() {
        return Helper._calculateWeight(
            this.repLogs
        )
    }

    getTotalWeightString(maxWeight = 500) {
        let weight = this.calculateTotalWeight();
        if (weight > maxWeight) {
            weight = maxWeight + '+';
        }
        return weight + ' kg'
    }

    static _calculateWeight(repLogs) {
        let totalWeight = 0;

        // repLogs to teraz Map, więc iterujemy po jej wartościach
        for (let repLog of repLogs.values()) {
            totalWeight += repLog.totalWeightLifted;
        }

        return totalWeight;
    }
}

export default Helper;
