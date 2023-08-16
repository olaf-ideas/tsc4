import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano, beginCell } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task1 are ready to use
    });

    it('test cell', async() => {

        let cell1 = beginCell().endCell();
        let cell = beginCell().storeRef(cell1).endCell();
    

        const result = await task1.getCell(0n, cell);

        console.log("result: ", result);
    });

    it('big empty test', async() => {
        let leafs = 1000;

        let all_cells = [];
        let active = [];

        for (let i = 0; i < leafs; i++) {
            let cell = beginCell().endCell();

            all_cells.push(cell);
            active.push(cell);
        }

        const shuffle = (array: Cell[]) => { 
            return array.map((a) => ({ sort: Math.random(), value: a }))
                .sort((a, b) => a.sort - b.sort)
                .map((a) => a.value); 
        }; 

        while (active.length > 1) {
            let x = Math.min(4, Math.floor(Math.random() * active.length) + 1);
            active = shuffle(active);

            let cell = beginCell();

            while (x > 0) {
                cell.storeRef(active[active.length - 1]);
                active.pop();
                x -= 1;
            }

            let y = cell.endCell();
            active.push(y);
            all_cells.push(y);
        }

        expect(active.length).toEqual(1);

        let root = active[0];
        let find_me = all_cells[Math.floor(Math.random() * all_cells.length)];

        const result = task1.getCell(BigInt("0"), root);
    })
});
