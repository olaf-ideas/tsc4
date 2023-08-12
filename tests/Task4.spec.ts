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

                if (x > 'z'.charCodeAt(0))
                    x -= 26;
                
                t += String.fromCharCode(x);
            }
            else
            if ('A' <= s[i] && s[i] <= 'Z') {
                let x = s.charCodeAt(i) + shift;

                if (x > 'Z'.charCodeAt(0))
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

    it('encryption test', async() => {

        let s = 'abecadlo z pieca spadlo AJDKLSADJKLASD sdsdfsjlfsd.sdf.fsdjflsdsdfafsd hehe';

        let root = beginCell().storeUint(0, 32);

        for (let i = 0; i < s.length; i++) {
            root.storeUint(s.charCodeAt(i), 8);
        }

        let shift = 8n;
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
    })

    it('decryption test', async() => {

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
