class Node {
    constructor(x, y, index, neighbors) {
      this.x = x;
      this.y = y;
      this.index = index;
      this.neighbors = neighbors;
    }
}
/*
console.log('YPP');
let node = new Node(22, 1, 2, []);
let arr = [];
arr.push(node);
node.neighbors.push(new Node(2,3,4 , [1,2]));
console.log(node.neighbors);
console.log(JSON.parse(JSON.stringify(node)).neighbors);
*/
let v0 = new Node(1,1,1,[]);
let v1 = new Node(2,2,2, []);
let list = [];
list.push(v0);
list.push(v1);
// finding v1
let v2 = list.find(node => {
  return node.index == 2;
});
console.log('index of v1 is: ' + v1.index + ' and of v2 is: ' + v2.index);
v2.index = 4;
console.log('index of v1 is: ' + v1.index + ' and of v2 is: ' + v2.index);
let map = new Map();
map.set(v0, 2);
map.set(v0,3)
console.log(map.get(v0));


