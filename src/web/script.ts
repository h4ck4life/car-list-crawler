//declare var csv: any;
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as Papa from "papaparse";

/**
 * Get the car data reduced to just the variables we are interested
 * and cleaned of missing data.
 */
async function getData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
        Papa.parse("/public/test_2019-07-12.csv", {
            download: true,
            header: true,
            complete: function (results) {
                let cleaned = results.data.map(car => ({
                    price: car.price,
                    year: car.year_manufactured,
                })).filter(car => (car.price != null && car.year != null));

                resolve(cleaned);
            },
        });
    });

}

async function run() {
    // Load and plot the original input data that we are going to train on.
    getData().then((data) => {
        const values = data.map(d => ({
            x: parseFloat(d.year),
            y: parseFloat(d.price),
        }));

        tfvis.render.scatterplot(
            { name: 'Price v Year' },
            { values },
            {
                xLabel: 'Year',
                yLabel: 'Price',
                height: 300,
                zoomToFit: true,
            }
        );
    });


    // More code will be added below
}

document.addEventListener('DOMContentLoaded', run);