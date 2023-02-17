const arr1 = ['kumar', 'bala', 'surya', 'mahesh', 'gokul', 'pandi', 'bala', 'surya'];
console.log(arr1);

const arr2 = {...new Set(arr1)};
console.log(arr2);

const arrUnique = [...new Set(arr1)];
console.log(arrUnique);


