// TASK ZJ:
// Shunday function yozing, u berilgan array ichidagi
// raqamlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]); return 8;
// Yuqoridagi misolda, array nested bo'lgan holdatda ham,
// bizning function ularning yig'indisini hisoblab qaytarmoqda.

function reduceNestedArray(arr: (number | (number | (number | number[])[])[])[]): number {
    let stack: (number | (number | (number | number[])[])[])[] = [...arr];
    let sum = 0;
    while (stack.length) {
        let item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item);
        } else {
            sum += item as number;
        }
    }
    return sum;
}
// console.log(reduceNestedArray([1, [1, 2, [4]]]));

// TASK ZK:
// Shunday function yozing, bu function har bir soniyada bir marotaba
// console'ga 1'dan 5'gacha bo'lgan raqamlarni chop etsin va
// 5 soniyadan so'ng function o'z ishini to'xtatsin
// MASALAN: printNumbers();

const printNumbersForEvery2Sec = (n: number) => {
    for (let i = 1; i <= n; i++) {
        setTimeout(() => {
            console.log(i)
        }, i * 2000)
    }
}
printNumbersForEvery2Sec(5);