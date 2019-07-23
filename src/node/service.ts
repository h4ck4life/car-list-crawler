const tinyreq = require('tinyreq');
const cheerio = require('cheerio');

export interface CarDetails {
    price: string;
    make: string;
    model: string;
    variant: string;
    condition: string;
    year_manufactured: string;
    transmission: string;
    engine_capacity: string;
    body_type: string;
    location: string;
    warranty: string;
    posted_date: string;
    updated_date: string;
}

export class CarInfo {

    private baseUrl: string;
    private userAgent: string;
    private searchUri: string = '/search';

    constructor(baseUrl: string, userAgent: string) {
        this.baseUrl = baseUrl;
        this.userAgent = userAgent;
    }

    /**
     * Get total page numbers in search page
     *
     * @returns {Promise<number>}
     * @memberof CarInfo
     */
    async getTotalPageNumbers(): Promise<number> {
        return await tinyreq({
            url: this.baseUrl + this.searchUri,
            headers: {
                'user-agent': this.userAgent
            }
        }).then(body => {
            const $ = cheerio.load(body);
            return $('.pagination-no').text().split(' ')[2] || 0

        }).catch(err => {
            console.log(err);
            return 0;
        });
    }

    /**
     * Get car list by page number
     *
     * @param {number} pageNumber
     * @returns {Promise<string[]>}
     * @memberof CarInfo
     */
    async getCarListByPageNumber(pageNumber: number): Promise<string[]> {
        var carList: string[] = [];
        return await tinyreq({
            url: this.baseUrl + this.searchUri + '/?pg=' + pageNumber.toString(),
            headers: {
                'user-agent': this.userAgent
            }
        }).then(body => {
            const $ = cheerio.load(body);
            const searchListingHtml = $('.search-results-list');
            if (searchListingHtml.children().length > 0) {
                for (const listElement of searchListingHtml.children()) {
                    carList.push($(listElement).find('a').attr('href') || undefined);
                }
                return carList.filter((car) => car != undefined);
            }

        }).catch(err => {
            console.log(err);
            return carList;
        });
    }

    /**
     * Get car details by url
     *
     * @param {string} url
     * @returns {Promise<CarDetails>}
     * @memberof CarInfo
     */
    async getCarDetails(url: string): Promise<CarDetails> {
        var carDetail = {} as CarDetails;
        return await tinyreq({
            url: this.baseUrl + url,
            headers: {
                'user-agent': this.userAgent
            }
        }).then(body => {
            const $ = cheerio.load(body);
            const carInfos = $('.table-listing').find('tr');
            for (const info of carInfos) {
                let currentValue = $(info).find('td').eq(1).text().trim();
                switch ($(info).find('td').eq(0).text().trim()) {
                    case 'Car Make': {
                        carDetail.make = currentValue;
                        break;
                    }
                    case 'Car Model': {
                        carDetail.model = currentValue;
                        break;
                    }
                    case 'Car Variant': {
                        carDetail.variant = currentValue;
                        break;
                    }
                    case 'Condition': {
                        carDetail.condition = currentValue;
                        break;
                    }
                    case 'Year Manufactured': {
                        carDetail.year_manufactured = currentValue;
                        break;
                    }
                    case 'Transmission': {
                        carDetail.transmission = currentValue;
                        break;
                    }
                    case 'Engine Capacity': {
                        carDetail.engine_capacity = currentValue;
                        break;
                    }
                    case 'Body Type': {
                        carDetail.body_type = currentValue;
                        break;
                    }
                    case 'Location': {
                        carDetail.location = currentValue;
                        break;
                    }
                    case 'Warranty': {
                        carDetail.warranty = currentValue;
                        break;
                    }
                    case 'Posted On': {
                        carDetail.posted_date = currentValue;
                        break;
                    }
                    case 'Updated On': {
                        carDetail.updated_date = currentValue;
                        break;
                    }
                }
            }
            carDetail.price = $('.listing-price').text().trim().substr(3).replace(',', '') || 0;
            return carDetail;

        }).catch(err => {
            console.log(err);
            return carDetail;
        });
    }
}