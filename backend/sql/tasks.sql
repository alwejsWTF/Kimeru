INSERT INTO "task" (name, description, points) VALUES
    ('Square of Number', 'Write a program that squares the integer value given as input.', 1),
    ('Sum of Two Numbers', 'Create a program that takes two numbers as input from the user and prints their sum.', 1),
    ('Even or Odd', 'Write a program that prints whether the given number is even or odd.', 2),
    ('Factorial Calculator','Develop a program that calculates the factorial of a given positive integer.', 8),
    ('String Reversal', 'Write a program that takes a string input from the user and prints the string in reverse order.', 3),
    ('Fibonacci Sequence', 'Create a program that prints the first n numbers in the Fibonacci sequence seperated by a comma and a space, where n is provided by the user.', 7),
    ('Prime Number Checker', 'Write a program that checks whether a given number is a prime number or not.', 6),
    ('Simple Calculator', 'Develop a basic calculator program that can perform addition, subtraction, multiplication, and division based on user input. Program should take 3 parameters seperated by space in a string variable. The first parameter is a math operation ("add", "subtract", "multiply", "divide") and the next two parameters are numbers based on which the operation will be performed.', 4),
    ('Palindrome Checker', 'Write a program that checks if a given string is a palindrome (reads the same backward as forward).', 5),
    ('Number to Words Converter', 'Write a program that converts a given integer (between 1 and 100) to its corresponding English words. For example, if the user inputs 23, the program should output "twenty-three".', 10);

INSERT INTO "tests" (task, input, expected_output) VALUES
    (1, '0', '0'), (1, '2', '4'), (1, '7', '49'), (1, '-3', '9'),
    (2, '3 5', '8'), (2, '10 20', '30'), (2, '-5 5', '0'), (2, '-3 -7', '-10'),
    (3, '4', 'even'), (3, '17', 'odd'), (3, '99', 'odd'), (3, '1024', 'even'),
    (4, '0', '1'), (4, '1', '1'), (4, '5', '120'), (4, '7', '5040'),
    (5, 'politechnika', 'akinhcetilop'), (5, 'abc', 'cba'), (5, 'jungle diff', 'ffid elgnuj'), (5, '12345', '54321'),
    (6, '1', '0'), (6, '2', '0, 1'), (6, '5', '0, 1, 1, 2, 3'), (6, '10', '0, 1, 1, 2, 3, 5, 8, 13, 21, 34'),
    (7, '2', 'true'), (7, '4', 'false'), (7, '13', 'true'), (7, '20', 'false'),
    (8, 'add 3 5', '8'), (8, 'subtract 10 4', '6'), (8, 'multiply 2 3', '6'), (8, 'divide 20 4', '5'),
    (9, 'racecar', 'true'), (9, 'hello', 'false'), (9, 'madam', 'true'), (9, 'step on no pets', 'true'),
    (10, '1', 'one'), (10, '29', 'twenty-nine'), (10, '45', 'forty-five'), (10, '100', 'one hundred');


INSERT INTO "tag" (name) VALUES
    ('Beginner'),
    ('Basics'),
    ('Loops'),
    ('Conditionals'),
    ('StringManipulation'),
    ('Math'),
    ('Algorithms'),
    ('Intermediate');

INSERT INTO "task_tag" (task, tag) VALUES
    (1, 1), (1, 6),
    (2, 1), (2, 6),
    (3, 1), (3, 4), (3, 6),
    (4, 3), (4, 4), (4, 6), (4, 7), (4, 8),
    (5, 1), (5, 3), (5, 5),
    (6, 3), (6, 4), (6, 7), (6, 8),
    (7, 3), (7, 4), (7, 6), (7, 7), (7, 8),
    (8, 2), (8, 4), (8, 6),
    (9, 2), (9, 4), (9, 5),
    (10, 4), (10, 5), (10, 8);
