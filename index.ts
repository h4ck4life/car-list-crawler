import { CarInfo, CarDetails } from './src/service';
const ObjectsToCsv = require('objects-to-csv');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl: string = process.env.BASE_URL || '';
const userAgent: string = process.env.USER_AGENT || '';
const carInfo = new CarInfo(baseUrl, userAgent);

carInfo.getTotalPageNumbers()
    .then((totalPages) => {
        return totalPages
    })
    .then(async totalPages => {
        var carPages: string[] = [];
        for (let currentPage = 1; currentPage < totalPages; currentPage++) {
            await carInfo.getCarListByPageNumber(currentPage).then((cars) => {
                carPages = carPages.concat(cars);
            });
        }
        return carPages;
    })
    .then(async carPages => {
        var carsResult: CarDetails[] = [];
        for (const carDetail of carPages) {
            await carInfo.getCarDetails(carDetail).then((info) => {
                carsResult.push(info);
            });
        }
        return carsResult;
    })
    .then((carsResult) => {
        const csv = new ObjectsToCsv(carsResult);
        csv.toDisk('./test' + new Date().toISOString().slice(0, 10) + '.csv');
    })