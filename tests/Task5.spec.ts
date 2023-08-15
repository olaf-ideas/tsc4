import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, TupleReader, toNano } from 'ton-core';
import { Task5 } from '../wrappers/Task5';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { getFileInfo } from 'prettier';

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

    it('should work', async() => {
        const result = await task5.getFibonacciSequence(1n, 3n);

        // console.log("result: ", result);
    });

    it('should pass this test', async() => {

        const result = await task5.getFibonacciSequence(1n, 3n);

        // console.log("result: ", result);
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

        // console.log("result: ", result);
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

    it('should pass this test 3', async() => {

        const result = await task5.getFibonacciSequence(100n, 0n);

        // console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                ]
            }
        );
    })

    // it('should pass this test 4', async() => {

    //     const result = await task5.getFibonacciSequence(370n, 0n);

    //     // console.log("result: ", result);
    //     expect(result).toEqual(
    //         {"items": 
    //             [
    //             ]
    //         }
    //     );
    // })

    it ('should work on every single', async() => {
        for (let n = 0n; n <= 370n; n += 1n) {
            const result = await task5.getFibonacciSequence(n, 1n);
        }
    })

    it('should pass this test 5', async() => {

        const result = await task5.getFibonacciSequence(369n, 1n);

        // console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                    {"type": "int", "value": 58472848379039952684853851736901133239741266891456844557261755914039063645794n }, 
                ]
            }
        );
    })

    it('should pass this test MAX', async() => {

        const result = await task5.getFibonacciSequence(370n, 1n);

        // console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                    {"type": "int", "value": 94611056096305838013295371573764256526437182762229865607320618320601813254535n }, 
                ]
            }
        );
    })

    it('should pass this test 6', async() => {

        const result = await task5.getFibonacciSequence(0n, 0n);

        // console.log("result: ", result);
        expect(result).toEqual(
            {"items": 
                [
                ]
            }
        );
    })

    // it('just show me the results', async() => {
    //     const result = await task5.getFibonacciSequence(116n, 254n);

    //     // console.log("result: ", result);
    // })

    // it('just show me the results', async() => {
    //     const result = await task5.getFibonacciSequence(0n, 255n);

    //     // console.log("result: ", result);
    // })

    // it('just show me the results', async() => {
    //     const result = await task5.getFibonacciSequence(116n, 255n);

    //     // console.log("result: ", result);
    // })

    it('show me the cost', async() => {

        let cost = 0n;

        for (var n = 300; n <= 370; n++) {
            for (var k = 0; k <= 10; k++) {
                if (n < 0 || n > 370 || n + k < 0 || n + k > 371 || k < 0 || k > 255)
                    continue;
                
                cost += await task5.getFibonaaciSequenceCost(BigInt(n), BigInt(k));
            }
        }

        console.log("COST: ", cost);
    })

    // it('test all', async() => {
    //     //  sequence from N to N+K terms (0<=N<=370; 0<=N+K<=370; 0<=K<=255). 
    //     for (var n = 365; n <= 370; n++) {
    //         for (var k = 0; k <= 255; k++) {
    //             if (n < 0 || n > 370 || n + k < 0 || n + k > 371 || k < 0 || k > 255)
    //                 continue;
                
    //             // console.log("testing: ", n, k);

    //             const result = await task5.getFibonacciSequence(BigInt(n), BigInt(k));
                
    //             const answer = {"items": [
    //                 {"type": "int", "value": 0n}
    //             ]};

    //             answer.items.pop();

    //             var a = 0n, b = 1n;

    //             for (var i = 0; i < n; i++) {
    //                 var c = a + b;
    //                 a = b;
    //                 b = c;
    //             }

    //             for (var i = 0; i < k; i++) {
    //                 answer.items.push({"type": "int", "value": a});

    //                 var c = a + b;
    //                 a = b;
    //                 b = c;
    //             }
                
    //             // console.log("n: ", n, "k: ", k);
    //             // console.log(answer);

    //             expect(result).toEqual(answer);
    //         }
    //     }
    // })
});
