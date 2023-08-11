import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder, Slice, Tuple, BitString, beginCell } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { task4ConfigToCell } from '../wrappers/Task4';
import assert from 'assert';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task3 are ready to use
    });

    function solve(flag: string, value: string, list: string) {
        return list.replaceAll(flag, value);
    };

    // it('small test on one cell', async () => {
        
    //     for (let xx = 1; xx < 50; xx++) {
    //         console.log("test: ", xx);
    //         let input = '';

    //         let xddd = Math.round(Math.random() * 1000);

    //         let seed = xx;
    //         for (let i = 0; i < xddd; i++) {
    //             input += (seed % 2).toString();

    //             seed ^= seed << 13;
    //             seed ^= seed >> 17;
    //             seed ^= seed << 5;
    //             seed %= 1024;
    //         }

    //         let flag = BigInt(Math.round(Math.random() * 10000000) + 1);
    //         let value = BigInt(Math.round(Math.random() * 10000000) + 1);

    //         console.log("len: ", input.length);
    //         console.log("flag: ", flag.toString(2));
    //         console.log("value: ", value.toString(2));

    //         let chunks = [5, 2, 150, 160, 300, 200, 500];

    //         let last_cell = beginCell().endCell();

    //         let cell_input = input;
    //         for (let i = 0; cell_input.length > 0; i++) {

    //             let len = Math.min(cell_input.length, chunks[i % chunks.length]);

    //             let memory = cell_input.slice(cell_input.length - len, cell_input.length);

    //             cell_input = cell_input.slice(0, cell_input.length - len);

    //             // console.log("memory: ", memory);

    //             let builder = beginCell();

    //             for (let j = 0; j < memory.length; j++) {
    //                 builder.storeBit(Number(memory[j]));
    //             }
                
    //             if (last_cell.bits.length > 0) {
    //                 builder.storeRef(last_cell);
    //             }

    //             let next_cell = builder.endCell();

    //             last_cell = next_cell;
    //         }

    //         // console.log("input:", input);

    //         // console.log("linked list: ", last_cell);

    //         const result = await task3.getFindAndReplace(flag, value, last_cell);

    //         // console.log("result list: ", result);

    //         let answer_bits = solve(Number(flag).toString(2), Number(value).toString(2), input);

    //         let result_bits = '';
    //         let node = result;

    //         while (true) {
    //             for (let i = 0; i < node.bits.length; i++) {
    //                 result_bits += Number(node.bits.at(i));
    //             }

    //             if (node.refs.length == 0) {
    //                 break;
    //             }

    //             expect(node.refs.length).toEqual(1);

    //             node = node.refs[0];
    //         }

    //         // console.log("result bits: ", result_bits);
    //         // console.log("answer bits: ", answer_bits);

    //         expect(result_bits).toEqual(answer_bits);
    //     }
    // });

    it('small test on one cell 2', async () => {
        let input = '01110';

        let seed = 1;
        for (let i = 0; i < 4000; i++) {
            input += (seed % 2).toString();

            seed ^= seed << 13;
            seed ^= seed >> 17;
            seed ^= seed << 5;
            seed %= 2137;
        }

        let flag = 0b1101n;
        let value = 0b1n;

        let chunks = [1023, 1023, 900, 950, 990];

        let last_cell = beginCell().endCell();

        let cell_input = input;
        for (let i = 0; cell_input.length > 0; i++) {

            let len = Math.min(cell_input.length, chunks[i % chunks.length]);

            let memory = cell_input.slice(cell_input.length - len, cell_input.length);

            cell_input = cell_input.slice(0, cell_input.length - len);

            // console.log("memory: ", memory);

            let builder = beginCell();

            for (let j = 0; j < memory.length; j++) {
                builder.storeBit(Number(memory[j]));
            }
            
            if (last_cell.bits.length > 0) {
                builder.storeRef(last_cell);
            }

            let next_cell = builder.endCell();

            last_cell = next_cell;
        }

        // console.log("len: ", input.length);
        // console.log("flag: ", flag.toString(2));
        // console.log("value: ", value.toString(2));
        // console.log("input:", input);

        // console.log("linked list: ", last_cell);

        const result = await task3.getFindAndReplace(flag, value, last_cell);

        // console.log("result list: ", result);

        let answer_bits = solve(Number(flag).toString(2), Number(value).toString(2), input);

        let result_bits = '';
        let node = result;

        let cnt = 1;
        while (true) {
            for (let i = 0; i < node.bits.length; i++) {
                result_bits += Number(node.bits.at(i));
            }

            if (node.refs.length == 0) {
                break;
            }

            cnt += 1;

            expect(node.refs.length).toEqual(1);

            node = node.refs[0];
        }

        // console.log("cnt: ", cnt);
        // console.log("input  bits; ", input);
        // console.log("result bits: ", result_bits);
        // console.log("answer bits: ", answer_bits);

        expect(result_bits).toEqual(answer_bits);
    });
});