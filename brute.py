from math import *

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

def pushint_gas(x):
  if x <= 10:
    return 18
  if x <= 127:
    return 26
  if x < 2**15:
    return 34

  l = int(ceil(log(x, 8)))
  return 10 + 8 * l + 32

def gt_int_gas(x):
  # adding the IF and s0 PUSH 
  if x < 2**7:
    return 18 + 18 + 26

  return 18 + pushint_gas(x) + 18 + 18

def rest_gas(n1, n2):
  assert n1 <= n2
  """
    ROT
    REPEAT
      TUCK
      ADD
    ROT
    s0 PUSH
    1 SUBCONST
    ... rest is k dependent  
  """
  return (18 + 18 + (18 + 18) * (n2 - n1) + 18 + 18 + 18) * (370 - n1 + 1)

def hmmm(l, r):
  result = 0
  for i in range(l, r + 1):
    result += 370 - i + 1
  return result

def brute_all(l, r):
  cost = 0
  for i in range(l, r + 1):
    cost += rest_gas(l, r) * (370 - i + 1)
  return cost

cache = dict([])

eee = hmmm(0, 370)

def best_value(l, r):
  if (l, r) in cache:
    return cache[(l, r)]

  # print("calculating: ", l, r)

  best_cost = hmmm(l, r) * (pushint_gas(l) + 18 + pushint_gas(fib(l - 1)) + pushint_gas(fib(l))) + brute_all(l, r) + \
              (pushint_gas(l) + 18 + 18 + pushint_gas(fib(l - 1)) + 18 + pushint_gas(fib(l)) + 18) * eee

  best_data = str(l) + ' INT\n' + \
              'SUB\n' + \
              str(fib(l - 1)) + ' INT\n' + \
              str(fib(l)) + ' INT\n'

  for k in range(l, r):
    new_data = 'DUP\n'
    new_cost = 18 * eee

    if k < 2**7:
      new_data += str(k) + ' GTINT\n'
      new_cost += (pushint_gas(k) + 26) * eee
    else:
      new_data += str(k) + ' INT\n' + \
                  'GREATER\n'
      new_cost += (pushint_gas(k) + 18 + 18) * eee

    (L_data, L_cost) = best_value(l, k + 0)
    (R_data, R_cost) = best_value(k + 1, r)

    new_cost += gt_int_gas(k) * hmmm(l, r) + L_cost + R_cost

    new_data += 'IF:<{\n'
    new_data += R_data
    new_data += '}>ELSE<{\n'
    new_data += L_data
    new_data += '}>\n'

    new_cost += (18 + 18) * eee

    if best_cost > new_cost:
      best_cost = new_cost
      best_data = new_data
  
  cache[(l, r)] = (best_data, best_cost)

  return (best_data, best_cost)


def jazda(l, r):
  if (abs(r - l) <= 20):
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
  
  if (m <= 127):
    print(m, "LEQINT")
  else:
    print(m, "PUSHINT")
    print("LEQ")

  print("IF:<{")
  jazda(l, m)
  print("}>ELSE<{")
  jazda(m + 1, r)
  print("}>")


jazda(0, 370)

# (data, cost) = best_value(0, 370)

# print(data)
# print("cost: ", cost)

# jazda(0, 370)
    
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
