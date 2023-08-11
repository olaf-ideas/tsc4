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

    function solve(flag: string, value: string, list: string) {
        return list.replaceAll(flag.toString(2), value.toString(2));
    };

    it('should work on this simple test', async () => {

        let linked_list = beginCell();
        
        let list = '011101110';

        for (let i = 0; i < list.length; i++) {

            linked_list.storeBit(Number(list.at(i)));
        }

        let linked_list_cell = linked_list.endCell();

        let flag =  0b111n;
        let value = 0b1n;

        console.log("input : ", list);
        console.log("flag: ", flag);
        console.log("value: ", value);
        console.log("cell: ", linked_list_cell.toString());

        const result = await task3.getFindAndReplace(flag, value, linked_list_cell);

        let result_list = '';

        for (let i = 0; i < result.bits.length; i++) {
            result_list += Number(result.bits.at(i))
        }

        expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));
    });

    it('should work on this hard test', async () => {

        for (let rep = 0; rep < 100; rep++) {

            let linked_list = beginCell();
            
            let list = ''

            for (let i = 0; i < 512; i++) {
                let x = Math.round(Math.random());

                list += x.toString();

                linked_list.storeBit(Number(list.at(i)));
            }

            let linked_list_cell = linked_list.endCell();

            let flag =  Math.round(Math.random() * 10000);
            let value = Math.round(Math.random() * 10000)

            console.log("input : ", list);
            console.log("flag: ", flag.toString(2));
            console.log("value: ", value.toString(2));
            console.log("cell: ", linked_list_cell.toString());

            const result = await task3.getFindAndReplace(BigInt(flag), BigInt(value), linked_list_cell);

            let result_list = '';

            for (let i = 0; i < result.bits.length; i++) {
                result_list += Number(result.bits.at(i))
            }

            expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));

        }
    });
});