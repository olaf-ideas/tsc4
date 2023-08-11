import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder, Slice, Tuple, BitString, beginCell } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { task4ConfigToCell } from '../wrappers/Task4';

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

    it('should work on this simple test', async () => {

        let len = 4 * 5;

        let linked_list = beginCell();
        
        let list = '';

        for (let i = 0; i < len; i++) {

            let value: number = (i % 4 < 3 ? 0 : 1);
            list += value.toString();

            linked_list.storeBit(value);
        }

        let linked_list_cell = linked_list.endCell();

        let flag =  0b1000n;
        let value = 0b1001n;

        let hexToBin = require('hex-to-binary');

        console.log("input : ", list.toString());
        console.log("flag: ", flag);
        console.log("value: ", value);
        console.log("cell: ", linked_list_cell.toString());

        const result = await task3.getFindAndReplace(flag, value, linked_list_cell);

        console.log("bits: ", result.bits.toString());
        console.log("result: ", hexToBin(result.bits.toString()));

    });
});