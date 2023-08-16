import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitString, Cell, toNano, beginCell } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task4 are ready to use
    });

    function encrypt(s: string, shift: number) {
        shift %= 26;
        if (shift < 0) {
            shift += 26;
        }

        let t = '';

        for (let i = 0; i < s.length; i++) {
            if ('a' <= s[i] && s[i] <= 'z') {
                let x = s.charCodeAt(i) + shift;

                while (x > 'z'.charCodeAt(0))
                    x -= 26;
                
                t += String.fromCharCode(x);
            }
            else
            if ('A' <= s[i] && s[i] <= 'Z') {
                let x = s.charCodeAt(i) + shift;

                while (x > 'Z'.charCodeAt(0))
                    x -= 26;
                
                t += String.fromCharCode(x);
            }
            else {
                t += s[i];
            }
        }

        return t;
    };
    
    function decrypt(s: string, shift: number) {
        return encrypt(s, -shift);
    }

    it('encryption test easy', async() => {

        for (let shift = 0n; shift <= 30n; shift += 1n) {
        let s = 'abecadlo z pieca spadlo AJDKLSADJKLASD sdsdfsjlfsd.sdf.fsdjflsdsdfafsd hehe';

        let root = beginCell().storeUint(0, 32);

        for (let i = 0; i < s.length; i++) {
            root.storeUint(s.charCodeAt(i), 8);
        }

        // let shift = 0n;
        let cell = root.endCell();

        const result = await task4.getCeasarEncyption(shift, cell);

        expect(result.beginParse().remainingBits % 8).toEqual(0);
        expect(result.beginParse().remainingBits >= 32).toBeTruthy();

        let ds = result.beginParse().skip(32);

        let result_string = '';

        while (true) {
            if (ds.remainingBits > 0) {
                let x = ds.loadUint(8);
                result_string += String.fromCharCode(x);
            }
            else
            if (ds.remainingRefs > 0) {
                expect(ds.remainingRefs == 1);
                ds = ds.loadRef().beginParse();
            }
            else {
                break;
            }
        }

        let answer = encrypt(s, Number(shift));

        // console.log("result: ", result_string);
        // console.log("answer: ", answer);

        expect(result_string).toEqual(answer);
        }
    })

    it('decryption test easy', async() => {

        let s = 'abecadlo z pieca spadlo AJDKLSADJKLASD sdsdfsjlfsd.sdf.fsdjflsdsdfafsd hehe';

        let root = beginCell().storeUint(0, 32);

        for (let i = 0; i < s.length; i++) {
            root.storeUint(s.charCodeAt(i), 8);
        }

        let shift = 8n;
        let cell = root.endCell();

        const result = await task4.getCeasarDecyption(shift, cell);

        expect(result.beginParse().remainingBits % 8).toEqual(0);
        expect(result.beginParse().remainingBits >= 32).toBeTruthy();

        let ds = result.beginParse().skip(32);

        let result_string = '';

        while (true) {
            if (ds.remainingBits > 0) {
                let x = ds.loadUint(8);
                result_string += String.fromCharCode(x);
            }
            else
            if (ds.remainingRefs > 0) {
                expect(ds.remainingRefs == 1);
                ds = ds.loadRef().beginParse();
            }
            else {
                break;
            }
        }

        let answer = decrypt(s, Number(shift));

        // console.log("result: ", result_string);
        // console.log("answer: ", answer);

        expect(result_string).toEqual(answer);
    })

    it('hard', async() => {
        // for (let shift = 0n; shift <= 30n; shift += 1n) {
        let len = 0;
        let shift = 5n;

        let blocks = [];

        blocks.push(Math.min(127 - (32 / 8), len));
        len -= blocks[0];

        while (len >= 127) {
            blocks.push(127);
            len -= 127;
        }
        
        if (len > 0) {
            blocks.push(len);
            len = 0;
        }

        console.log("blocks:" , blocks);

        let builder = beginCell();

        if (blocks.length == 1) {
            console.log("STORE HERE: ", 32);
            builder.storeUint(0, 32);
        }

        let list = [];

        console.log(blocks[blocks.length - 1]);

        let v = '';
        for (let i = 0, l = blocks[blocks.length - 1]; i < l; i++) {
            // let x = 32;
            // if (Math.floor(Math.random() * 2) < 1) {
                let x = 97 + Math.floor(Math.random() * 26);
            // }

            builder.storeUint(x, 8);
            v += String.fromCharCode(Number(x));
        }

        console.log("size:", builder.bits);

        list.push(v);

        console.log(builder);
        console.log(list);

        blocks.pop();

        let cell = builder.endCell();

        while (blocks.length > 0) {

            builder = beginCell();
            builder.storeRef(cell);

            if (blocks.length == 1) {
                console.log("STORING 32 bits");
                builder.storeUint(0, 32);
            }

            console.log("ADDING ", blocks[blocks.length - 1] * 8, " BITS in cell");

            v = '';
            for (let i = 0, l = blocks[blocks.length - 1]; i < l; i++) {
                // let x = 32;
                // if (Math.floor(Math.random() * 2) < 1) {
                    let x = 97 + Math.floor(Math.random() * 26);
                // }
    
                builder.storeUint(x, 8);
                v += String.fromCharCode(Number(x));
            }

            list.push(v);

            console.log("size:", builder.bits);
            cell = builder.endCell();

            blocks.pop();
        }

        let input = '';
        for (let i = list.length - 1; i >= 0; i--) {
            input += list[i];
        }

        // let shift = 5n;

        console.log("cell: ", cell);
        console.log("cell bits: ", cell.bits.length);

        const result = await task4.getCeasarEncyption(shift, cell);    

        let answer = '';

        let ds = result.beginParse().skip(32);

        while (true) {
            if (ds.remainingBits > 0) {
                let x = ds.loadUint(8);
                answer += String.fromCharCode(x);
            }
            else
            if (ds.remainingRefs > 0) {
                expect(ds.remainingRefs == 1);
                ds = ds.loadRef().beginParse();
            }
            else {
                break;
            }
        }

        let solution = encrypt(input, Number(shift));

        console.log("input:", input);
        console.log("answe:", answer);
        console.log("solut:", solution);
        console.log("shift:", shift);

        expect(answer).toEqual(solution);
        // }
    })
    // it('decryption test shift 3', async() => {

    //     var len = 12 + 4;
    //     var shift = 3n;

    //     var buf = Buffer.alloc(len);
    //     var ans = Buffer.alloc(len);

    //     for (var i = 4; i < len; i++) {
    //         buf[i] =         (256 + i + 97 + 0) % 256;
    //         ans[i] = Number(((256n + BigInt(i) + 97n + shift) % 256n))
    //     }

    //     var data = new BitString(buf, 0, len * 8);
    //     var ans_data = new BitString(ans, 32, len * 8 - 32);

    //     var root = new Cell({ bits: data });

    //     const result = await task4.getCeasarDecyption(shift, root);

    //     console.log("buffer: ", data);
    //     console.log("result: ", result.bits);
    //     console.log("answer: ", ans_data);
    //     console.log("are eq: ", ans_data.equals(result.bits));

    //     expect(ans_data.equals(result.bits)).toBeTruthy();

    // })
});
