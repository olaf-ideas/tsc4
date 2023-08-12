def fib(n):
    a, b = 0, 1
    for i in range(n):
        c = a + b
        a = b
        b = c

        assert c < 2**257
        assert a < 2**257
        assert b < 2**257

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
# print(fib_fast(369))
# print(fib_fast(370))

print(fib( 99))
print(fib(100))

print(fib(199))
print(fib(200))

print(fib(299))
print(fib(300))



print(fib(100))
print(fib(101))

print(fib(200))
print(fib(201))

print(fib(300))
print(fib(301))

    
#     s0 PUSH
#     100 GEQINT
#     IF:<{
#       s0 PUSH
#       200 PUSHINT
#       GEQ
#       IF:<{
#         s0 PUSH
#         300 PUSHINT
#         GEQ
#         IF:<{
#           300 PUSHINT
#           SUB
#           222232244629420445529739893461909967206666939096499764990979600 PUSHINT
#           359579325206583560961765665172189099052367214309267232255589801 PUSHINT
          
#         }>ELSE<{
#           200 PUSHINT
#           SUB
#           280571172992510140037611932413038677189525 PUSHINT
#           453973694165307953197296969697410619233826 PUSHINT
#         }>
#       }>ELSE<{
#         100 SUBCONST
#         354224848179261915075 PUSHINT
#         573147844013817084101 PUSHINT
#       }>
#     }>ELSE<{
#       1 PUSHINT
#       0 PUSHINT
#     }>

#     (tuple, ()) ~tpush(tuple t, int value) asm "TPUSH";
# int last(tuple t) asm "LAST";
# int tlen(tuple t) asm "TLEN";
