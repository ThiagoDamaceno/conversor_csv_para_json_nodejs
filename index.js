const fs = require('fs')
const readline = require('readline')

class JsonGenerator {
    constructor(lines) {
        this.lines = lines
    }

    getName(lineSplited) {
        return lineSplited[0]
    }

    getEid(lineSplited) {
        return lineSplited[1]
    }

    getGroups(lineSplited) {
        const columnOne = lineSplited[2].split(' / ')
        const columnTwo = lineSplited[3].split(' / ')
        const columnThree = lineSplited[4].split(' / ')

        return columnOne.concat(columnTwo).concat(columnThree)
    }

    getAddresses(lineSplited) {  
        const data = [
            {
                type: 'email',
                tag: 'Student',
                address: lineSplited[5]
            },
            {
                type: 'phone',
                tag: 'Student',
                address: lineSplited[6]
            },
            {
                type: 'email',
                tag: 'Parent',
                address: lineSplited[7].split('/')
            },
            {
                type: 'phone',
                tag: 'Parent',
                address: lineSplited[8]
            }
        ]
        return data
    }

    getInvisible(lineSplited) {
        return lineSplited[9] == 'yes' || lineSplited[10] == '1'
    }

    getSeeAll(lineSplited) {
        return lineSplited[10] == 'yes' || lineSplited[10] == '1'
    }

    generate() {
        const json = []
        for (let i = 1; i < this.lines.length; i++) {
            const lineSplited = this.lines[i].split(',')
            json.push(
                {
                    fullname: this.getName(lineSplited),
                    eid: this.getEid(lineSplited),
                    groups: this.getGroups(lineSplited),
                    addresses: this.getAddresses(lineSplited),
                    invisible: this.getInvisible(lineSplited),
                    see_all: this.getSeeAll(lineSplited)
                }
            )
        }
        return json
    }
}

async function readFile(path) {
    const stream = fs.createReadStream(path)
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    })
    
    const lines = []

    for await (const line of rl) {
        lines.push(line)
    }

    return lines
}

function saveFile(path, string) {
    fs.writeFile(path, string, 'utf8', (err) => {
        if (err) {
            console.log('An error occured while writing JSON Object to File.');
            return console.log(err);
        }
    });
}

async function main() {
    const lines = await readFile('./input.csv')

    const json = (new JsonGenerator(lines)).generate()

    saveFile('./output.json', JSON.stringify(json))

    console.log('Done!')
}

main()