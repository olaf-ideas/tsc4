import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { BitString, Cell, toNano } from 'ton-core';
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

    it('encryption test shift 0', async() => {

        var len = 12 + 4;
        var shift = 0n;

        var buf = Buffer.alloc(len);
        var ans = Buffer.alloc(len);

        for (var i = 4; i < len; i++) {
            buf[i] = (i + 97 + 0) % 256;
            ans[i] = Number(((BigInt(i) + 97n - shift) % 256n))
        }

        var data = new BitString(buf, 0, len * 8);
        var ans_data = new BitString(ans, 32, len * 8 - 32);

        var root = new Cell({ bits: data });

        const result = await task4.getCeasarEncyption(shift, root);

        console.log("buffer: ", data);
        console.log("result: ", result.bits);
        console.log("answer: ", ans_data);
        console.log("are eq: ", ans_data.equals(result.bits));

        expect(ans_data.equals(result.bits)).toBeTruthy();

    })

    it('encryption test shift 3', async() => {

        var len = 12 + 4;
        var shift = 3n;

        var buf = Buffer.alloc(len);
        var ans = Buffer.alloc(len);

        for (var i = 4; i < len; i++) {
            buf[i] =         (256 + i + 97 + 0) % 256;
            ans[i] = Number(((256n + BigInt(i) + 97n - shift) % 256n))
        }

        var data = new BitString(buf, 0, len * 8);
        var ans_data = new BitString(ans, 32, len * 8 - 32);

        var root = new Cell({ bits: data });

        const result = await task4.getCeasarEncyption(shift, root);

        console.log("buffer: ", data);
        console.log("result: ", result.bits);
        console.log("answer: ", ans_data);
        console.log("are eq: ", ans_data.equals(result.bits));

        expect(ans_data.equals(result.bits)).toBeTruthy();

    })

    it('encryption test shift 3 hard', async() => {

        var len = 12 + 4;
        var shift = 3n;

        var buf = Buffer.alloc(len);
        var ans = Buffer.alloc(len);

        for (var i = 4; i < len; i++) {
            buf[i] =         (256 + i - 4 + 0) % 256;
            ans[i] = Number(((256n + BigInt(i) - 4n - shift) % 256n))
        }

        var data = new BitString(buf, 0, len * 8);
        var ans_data = new BitString(ans, 32, len * 8 - 32);

        var root = new Cell({ bits: data });

        const result = await task4.getCeasarEncyption(shift, root);

        console.log("buffer: ", data);
        console.log("result: ", result.bits);
        console.log("answer: ", ans_data);
        console.log("are eq: ", ans_data.equals(result.bits));

        expect(ans_data.equals(result.bits)).toBeTruthy();

    })

    it('decryption test shift 0', async() => {

        var len = 12 + 4;
        var shift = 0n;

        var buf = Buffer.alloc(len);
        var ans = Buffer.alloc(len);

        for (var i = 4; i < len; i++) {
            buf[i] =         (256 + i + 97 + 0) % 256;
            ans[i] = Number(((256n + BigInt(i) + 97n + shift) % 256n))
        }

        var data = new BitString(buf, 0, len * 8);
        var ans_data = new BitString(ans, 32, len * 8 - 32);

        var root = new Cell({ bits: data });

        const result = await task4.getCeasarDecyption(shift, root);

        console.log("buffer: ", data);
        console.log("result: ", result.bits);
        console.log("answer: ", ans_data);
        console.log("are eq: ", ans_data.equals(result.bits));

        expect(ans_data.equals(result.bits)).toBeTruthy();

    })

    it('decryption test shift 3', async() => {

        var len = 12 + 4;
        var shift = 3n;

        var buf = Buffer.alloc(len);
        var ans = Buffer.alloc(len);

        for (var i = 4; i < len; i++) {
            buf[i] =         (256 + i + 97 + 0) % 256;
            ans[i] = Number(((256n + BigInt(i) + 97n + shift) % 256n))
        }

        var data = new BitString(buf, 0, len * 8);
        var ans_data = new BitString(ans, 32, len * 8 - 32);

        var root = new Cell({ bits: data });

        const result = await task4.getCeasarDecyption(shift, root);

        console.log("buffer: ", data);
        console.log("result: ", result.bits);
        console.log("answer: ", ans_data);
        console.log("are eq: ", ans_data.equals(result.bits));

        expect(ans_data.equals(result.bits)).toBeTruthy();

    })
});
