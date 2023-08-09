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
            bq = b * q
            b = a * q + bq + b * p
            a = a * p + bq
        
        qq = q * q
        q = 2 * p * q + qq
        p = p * p + qq

        n >>= 1

    return a, b

for i in range(80):
    print(fib(i), fib_fast(i))

print(fib(369))
print(fib_fast(369))