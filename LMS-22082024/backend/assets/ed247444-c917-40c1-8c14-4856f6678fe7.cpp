#include <iostream>
using namespace std;

int main() {
    int number;
    int sum = 0;

    cout << "Enter positive numbers (enter a non-positive number to stop):" << endl;

    // Loop to read numbers until a non-positive number is entered
    do {
        cin >> number;

        if (number > 0) {
            sum += number; // Add positive numbers to the sum
        }

    } while (number > 0);

    // Display the sum of positive numbers
    cout << "The sum of positive numbers is: " << sum << endl;

    return 0;
}