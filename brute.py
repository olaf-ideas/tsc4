def fib(n):
    a, b = 0, 1
    for i in range(n):
        c = a + b
        a = b
        b = c
    return a

for i in range(80):
    print(fib(i))
