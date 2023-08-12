def fib(n):
  if n == -1:
    return 1

  a, b = 0, 1
  for i in range(n):
    c = a + b
    a = b
    b = c

    # assert c < 2**257
    # assert a < 2**257
    # assert b < 2**257

  return a

def jazda(l, r):
  if (abs(r - l) < 15):
    if (l <= 127):
      print(l, "SUBINT")
    else:
      print(l, "PUSHINT")
      print("SUB")

    print(fib(l - 1), "PUSHINT")
    print(fib(l), "PUSHINT")
    return

  m = (l + r) >> 1
  print("s0 PUSH")
  
  if (m < 2**7):
    print(m, "LEQINT")
  else:
    print(m, "PUSHINT")
    print("LEQ")

  print("IF:<{")
  jazda(l, m)
  print("}>ELSE<{")
  jazda(m + 1, r)
  print("}>")


jazda(0, 370 - 1)
    
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
