export class DbFrame {
    lastValue: number;
    average: number = 0;
    values: number = 0;
    iterations: number = 0;
    noise_info: Object
    constructor(average: number,
        iterations: number,
        values: number,
        lastValue: number,
        noise_info: Object) {

        this.average = average;
        this.iterations = iterations;
        this.values = values;
        this.lastValue = lastValue;
        this.noise_info = noise_info;
    }
}