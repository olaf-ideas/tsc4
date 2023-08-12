import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Tuple, TupleItem, TupleReader } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { debug } from 'console';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    it('A[2x2]xB[2x2]', async() => {

        var A : Tuple = {
            type: 'tuple', 
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 2n}, {"type": "int", "value": 1n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 4n}, ] },
            ]
        };

        var B : Tuple = {
            type: 'tuple', 
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 1n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 0n}, {"type": "int", "value": 1n}, ] },
            ]
        };

        var C = {
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 6n}, {"type": "int", "value": 3n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 9n}, {"type": "int", "value": 7n}, ] },
            ]
        };

        const result = await task2.getMatrixMultiplier(A, B);

        function debug_matrix(M: any) {
            console.log(JSON.stringify(M, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));
        };
        
        debug_matrix(A);
        debug_matrix(B);
        debug_matrix(C);
        debug_matrix(result);

        expect(result).toEqual(C);
    })

    it('A[2x3] X B[3x2]', async() => {

        var A : Tuple = {
            type: 'tuple', 
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 2n}, {"type": "int", "value": 1n}, {"type": "int", "value": 9n} ] },
                { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 4n}, {"type": "int", "value": 5n} ] },
            ]
        };

        var B : Tuple = {
            type: 'tuple', 
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 1n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 0n}, {"type": "int", "value": 1n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 6n}, {"type": "int", "value": 7n}, ] },
            ]
        };

        var C = {
            items: [
                { type: 'tuple', items: [ {"type": "int", "value": 60n}, {"type": "int", "value": 66n}, ] },
                { type: 'tuple', items: [ {"type": "int", "value": 39n}, {"type": "int", "value": 42n}, ] },
            ]
        };

        const result = await task2.getMatrixMultiplier(A, B);

        function debug_matrix(M: any) {
            console.log(JSON.stringify(M, (key, value) =>
                typeof value === 'bigint'
                    ? value.toString()
                    : value
            ));
        };
        
        debug_matrix(A);
        debug_matrix(B);
        debug_matrix(C);
        debug_matrix(result);

        expect(result).toEqual(C);
    })

    // it('A[32x31] X B[31x29]', async() => {

    //     // var n = 32;
    //     // var m = 31;
    //     // var p = 29;

    //     // function randomMatrix(a: number, b: number) {
    //     //     var M: bigint[][] = [];

    //     //     for (var i = 0; i < a; i++) {
    //     //         M[i] = [];
    //     //         for (var j = 0; j < b; j++) {
    //     //             M[i][j] = BigInt(Math.floor(Math.random() * 10));
    //     //         }
    //     //     }

    //     //     return M;
    //     // };

    //     // function toTuple(M: bigint[][]) {
    //     //     var W: TupleItem[] = [];

    //     //     for (var i = 0; i < M.length; i++) {
    //     //         var row: Tuple;

    //     //         for (var j = 0; j < (M.at(i)?.length ?? 0); j++) {

    //     //         }

    //     //         var row_tuple : TupleItem = {
    //     //             type: 'tuple',
    //     //             items: row
    //     //         };

    //     //         W.push(row_tuple);
    //     //     }

    //     // };

    //     // var A : Tuple = {
    //     //     type: 'tuple', 
    //     //     items: [
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 2n}, {"type": "int", "value": 1n}, {"type": "int", "value": 9n} ] },
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 4n}, {"type": "int", "value": 5n} ] },
    //     //     ]
    //     // };

    //     // var B : Tuple = {
    //     //     type: 'tuple', 
    //     //     items: [
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 1n}, ] },
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 0n}, {"type": "int", "value": 1n}, ] },
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 6n}, {"type": "int", "value": 7n}, ] },
    //     //     ]
    //     // };

    //     // var C = {
    //     //     items:  [
    //     //         { type: 'tuple', items: [ {"type": "int", "value": 3n}, {"type": "int", "value": 1n}, ] },
    //     //     ]
    //     // };

    //     // C.items.pop();
        
    //     // for (var i = 0; i < n; i++) {
    //     //     var row = { type: 'tuple', items: [] }
    //     //     // { type: 'tuple', items: [ {"type": "int", "value": 60n}, {"type": "int", "value": 66n}, ] },
    //     //     // { type: 'tuple', items: [ {"type": "int", "value": 39n}, {"type": "int", "value": 42n}, ] },
        
    //     //     for (var j = 0; j < p; j++) {
    //     //         var sum = 0n;

    //     //         for (var k = 0; k < m; k++) {
    //     //             var Arow = A.items.at(i);

    //     //             sum += A.items.at(i)
    //     //             sum = sum + A.items.at(i).items.at(k).value * B.items.at(k).items.at(j).value;
    //     //         }

    //     //         row.items.push( { type: 'int', value: sum } )
    //     //     }

    //     //     C.items.push(row);
    //     // }

    //     // const result = await task2.getMatrixMultiplier(A, B);

    //     // function debug_matrix(M: any) {
    //     //     console.log(JSON.stringify(M, (key, value) =>
    //     //         typeof value === 'bigint'
    //     //             ? value.toString()
    //     //             : value
    //     //     ));
    //     // };
        
    //     // debug_matrix(A);
    //     // debug_matrix(B);
    //     // debug_matrix(C);
    //     // debug_matrix(result);

    //     // expect(result).toEqual(C);
    // })
});
