import {formatDate, formatDateMDY, ownerName, sum} from './index';

test('adds 1 + 2 to equal 3', () => {
    const actual = sum(1, 2);
    expect(actual).toBe(3);
});
test('adds 1 + (-2) to equal -1', () => {
    const actual = sum(1, -2);
    expect(actual).toBe(-1);
});

describe("formatDate tests", () => {
    test('should return empty', () => {
        const actual = formatDate();
        expect(actual).toEqual('');
    });
    test('should return DD/MM/YYYY with ISOinput', () => {
        const date = formatDate('1996-02-16T12:34:56');
        expect(date).toEqual('16/02/1996');
    });
    test('should return DD/MM/YYYY with full date input', () => {
        const date = formatDate('16 februari 1996 12:00 GMT+0200');
        expect(date).toEqual('16/02/1996');
    });
    test('should not return MM/DD/YYYY', () => {
        const date = formatDate('1996-02-16T12:34:56');
        expect(date).not.toEqual('02/16/1996');
    });
    test('should not return YYYY/MM/DD', () => {
        const date = formatDate('1996-02-16T12:34:56');
        expect(date).not.toEqual('1996/02/16');
    });
    test('should throw error on wrong month', () => {
        try {
            formatDate('1996-13-16T12:34:56')
        } catch (e) {
            expect(e).toEqual(new Error("Invalid Date"));
        }
    });
    test('should throw error on wrong day, ISO', () => {
        try {
            formatDate('32 augustus 1997 12:00')
        } catch (e) {
            expect(e).toEqual(new Error("Invalid Date"));
        }
    });
    test('should throw error on wrong day, new Date', () => {
        expect(() =>
            formatDate('32 augustus 1997 12:00')
        ).toThrowError();
    });
    test('should throw error on wrong input', () => {
        expect(() =>
            formatDate('bananas')
        ).toThrowError();
    });
});

describe("formatDateMDY tests", () => {
    test('should return empty', () => {
        const expected = formatDateMDY();
        expect(expected).toEqual('');
    });
    test('should return MM/DD/YYYY with ISO', () => {
        const date = formatDateMDY('1996-02-16T12:34:56');
        expect(date).toEqual('02/16/1996');
    });
    test('should return MM/DD/YYYY with new Date', () => {
        const date = formatDateMDY('16 februari 1996 12:00 GMT+0200');
        expect(date).toEqual('02/16/1996');
    });
    test('should not return DD/MM/YYYY', () => {
        const date = formatDateMDY('1996-02-16T12:34:56');
        expect(date).not.toEqual('16/02/1996');
    });
    test('should throw error on wrong month', () => {
        expect(() =>
            formatDateMDY('1996-13-16T12:34:56')
        ).toThrowError();
    });
    test('should throw error on wrong day, ISO', () => {
        try {
            formatDateMDY('1996-01-32T12:34:56')
        } catch (e) {
            expect(e).toEqual(new Error("Invalid Date"));
        }
    });
    test('should throw error on wrong day, new Date', () => {
        try {
            formatDateMDY('32 janueri 1996 12:00 GMT+0200')
        } catch (e) {
            expect(e).toEqual(new Error("Invalid Date"));
        }
    });
    test('should throw error on wrong input', () => {
        expect(() =>
            formatDateMDY('apples')
        ).toThrowError();
    });
});

describe("ownerName tests", () => {
    test('should return Arne Herbots', () => {
        const user = {type: 'particulier', first_name: 'Arne', last_name: 'Herbots'};
        expect(ownerName(user)).toEqual('Arne Herbots');
    });
    test('should return undefined without name', () => {
        const user = {type: 'particulier'};
        expect(ownerName(user)).toEqual('undefined undefined');
    });
    test('should return companyName', () => {
        const company = {type: 'company', company: 'companyName'};
        expect(ownerName(company)).toEqual('companyName');
    });
    test('should return undefined without name', () => {
        const company = {type: 'company'};
        expect(ownerName(company)).toEqual('undefined');
    });
    test('should return company without type', () => {
        const company = {company: 'companyName'};
        expect(ownerName(company)).toEqual('companyName');
    });
    test('should return undefined with empty object', () => {
        const company = {};
        expect(ownerName(company)).toEqual('undefined');
    });
});
