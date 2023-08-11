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
        return list.replaceAll(flag, value);
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

        // console.log("input : ", list);
        // console.log("flag: ", flag);
        // console.log("value: ", value);
        // console.log("cell: ", linked_list_cell.toString());

        const result = await task3.getFindAndReplace(flag, value, linked_list_cell);

        let result_list = '';

        for (let i = 0; i < result.bits.length; i++) {
            result_list += Number(result.bits.at(i))
        }

        expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));
    });

    it('should work on this hard test', async () => {

        for (let rep = 0; rep < 10; rep++) {

            let linked_list = beginCell();
            
            let list = ''

            for (let i = 0; i < 512; i++) {
                let x = Math.round(Math.random());

                list += x.toString();

                linked_list.storeBit(Number(list.at(i)));
            }

            let linked_list_cell = linked_list.endCell();

            let flag =  0b1011101;
            let value = 0b1110011;

            // console.log("input : ", list);
            // console.log("flag: ", flag.toString(2));
            // console.log("value: ", value.toString(2));
            // console.log("cell: ", linked_list_cell.toString());

            const result = await task3.getFindAndReplace(BigInt(flag), BigInt(value), linked_list_cell);

            let result_list = '';

            for (let i = 0; i < result.bits.length; i++) {
                result_list += Number(result.bits.at(i))
            }

            expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));

        }
    });

    it('should work on this linked list x2', async () => {

        let linked_list1 = beginCell();
        let linked_list2 = beginCell();
        
        let list = ''

        for (let i = 0; i < 12; i++) {
            let x = (i * 21 + 11) % 2;

            list += x.toString();

            linked_list1.storeBit(x);
        }

        for (let i = 0; i < 20; i++) {
            let x = (i * 10 + 11) % 2;

            list += x.toString();

            linked_list2.storeBit(x);
        }

        let linked_list_cell2 = linked_list2.endCell();

        linked_list1.storeRef(linked_list_cell2);

        let linked_list_cell1 = linked_list1.endCell();

        let flag =  0b1011;
        let value = 0b1001;

        console.log("input : ", list);
        console.log("flag: ", flag.toString(2));
        console.log("value: ", value.toString(2));
        console.log("cell 1: ", linked_list_cell1.toString());
        console.log("cell 2: ", linked_list_cell2.toString());

        const answer = solve(flag.toString(2), value.toString(2), list);

        const result = await task3.getFindAndReplace(BigInt(flag), BigInt(value), linked_list_cell1);

        let result_list = '';

        for (let i = 0; i < result.bits.length; i++) {
            result_list += Number(result.bits.at(i));
        }

        result_list += '|'

        let neigh = result.refs.at(0) ?? result;

        for (let i = 0; i < neigh.bits.length; i++) {
            result_list += Number(neigh.bits.at(i));
        }

        console.log("result: ", result_list);
        console.log("answer: ", answer);

        // expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));
    });

    it('should work on this linked list x2 hard', async () => {

        let linked_list1 = beginCell();
        let linked_list2 = beginCell();
        
        let list = ''

        let cellA = '10100001011';
        for (let i = 0; i < cellA.length; i++) {
            let x = Number(cellA[i])

            list += x.toString();

            linked_list1.storeBit(x);
        }

        let cellB = '10101000111111';
        for (let i = 0; i < cellB.length; i++) {
            
            let x = Number(cellB[i]);

            list += x.toString();

            linked_list2.storeBit(x);
        }

        let linked_list_cell2 = linked_list2.endCell();

        linked_list1.storeRef(linked_list2);

        let linked_list_cell1 = linked_list1.endCell();

        let flag =  0b101011101;
        let value = 0b111111111;

        console.log("input : ", list);
        console.log("flag: ", flag.toString(2));
        console.log("value: ", value.toString(2));
        console.log("cell 1: ", linked_list_cell1.toString());
        console.log("cell 2: ", linked_list_cell2.toString());

        const answer = solve(flag.toString(2), value.toString(2), list);

        const result = await task3.getFindAndReplace(BigInt(flag), BigInt(value), linked_list_cell1);

        let result_list = '';

        for (let i = 0; i < result.bits.length; i++) {
            result_list += Number(result.bits.at(i));
        }

        let neigh = result.refs.at(0) ?? result;

        result_list += '|';

        for (let i = 0; i < neigh.bits.length; i++) {
            result_list += Number(neigh.bits.at(i));
        }

        console.log("result: ", result_list);
        console.log("answer: ", answer);

        // expect(result_list).toEqual(solve(flag.toString(2), value.toString(2), list));
    });
});