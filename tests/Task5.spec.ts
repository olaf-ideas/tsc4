import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, TupleReader, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task5', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task5');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let task5: SandboxContract<Task5>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task5 = blockchain.openContract(Task5.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await task5.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task5.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task5 are ready to use
    });

    it('should pass this test', async() => {

        const result = await task5.getFibonacciSequence(1n, 3n);

        console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                    {"type": "int", "value": 1n}, 
                    {"type": "int", "value": 1n}, 
                    {"type": "int", "value": 2n},
                ]
            }
        );
    })

    it('should pass this test 2', async() => {

        const result = await task5.getFibonacciSequence(201n, 4n);

        console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                    {"type": "int", "value": 453973694165307953197296969697410619233826n}, 
                    {"type": "int", "value": 734544867157818093234908902110449296423351n}, 
                    {"type": "int", "value": 1188518561323126046432205871807859915657177n},
                    {"type": "int", "value": 1923063428480944139667114773918309212080528n},
                ]
            }
        );
    })
});
