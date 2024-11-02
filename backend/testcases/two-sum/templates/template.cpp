#include <bits/stdc++.h>

using namespace std;

vector<int> solve(vector<int> &nums, int target) {}

int main() {
  int n, k;
  cin >> n >> k;
  vector<int> a(n);
  for (int i = 0; i < n; i++) {
    cin >> a[i];
  }
  vector<int> res = solve(a, k);
  for (size_t i = 0; i < res.size(); i++) {
    cout << res[i] << " ";
  }
  cout << '\n';
}
