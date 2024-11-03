import java.util.Scanner;

public class Main {
  private static int[] solve(int[] nums, int target) {}
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt(), k = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i<n; i++) {
      a[i] = sc.nextInt();
    }
    int[] res = solve(a, k);
    for (int i = 0; i<res.length; i++) {
      System.out.printf("%d ", res[i]);
    }
    System.out.println();
  }
}
