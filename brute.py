def fib(n):
    a, b = 0, 1
    for i in range(n):
        c = a + b
        a = b
        b = c
    return a

def fib_fast(n):
    b, a, p, q = 1, 0, 0, 1

    while n > 0:
        if n % 2 == 1:
            print("hee")
            bq = b * q
            b = a * q + bq + b * p
            a = a * p + bq
        
        if n > 1:
            print("hmm")
            qq = q * q
            q = 2 * p * q + qq
            p = p * p + qq

        print(a, b, p, q)

        assert p < 2**257
        assert q < 2**257
        assert a < 2**257
        assert b < 2**257
        
        n >>= 1

    return a, b

for i in range(370):
    assert(fib(i) == fib_fast(i)[0])
    print(fib(i), fib_fast(i))

print ("testing big")

print(fib(369))
print(fib_fast(369))
# print(fib_fast(370))