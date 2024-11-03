def solve(nums, target):
    # TODO: implement solution here
    pass


def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    res = solve(a, k)
    print(res)


if __name__ == "__main__":
    main()
